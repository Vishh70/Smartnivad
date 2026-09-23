import { prisma } from "@/lib/prisma";
import { AIContentArticle } from "./schema";

export interface FactValidationResult {
  passed: boolean;
  results: ProductFactCheck[];
}

export interface ProductFactCheck {
  dealId: string;
  dealTitle: string;
  passed: boolean;
  issues: string[];
}

export async function validateFactsAgainstDB(
  aiJson: AIContentArticle,
  expectedDealIds: string[],
): Promise<FactValidationResult> {
  const results: ProductFactCheck[] = [];
  let overallPassed = true;

  // 1. Load actual deals from database
  const actualDeals = await prisma.deal.findMany({
    where: { id: { in: expectedDealIds } },
  });

  const dealMap = new Map(actualDeals.map((d) => [d.id, d]));

  // 2. Cross-reference AI product analyses against expected DB facts
  const expectedSet = new Set(expectedDealIds);
  const seenSet = new Set<string>();

  for (const analysis of aiJson.productAnalyses) {
    seenSet.add(analysis.dealId);
    const issues: string[] = [];

    // Is it a valid referenced deal?
    if (!expectedSet.has(analysis.dealId)) {
      issues.push(
        `AI hallucinated a dealId (${analysis.dealId}) that was not in the original selection.`,
      );
    }

    const actual = dealMap.get(analysis.dealId);
    if (!actual) {
      issues.push(`Deal ${analysis.dealId} does not exist in the database.`);
    } else {
      // Validate structured factual fields
      if (analysis.dealTitle !== actual.title) {
        issues.push(
          `Title mismatch: AI claimed "${analysis.dealTitle}", actual is "${actual.title}"`,
        );
      }
      if (analysis.currentPrice !== actual.currentPrice) {
        issues.push(
          `Current price mismatch: AI claimed ${analysis.currentPrice}, actual is ${actual.currentPrice}`,
        );
      }
      if (analysis.originalPrice !== actual.originalPrice) {
        issues.push(
          `Original price mismatch: AI claimed ${analysis.originalPrice}, actual is ${actual.originalPrice}`,
        );
      }
      if (analysis.discountPercent !== actual.discount) {
        issues.push(
          `Discount mismatch: AI claimed ${analysis.discountPercent}%, actual is ${actual.discount}%`,
        );
      }
    }

    const passed = issues.length === 0;
    if (!passed) overallPassed = false;

    results.push({
      dealId: analysis.dealId,
      dealTitle: analysis.dealTitle || "Unknown",
      passed,
      issues,
    });
  }

  // 3. Check for missing deals
  for (const expectedId of expectedDealIds) {
    if (!seenSet.has(expectedId)) {
      overallPassed = false;
      const missingDeal = dealMap.get(expectedId);
      results.push({
        dealId: expectedId,
        dealTitle: missingDeal?.title || "Unknown",
        passed: false,
        issues: [`AI completely omitted expected deal: ${expectedId}`],
      });
    }
  }

  return {
    passed: overallPassed,
    results,
  };
}
