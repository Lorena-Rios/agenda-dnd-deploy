import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const { prompt } = req.body;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    if (!text) {
      throw new Error("Resposta vazia do Oráculo");
    }

    return res.status(200).json({
      oracleMessage: text
    });

  } catch (error: any) {
    console.error("🔥 Erro no Oráculo:", error);

    // 🧠 Mensagem narrativa de fallback
    return res.status(429).json({
      oracleMessage:
        "O panteão não se move por caprichos mortais. Retorne quando seu destino for digno."
    });
  }
}
