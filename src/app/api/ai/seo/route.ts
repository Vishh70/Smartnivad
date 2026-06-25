import { NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const { productTitle, description, price } = (await request.json()) as {
      productTitle?: string;
      description?: string;
      price?: string | number;
    };

    if (!productTitle) {
      return NextResponse.json({ error: "Product title is required" }, { status: 400 });
    }

    const prompt = `
      You are an expert SEO specialist for an affiliate tech deals website.
      Product Title: ${productTitle}
      ${description ? `Description: ${description}` : ""}
      ${price ? `Price: ₹${price}` : ""}

      Generate SEO metadata for this product page.
      1. An SEO-optimized title (under 60 characters) designed to maximize click-through rate.
      2. A compelling meta description (under 160 characters).
      3. A list of 5-8 highly relevant keywords.

      Respond ONLY with a valid JSON object in this exact format:
      {
        "seoTitle": "...",
        "seoDescription": "...",
        "keywords": ["...", "..."]
      }
    `;

    const aiResponse = await generateWithFallback(prompt, true);
    
    const parsed = JSON.parse(aiResponse);
    return NextResponse.json(parsed);

  } catch (error: unknown) {
    console.error("AI SEO Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to generate SEO metadata" }, { status: 500 });
  }
}
