import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { ContentType } from "@prisma/client";
import type { AIContentArticle } from "./schema";

export async function getPublishedContent(
  slug: string,
  expectedType: ContentType,
) {
  const content = await prisma.content.findFirst({
    where: {
      slug,
      type: expectedType,
      status: "PUBLISHED",
    },
    include: {
      products: {
        include: {
          deal: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!content) {
    notFound();
  }

  // Cast aiJson safely
  const aiJson = content.aiJson as unknown as AIContentArticle;

  if (!aiJson || !aiJson.productAnalyses) {
    console.error(
      `Content ${content.id} is published but missing valid aiJson structure.`,
    );
    notFound();
  }

  // Map products strictly to current Deal facts
  const products = content.products.map((cp) => {
    // Find the corresponding AI analysis by matching dealId
    const aiAnalysis = aiJson.productAnalyses.find(
      (pa) => pa.dealId === cp.deal.id,
    );

    return {
      deal: cp.deal,
      aiAnalysis: aiAnalysis || null,
    };
  });

  return {
    content,
    aiJson,
    products,
  };
}
