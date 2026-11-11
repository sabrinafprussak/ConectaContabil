
import { GoogleGenAI } from "@google/genai";

function normalizarPergunta(texto: string): string {
  return texto.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[?!.,;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function prepararPergunta(texto: string): string {
  const normalizada = normalizarPergunta(texto);
  const siglas = [
    "cbs", "ibs", "icms", "iss", "ipi",
    "cfop", "das", "defis", "nfse", "nfs e"
  ];

  const curta = normalizada
    .replace(/^(e |sobre |o |a )+/g, "")
    .trim();

  if (siglas.includes(curta)) {
    return `O usuário escreveu: "${texto}". Interprete como: "O que é ${curta.toUpperCase()} e para que serve?"`;
  }

  return texto;
}

// Identifica perguntas que dependem de um assunto mencionado antes.
function perguntaDeContinuacao(texto: string): boolean {
  const pergunta = normalizarPergunta(texto);
  return /^(qual (e |a |o )?(utilidade|finalidade|funcao|objetivo|importancia)|para que serve|como funciona|como e utilizado|como usar|onde aparece|e no |e para |e como |e quando |e quem |e qual |e isso|e ele|e ela|isso|ele|ela|me de um exemplo|pode dar um exemplo|tem exemplo)/.test(pergunta);
}

// Busca um assunto explícito nas perguntas anteriores, sem depender
// da correspondência literal entre perguntas completas.
function encontrarAssunto(historico: Array<{ role: string; text: string }>): string | null {
  const termos = [
    ["NFS-e", /\bnfs[ -]?e\b/i],
    ["NF-e", /\bnf[ -]?e\b/i],
    ["DASN-SIMEI", /\bdasn[ -]?simei\b/i],
    ["ICMS-ST", /\bicms[ -]?st\b/i],
    ["EFD-Reinf", /\befd[ -]?reinf\b/i],
    ["CFOP", /\bcfop\b/i],
    ["CBS", /\bcbs\b/i],
    ["IBS", /\bibs\b/i],
    ["ICMS", /\bicms\b/i],
    ["ISS", /\biss\b/i],
    ["IPI", /\bipi\b/i],
    ["DEFIS", /\bdefis\b/i],
    ["DAS", /\bdas\b/i],
    ["MEI", /\bmei\b/i],
    ["Simples Nacional", /simples nacional/i],
    ["SPED", /\bsped\b/i],
    ["DCTFWeb", /\bdctfweb\b/i],
    ["DIFAL", /\bdifal\b/i]
  ] as const;

  // Prioriza o assunto mencionado pelo próprio usuário.
  for (const item of [...historico].reverse()) {
    if (item.role !== "Usuário") continue;
    for (const [nome, padrao] of termos) {
      if (padrao.test(item.text)) return nome;
    }
  }
  return null;
}

function resolverPergunta(
  texto: string,
  historico: Array<{ role: string; text: string }>
): string {
  const preparada = prepararPergunta(texto);
  if (!perguntaDeContinuacao(texto)) return preparada;

  const assunto = encontrarAssunto(historico);
  if (!assunto) return preparada;

  return `${texto.trim()} (Assunto da conversa anterior: ${assunto}. Responda especificamente sobre ${assunto}, considerando a pergunta anterior.)`;
}

function lerHistorico(
  valor: unknown
): Array<{ role: string; text: string }> {
  if (!Array.isArray(valor)) return [];

  return valor.slice(-8).flatMap((item: any) => {
    if (!item || typeof item !== "object") return [];

    const role =
      item.role === "assistant" || item.role === "model"
        ? "Assistente"
        : item.role === "user"
          ? "Usuário"

