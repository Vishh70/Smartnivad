import { describe, it, expect, vi } from "vitest";
import { validateFactsAgainstDB } from "../../src/lib/content/fact-validator";
import { AIContentArticleSchema } from "../../src/lib/content/schema";

// Mock prisma so we don't need a real DB for these tests
vi.mock("../../src/lib/prisma", () => {
  return {
    prisma: {
      deal: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "deal-1",
            title: "Laptop A",
            currentPrice: 999,
            originalPrice: 1299,
            discount: 23,
          },
          {
            id: "deal-2",
            title: "Phone B",
            currentPrice: 499,
            originalPrice: 599,
            discount: 16,
          },
        ]),
      },
    },
  };
});

describe("Fact Validator", () => {
  const validAIJson = {
    seoTitle: "Title",
    seoDesc: "Desc",
    introduction: "Intro",
    sections: [],
    conclusion: "End",
    productAnalyses: [
      {
        dealId: "deal-1",
        dealTitle: "Laptop A",
        currentPrice: 999,
        originalPrice: 1299,
        discountPercent: 23,
        verdict: "Great",
        pros: ["Fast"],
        cons: ["Heavy"],
      },
    ],
  };

  it("passes when facts match database exactly", async () => {
    const parsed = AIContentArticleSchema.parse(validAIJson);
    const result = await validateFactsAgainstDB(parsed, ["deal-1"]);

    expect(result.passed).toBe(true);
    expect(result.results.length).toBe(1);
    expect(result.results[0].passed).toBe(true);
  });

  it("fails when price is incorrect", async () => {
    const invalidJson = {
      ...validAIJson,
      productAnalyses: [
        { ...validAIJson.productAnalyses[0], currentPrice: 899 },
      ],
    };

    const parsed = AIContentArticleSchema.parse(invalidJson);
    const result = await validateFactsAgainstDB(parsed, ["deal-1"]);

    expect(result.passed).toBe(false);
    expect(result.results[0].passed).toBe(false);
    expect(result.results[0].issues[0]).toContain("Current price mismatch");
  });

  it("fails when title is incorrect", async () => {
    const invalidJson = {
      ...validAIJson,
      productAnalyses: [
        { ...validAIJson.productAnalyses[0], dealTitle: "MacBook A" },
      ],
    };

    const parsed = AIContentArticleSchema.parse(invalidJson);
    const result = await validateFactsAgainstDB(parsed, ["deal-1"]);

    expect(result.passed).toBe(false);
    expect(result.results[0].issues[0]).toContain("Title mismatch");
  });

  it("fails when dealId is hallucinated", async () => {
    const invalidJson = {
      ...validAIJson,
      productAnalyses: [
        { ...validAIJson.productAnalyses[0], dealId: "deal-3" },
      ],
    };

    const parsed = AIContentArticleSchema.parse(invalidJson);
    const result = await validateFactsAgainstDB(parsed, ["deal-1"]);

    expect(result.passed).toBe(false);
    // It should report deal-3 as hallucinated or not in selection
    const hallucinatedCheck = result.results.find((r) => r.dealId === "deal-3");
    expect(hallucinatedCheck?.passed).toBe(false);
    expect(hallucinatedCheck?.issues[0]).toContain(
      "not in the original selection",
    );
  });

  it("fails when expected deal is entirely missing from AI output", async () => {
    const parsed = AIContentArticleSchema.parse(validAIJson);
    // We expect both deal-1 and deal-2, but AI only provided deal-1
    const result = await validateFactsAgainstDB(parsed, ["deal-1", "deal-2"]);

    expect(result.passed).toBe(false);
    const missingCheck = result.results.find((r) => r.dealId === "deal-2");
    expect(missingCheck?.passed).toBe(false);
    expect(missingCheck?.issues[0]).toContain(
      "AI completely omitted expected deal",
    );
  });

  describe("Zod Schema Validation", () => {
    it("fails to parse malformed JSON structure", () => {
      expect(() => {
        AIContentArticleSchema.parse({
          seoTitle: "Title",
          // missing productAnalyses and other required fields
        });
      }).toThrow();
    });

    it("fails when structured fields have incorrect types", () => {
      expect(() => {
        AIContentArticleSchema.parse({
          ...validAIJson,
          productAnalyses: [
            {
              ...validAIJson.productAnalyses[0],
              currentPrice: "999", // string instead of number
            },
          ],
        });
      }).toThrow();
    });
  });
});
