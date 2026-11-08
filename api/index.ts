
export default function handler(req: any, res: any) {
  return res.status(200).json({
    status: "ok",
    service: "ConectaContábil Backend",
    message: "A função da Vercel está funcionando!"
  });
}
