import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY is not set in .env");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const getAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    const systemPrompt = "You are a helpful AI customer support assistant.";
    console.log(conversationHistory,'  history from ai side')
    console.log(userMessage,' from ai side')
    // Prepare structured conversation messages
    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.filter(msg => msg.role && msg.content)
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages.map(msg => ({
        type: "text",
        text: msg.content
      })),
    });
     const aiText =
      response?.candidates?.[0]?.content?.parts?.map(p => p.text).join("\n") ||
      "AI could not generate a response.";
               

    return aiText;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "AI could not generate a response.";
  }
};
