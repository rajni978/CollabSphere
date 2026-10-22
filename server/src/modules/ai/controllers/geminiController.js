
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

async function generateAIResponse(prompt) {
  if (!ai) {
    throw new Error("Gemini API key is not configured on the server.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}

export async function explainNote(req, res) {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        message: "Note content is required.",
      });
    }

    const explanation = await generateAIResponse(
      `Explain this project note in simple, clear English. Preserve important technical details.\n\n${content}`
    );

    return res.json({ result: explanation });
  } catch (error) {
    console.error("Explain note error:", error.message);
    return res.status(500).json({
      message: "Could not explain the note. Check the server configuration.",
    });
  }
}

export async function improveNote(req, res) {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        message: "Note content is required.",
      });
    }

    const suggestions = await generateAIResponse(
      `Review this software project note. Suggest specific improvements to its clarity, organization, technical accuracy, and missing details. Do not invent project facts.\n\n${content}`
    );

    return res.json({ result: suggestions });
  } catch (error) {
    console.error("Improve note error:", error.message);
    return res.status(500).json({
      message: "Could not suggest improvements. Check the server configuration.",
    });
  }
}
