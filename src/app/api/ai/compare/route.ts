import { NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai";

type ComparisonProduct = {
  title?: string;
  price?: number | string;
  features?: string[];
};

export async function POST(request: Request) {
  try {
    const { products } = (await request.json()) as { products?: ComparisonProduct[] };

    if (!products || !Array.isArray(products) || products.length < 2) {
      return NextResponse.json({ error: "At least two products are required for comparison" }, { status: 400 });
    }

    const productsData = products.map(product => 
      `- ${product.title ?? "Untitled product"} (Price: ₹${product.price ?? "N/A"})\n  Features: ${product.features?.join(", ") || "N/A"}`
    ).join("\n\n");

    const prompt = `
      You are an expert tech reviewer comparing multiple products.
      Here are the products to compare:
      
      ${productsData}

      Analyze these products and determine the overall best value/winner.
      Provide:
      1. The title of the winning product.
      2. The reasoning why it's the winner (about 50 words).
      3. A list of pros and cons for EACH product.

      Respond ONLY with a valid JSON object in this exact format:
      {
        "winner": "Product Title",
        "reasoning": "...",
        "pros": {
          "Product 1 Title": ["pro1", "pro2"],
          "Product 2 Title": ["pro1", "pro2"]
        },
        "cons": {
          "Product 1 Title": ["con1", "con2"],
          "Product 2 Title": ["con1", "con2"]
        }
      }
    `;

    const content = await generateWithFallback(prompt, true);
    
    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);

  } catch (error: unknown) {
    console.error("AI Compare Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to generate comparison" }, { status: 500 });
  }
}
