import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY is not set in .env");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Get AI response using Gemini
 * @param {Array} conversationMessages -> Array of messages with role/content
 * @returns {string}
 */
export const getAIResponse = async (conversationMessages) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: conversationMessages.map(msg => ({
        type: "text",
        text: msg.content
      })),
    });

    let aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    aiText = aiText.replace(/\n{2,}/g, "\n").trim();

    
    const sentences = aiText.match(/[^.!?]+[.!?]*/g) || [];
    const shortText = sentences.slice(0, 3).join(" ").trim();

    return shortText || "AI could not generate a response.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "AI could not generate a response.";
  }
};
