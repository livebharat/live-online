
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

/**
 * Searches for latest job updates using Google Search grounding.
 * This satisfies the request to not have to upload files repeatedly.
 */
export const searchLatestJobs = async (department: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find the most recent official recruitment notification for ${department} from the web. Extract the core details for a job portal summary.`,
    config: {
      tools: [{ googleSearch: {} }],
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
          officialUrl: { type: Type.STRING }
        },
        required: ["postName", "totalPosts", "eligibility", "ageLimit", "fee", "importantDates", "officialUrl"],
      },
    },
  });

  return {
    data: JSON.parse(response.text),
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};
