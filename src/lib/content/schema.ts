import { z } from "zod";

export const AIContentSectionSchema = z.object({
  heading: z.string(),
  content: z.string(),
});

export const AIContentProductSchema = z.object({
  dealId: z.string(),
  dealTitle: z.string(),
  currentPrice: z.number().nullable(),
  originalPrice: z.number().nullable(),
  discountPercent: z.number().nullable(),
  verdict: z.string(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
});

export const AIContentArticleSchema = z.object({
  seoTitle: z.string(),
  seoDesc: z.string(),
  introduction: z.string(),
  sections: z.array(AIContentSectionSchema),
  productAnalyses: z.array(AIContentProductSchema),
  conclusion: z.string(),
});

export type AIContentArticle = z.infer<typeof AIContentArticleSchema>;
