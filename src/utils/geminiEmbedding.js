import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function generateGeminiEmbedding(text, dim = 768) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    content: text,
    outputDimensionality: dim,
  });

  return response.embedding.values;
}