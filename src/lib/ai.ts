import { GoogleGenerativeAI } from "@google/generative-ai";

const MODELS = [
  "gemini-2.0-flash-lite", // Very fast, likely high capacity
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-flash-latest",
];

export async function generateWithFallback(prompt: string, isJson = false) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const config = isJson ? { responseMimeType: "application/json" } : undefined;

  let lastError: unknown;

  for (const modelName of MODELS) {
    try {
      console.log(`[AI] Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: config,
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      console.log(`[AI] Success with model: ${modelName}`);
      return text;
    } catch (error: unknown) {
      console.warn(
        `[AI] Model ${modelName} failed:`,
        error instanceof Error ? error.message : error,
      );
      lastError = error;
    }
  }

  // If we reach here, all models failed.
  // For dev resilience, return a mock response if we were asking for JSON.
  if (isJson) {
    console.warn("[AI] All models failed. Returning mock JSON fallback.");
    return JSON.stringify({
      summary:
        "AI generation is currently unavailable due to high API demand. This is a fallback summary.",
      pros: ["Fallback feature 1", "Fallback feature 2"],
      cons: ["AI currently overloaded", "Cannot fetch true details"],
      tags: ["fallback", "error", "api-limit"],
      seoTitle: "Fallback SEO Title",
      seoDesc: "Fallback SEO Description for when the AI is overloaded.",
    });
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("All AI models failed");
}
