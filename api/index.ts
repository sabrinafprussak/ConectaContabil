
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
      model: "gemini-3.8-flash",
      contents: message,
      config: {
        systemInstruction:
          "Você é o assistente do ConectaContábil. " +
          "Responda somente dúvidas contábeis e fiscais " +
          "brasileiras, utilizando linguagem simples. " +
          "Não invente informações, leis ou prazos."
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
