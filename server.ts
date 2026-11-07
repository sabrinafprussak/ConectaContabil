import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { 
  retrieveRelevantKnowledge, 
  OFFICIAL_RAG_KNOWLEDGE_BASE, 
  generateAccessibleAnswer,
  MANDATORY_INSUFFICIENT_INFO_MESSAGE,
  detectTaxDomain,
  isQueryInFiscalScope,
  validateFiscalAnswer
} from './src/data/ragKnowledgeBase.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function with strict timeout so responses are always fast
function promiseWithTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout after ${ms}ms`));
    }, ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Status & Configuration check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'ConectaContábil Backend',
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
      knowledgeChunksCount: OFFICIAL_RAG_KNOWLEDGE_BASE.length,
      timestamp: new Date().toISOString()
    });
  });

  // Fiscal Chat AI Endpoint with Multi-Tier Strict Scope & Grounding Gates
  app.post('/api/gemini/fiscal-chat', async (req, res) => {
    try {
      const { message, history = [], companyProfile } = req.body;

      if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ error: 'Mensagem inválida ou vazia.' });
      }

      // 1. Mandatory Gate: Strict Scope Check (Positive Whitelist + Negative Blacklist)
      // If the query is outside accounting, taxes, invoices or Brazilian fiscal regulations, block immediately
      if (!isQueryInFiscalScope(message)) {
        return res.json({
          reply: MANDATORY_INSUFFICIENT_INFO_MESSAGE,
          sources: [],
          isLiveAi: false
        });
      }

      const domain = detectTaxDomain(message);
      if (domain === 'NON_FISCAL') {
        return res.json({
          reply: MANDATORY_INSUFFICIENT_INFO_MESSAGE,
          sources: [],
          isLiveAi: false
        });
      }

      // 2. Mandatory Gate: Document Retrieval & Relevance Verification
      const { chunks: matchedChunks, isConfident } = retrieveRelevantKnowledge(message, 4);

      // Check if accessible answer has a verified targeted answer for this subject
      const accessibleAnswer = generateAccessibleAnswer(message, companyProfile);

      // If neither RAG retrieval has confident documents nor accessible answer covers it:
      // Strictly BLOCK generation without foundation
      if (!isConfident && accessibleAnswer.isInsufficient) {
        return res.json({
          reply: MANDATORY_INSUFFICIENT_INFO_MESSAGE,
          sources: [],
          isLiveAi: false
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      const hasValidKey = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10;

      // 3. Optional Live Model Call — Only allowed when confident official documents are present
      if (hasValidKey && matchedChunks.length > 0 && isConfident) {
        try {
          const knowledgeContext = matchedChunks.map((k, index) => 
            `[Fonte Oficial #${index + 1}: ${k.title} (${k.sourceName}) - Esfera: ${k.sphere || 'Federal'}]\n${k.content}\nLink: ${k.sourceUrl}`
          ).join('\n\n');

          const systemInstruction = `Você é o Assistente Fiscal Inteligente do ConectaContábil, especialista em orientações fiscais para Microempreendedores Individuais (MEIs), Microempresas (MEs) e Empresas de Pequeno Porte (EPPs).

REGRAS DE CONFORMIDADE OBRIGATÓRIAS:
1. IDENTIFICAÇÃO ESTRITA DO TRIBUTO: Identifique exatamente o assunto ou imposto perguntado pelo usuário.
   - NUNCA confunda tributos diferentes:
     * IRPF e IRPJ NUNCA são ISS.
     * ISS NUNCA é ICMS.
     * PIS NUNCA é COFINS.
     * CSLL NUNCA é IRPJ.
   - Se o usuário perguntar sobre Imposto de Renda (IRPF ou IRPJ), responda ÚNICA E EXCLUSIVAMENTE sobre Imposto de Renda. Não mencione ISS ou tributos municipais.
2. PERGUNTAS AMPLAS OU CONCEITUAIS: Explique o conceito de forma simples e direta, apresente os tipos existentes, informe quem deve pagar, como funciona na prática e onde consultar as informações oficiais.
3. INFORMAÇÕES INSUFICIENTES OU FORA DA BASE: Se o assunto não estiver estritamente fundamentado nos documentos abaixo ou for alheio ao tema contábil/fiscal, responda EXATAMENTE:
"${MANDATORY_INSUFFICIENT_INFO_MESSAGE}"
4. LINGUAGEM ACESSÍVEL: Responda em português simples, didático e acolhedor, sem termos técnicos desnecessários.
5. ZERO NOTAS TÉCNICAS: É terminantemente proibido incluir notas técnicas entre parênteses, alertas de modelo ou referências a APIs.
6. FONTES: Indique a fonte oficial e os links presentes nos documentos abaixo.
7. Localização e Perfil da Empresa: ${companyProfile?.tradeName || 'Microempresa'} (${companyProfile?.structure || 'MEI/ME'} - ${companyProfile?.regime || 'Simples Nacional'}, ${companyProfile?.city || 'Brasil'}/${companyProfile?.state || 'UF'}).

DOCUMENTOS OFICIAIS INDEXADOS NA BASE:
${knowledgeContext}`;

          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build'
              }
            }
          });

          // Build prompt with conversational context
          let promptWithHistory = '';
          if (history && history.length > 0) {
            const recent = history.slice(-4);
            recent.forEach((turn: { sender: string; text: string }) => {
              promptWithHistory += `${turn.sender === 'user' ? 'Empreendedor' : 'ConectaContábil'}: ${turn.text}\n`;
            });
            promptWithHistory += `\nPergunta atual: ${message}`;
          } else {
            promptWithHistory = message;
          }

          const callPromise = ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: promptWithHistory,
            config: { systemInstruction }
          });

          const geminiResponse: any = await promiseWithTimeout(callPromise, 2500);
          const replyText = geminiResponse?.text?.trim();

          if (replyText) {
            // 4. Pre-Exhibition Validation
            const isValid = validateFiscalAnswer(message, replyText, domain);
            if (isValid) {
              return res.json({
                reply: replyText,
                sources: matchedChunks.map(k => ({
                  name: k.sourceName,
                  url: k.sourceUrl,
                  snippet: k.title
                })),
                isLiveAi: true
              });
            }
          }
        } catch (geminiError) {
          console.warn('Gemini live call timed out or failed validation, falling back to verified grounded response:', (geminiError as any)?.message);
        }
      }

      // 5. Verified Grounded Answer
      if (accessibleAnswer.isInsufficient) {
        return res.json({
          reply: MANDATORY_INSUFFICIENT_INFO_MESSAGE,
          sources: [],
          isLiveAi: false
        });
      }

      return res.json({
        reply: accessibleAnswer.reply,
        sources: accessibleAnswer.sources,
        isLiveAi: false
      });

    } catch (error: any) {
      console.warn('Error in /api/gemini/fiscal-chat:', error);
      return res.status(200).json({
        reply: 'Ocorreu uma instabilidade técnica momentânea na conexão de consulta. Por favor, tente enviar sua pergunta novamente em alguns instantes.',
        sources: [],
        isLiveAi: false,
        isTechnicalError: true
      });
    }
  });

  // Production static files or Vite dev middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ConectaContábil server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
