import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI;

function initGemini() {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log("API KEY:", apiKey); // check if it's loaded
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export const runGemini = async (prompt) => {
  try {
    const model = initGemini().getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return null;
  }
};


