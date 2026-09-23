import { prisma } from "@/lib/prisma";
import { AIContentArticle, AIContentArticleSchema } from "./schema";
import { GeminiProvider } from "./ai-provider";

export async function generateContentDraft(
  title: string,
  brief: string,
  dealIds: string[],
): Promise<AIContentArticle> {
  // 1. Fetch factual data from DB
  const deals = await prisma.deal.findMany({
    where: { id: { in: dealIds } },
    select: {
      id: true,
      title: true,
      description: true,
      currentPrice: true,
      originalPrice: true,
      discount: true,
      pros: true,
      cons: true,
      store: { select: { name: true } },
    },
  });

  // 2. Construct the Prompt
  const factualData = deals.map((d) => ({
    id: d.id,
    title: d.title,
    store: d.store.name,
    price: d.currentPrice,
    originalPrice: d.originalPrice,
    discount: d.discount,
    description: d.description,
    existingPros: d.pros,
    existingCons: d.cons,
  }));

  const prompt = `
You are an expert affiliate content writer and SEO specialist.
Write a comprehensive article based strictly on the provided factual data.
Do not invent any product features, prices, or specifications that are not present in the facts.

Content Brief:
Title: ${title}
Instructions: ${brief}

Factual Data (Strict Source of Truth):
${JSON.stringify(factualData, null, 2)}

Return your response strictly as a JSON object matching this TypeScript interface structure:
{
  seoTitle: string,
  seoDesc: string,
  introduction: string,
  sections: Array<{ heading: string, content: string }>,
  productAnalyses: Array<{
    dealId: string,
    dealTitle: string,
    currentPrice: number | null,
    originalPrice: number | null,
    discountPercent: number | null,
    verdict: string,
    pros: string[],
    cons: string[]
  }>,
  conclusion: string
}

Rules:
- The productAnalyses must include an entry for each dealId provided in the factual data.
- The dealTitle, currentPrice, originalPrice, and discountPercent in the JSON must exactly match the values provided in the factual data.
- Do NOT wrap the JSON in Markdown code blocks like \`\`\`json. Return only the raw JSON string.
  `;

  // 3. Call AI
  const provider = new GeminiProvider();
  const responseJson = await provider.generateContent(prompt, true);

  // 4. Validate output
  try {
    const rawData = JSON.parse(responseJson);
    const parsedData = AIContentArticleSchema.parse(rawData);
    return parsedData;
  } catch (error) {
    console.error(
      "AI Output did not match expected schema:",
      error,
      "\nResponse:",
      responseJson,
    );
    throw new Error("AI generated invalid JSON structure.");
  }
}
