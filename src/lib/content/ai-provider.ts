import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ContentAIProvider {
  generateContent(prompt: string, isJson: boolean): Promise<string>;
}

export class GeminiProvider implements ContentAIProvider {
  async generateContent(prompt: string, isJson: boolean): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const config = isJson
      ? { responseMimeType: "application/json" }
      : undefined;
    const modelName = process.env.GEMINI_MODEL || "gemini-3.6-flash";

    console.log(
      `[Content Engine AI] Generating content using model: ${modelName}`,
    );

    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: config,
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text;
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error ? error.message : "Unknown AI error";
      console.error(`[Content Engine AI] Generation failed: ${errorMsg}`);

      // We explicitly throw here so the UI can report the error.
      // We do NOT return a mock JSON response because we cannot safely default
      // an entire content pipeline.
      throw new Error(`AI Provider Generation Failed: ${errorMsg}`);
    }
  }
}
