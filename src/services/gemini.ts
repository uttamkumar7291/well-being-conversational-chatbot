import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getGeminiResponse = async (prompt: string, history: { role: string, parts: { text: string }[] }[] = []) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history.map(h => ({ role: h.role, parts: h.parts })),
      { role: "user", parts: [{ text: prompt }] }
    ],
    config: {
      systemInstruction: "You are WellMind AI, a compassionate and empathetic mental wellness companion. Your goal is to provide emotional support, wellness advice, and meditation guidance. Always maintain a calm, supportive, and non-judgmental tone. If a user expresses thoughts of self-harm, gently encourage them to seek professional help and provide emergency resources."
    }
  });

  return response.text;
};

export const getMoodInsights = async (moodLogs: any[]) => {
  const prompt = `Based on these recent mood logs, provide 3 personalized wellness tips: ${JSON.stringify(moodLogs)}`;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  });
  return response.text;
};
