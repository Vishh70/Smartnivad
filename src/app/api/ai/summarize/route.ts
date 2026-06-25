import { NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const { productTitle, productDescription } = (await request.json()) as {
      productTitle?: string;
      productDescription?: string;
    };

    if (!productTitle) {
      return NextResponse.json({ error: "Product title is required" }, { status: 400 });
    }

    const prompt = `
      You are an expert affiliate marketer and product reviewer.
      Product Title: ${productTitle}
      ${productDescription ? `Product Description: ${productDescription}` : ""}

      Analyze this product and provide:
      1. A compelling, concise summary (around 100 words).
      2. 3-5 key pros.
      3. 2-3 key cons.
      4. 5-8 relevant SEO tags/keywords.

      Respond ONLY with a valid JSON object in this exact format:
      {
        "summary": "...",
        "pros": ["...", "..."],
        "cons": ["...", "..."],
        "tags": ["...", "..."]
      }
    `;

    const content = await generateWithFallback(prompt, true);
    
    // Parse the returned JSON
    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);

  } catch (error: unknown) {
    console.error("AI Summarize Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to generate summary" }, { status: 500 });
  }
}
