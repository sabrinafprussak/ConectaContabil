
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    return res.status(200).json({
      status: "ok",
      service: "ConectaContábil Backend",
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Chave do Gemini não configurada"
    });
  }

  try {
    const { message } = req.body ?? {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Mensagem inválida"
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: message,
      config: {
        temperature: 0.2,
        maxOutputTokens: 450,
        systemInstruction: `
          Você é o Assistente Fiscal do ConectaContábil.
          
          Sua função é ajudar MEIs, microempresas e pequenas
          empresas a compreender assuntos contábeis e fiscais.
          
          REGRAS DE RESPOSTA:
          
          1. Responda sempre em português brasileiro.
          2. Utilize linguagem simples, acessível e objetiva.
          3. Priorize respostas curtas, de 2 a 4 parágrafos.
          4. Evite explicações excessivamente longas.
          5. Não utilize Markdown, asteriscos, hashtags ou tabelas.
          6. Não utilize listas, exceto quando forem necessárias.
          7. Explique termos técnicos com exemplos simples.
          8. Não invente leis, alíquotas, valores ou prazos.
          9. Quando faltar informação, explique a limitação.
          10. Responda apenas assuntos contábeis e fiscais.
          
          Se a pergunta for simples, responda de forma simples.
          Não acrescente informações desnecessárias.
          `
      }
    });

    return res.status(200).json({
      reply: response.text || "Não foi possível gerar uma resposta.",
      sources: [],
      isLiveAi: true
    });

  } catch (error: any) {
    console.error("Erro na comunicação com Gemini:", error);

    return res.status(502).json({
      error: "Falha na comunicação com Gemini",
      detail: error?.message || "Erro desconhecido"
    });
  }
}
