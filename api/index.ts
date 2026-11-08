
export default function handler(req: any, res: any) {
  const apiKey = process.env.GEMINI_API_KEY;

  return res.status(200).json({
    status: "ok",
    service: "ConectaContábil Backend",
    hasGeminiApiKey: Boolean(apiKey),
    keyConfigured: Boolean(apiKey && apiKey.length > 10),
    message: "Servidor funcionando corretamente!"
  });
}
