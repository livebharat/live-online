
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeJobNotification = async (rawText: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract the following details from this government job notification text and format them clearly: ${rawText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          postName: { type: Type.STRING },
          totalPosts: { type: Type.STRING },
          eligibility: { type: Type.STRING },
          ageLimit: { type: Type.STRING },
          fee: { type: Type.STRING },
          importantDates: { type: Type.STRING },
        },
        required: ["postName", "totalPosts", "eligibility", "ageLimit", "fee", "importantDates"],
      },
    },
  });

  return JSON.parse(response.text) as any;
};
