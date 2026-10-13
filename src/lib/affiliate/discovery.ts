import { prisma } from "@/lib/prisma";
import { getProvider } from "./registry";
import { DiscoveredProduct } from "./types";
import { PublishStatus, DealType } from "@prisma/client";

export interface DiscoveryOptions {
  keywords?: string[];
  providerId?: "AMAZON" | "FLIPKART";
  categorySlug?: string;
  batchSize?: number;
  dryRun?: boolean;
  autoPublish?: boolean;
  importedProducts?: DiscoveredProduct[];
}

export interface RejectionInfo {
  externalId: string;
  title: string;
  reason: string;
}

export interface DiscoveryResult {
  success: boolean;
  isDryRun: boolean;
  provider: string;
  foundCount: number;
  createdCount: number;
  updatedCount: number;
  skippedCount: number;
  rejectedCount: number;
  reviewQueueCount: number;
  rejections: RejectionInfo[];
  durationMs: number;
  message: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/**
 * Server-side discovery worker.
 * Idempotent: Running the same batch twice updates existing products rather than creating duplicates.
 */
export async function runProductDiscovery(
  options: DiscoveryOptions,
): Promise<DiscoveryResult> {
  const startTime = performance.now();
  const providerId = options.providerId || "AMAZON";
  const provider = getProvider(providerId);
  const dryRun = !!options.dryRun;
  const batchSize = Math.min(Math.max(options.batchSize || 10, 1), 50);

  let candidateProducts: DiscoveredProduct[] = [];

  // 1. Gather Candidate Products
  if (options.importedProducts && options.importedProducts.length > 0) {
    candidateProducts = options.importedProducts;
  } else if (provider) {
    const keywords = options.keywords || ["top deals", "electronics"];
    for (const kw of keywords) {
      if (candidateProducts.length >= batchSize) break;
      const results = await provider.searchProducts(kw, {
        category: options.categorySlug,
        limit: batchSize - candidateProducts.length,
      });
      candidateProducts.push(...results);
    }
  }

  // Deduplicate within the candidate batch by externalId
  const uniqueCandidates = new Map<string, DiscoveredProduct>();
  for (const p of candidateProducts) {
    if (p.externalId && !uniqueCandidates.has(p.externalId)) {
      uniqueCandidates.set(p.externalId, p);
    }
  }

  const listToProcess = Array.from(uniqueCandidates.values()).slice(
    0,
    batchSize,
  );

  let createdCount = 0;
  let updatedCount = 0;
  const skippedCount = 0;
  let rejectedCount = 0;
  let reviewQueueCount = 0;
  const rejections: RejectionInfo[] = [];

  // Resolve Store and Category
  let defaultStore = await prisma.store.findFirst({
    where: {
      name: {
        contains: providerId === "AMAZON" ? "Amazon" : "Flipkart",
        mode: "insensitive",
      },
    },
  });

  if (!defaultStore && !dryRun) {
    defaultStore = await prisma.store.create({
      data: {
        name: providerId === "AMAZON" ? "Amazon" : "Flipkart",
        slug: providerId === "AMAZON" ? "amazon" : "flipkart",
        website:
          providerId === "AMAZON"
            ? "https://www.amazon.in"
            : "https://www.flipkart.com",
      },
    });
  }

  let defaultCategory = options.categorySlug
    ? await prisma.category.findUnique({
        where: { slug: options.categorySlug },
      })
    : await prisma.category.findFirst();

  if (!defaultCategory && !dryRun) {
    defaultCategory = await prisma.category.create({
      data: {
        name: "Electronics",
        slug: "electronics",
      },
    });
  }

  for (const product of listToProcess) {
    // 2. Strict Validation & Verification Rules
    if (!product.title || product.title.trim().length < 3) {
      rejectedCount++;
      rejections.push({
        externalId: product.externalId || "unknown",
        title: product.title || "Untitled",
        reason: "Title is missing or too short",
      });
      continue;
    }

    if (
      typeof product.currentPrice !== "number" ||
      product.currentPrice <= 0 ||
      isNaN(product.currentPrice)
    ) {
      rejectedCount++;
      rejections.push({
        externalId: product.externalId,
        title: product.title,
        reason: "Invalid or zero current price",
      });
      continue;
    }

    if (!product.affiliateUrl || !product.affiliateUrl.startsWith("https://")) {
      rejectedCount++;
      rejections.push({
        externalId: product.externalId,
        title: product.title,
        reason: "Missing or insecure affiliate URL",
      });
      continue;
    }

    // Fix or normalize originalPrice and discount
    const currentPrice = Math.round(product.currentPrice * 100) / 100;
    let originalPrice =
      Math.round((product.originalPrice || currentPrice) * 100) / 100;
    if (originalPrice < currentPrice) {
      originalPrice = currentPrice;
    }

    const calculatedDiscount =
      originalPrice > currentPrice
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0;

    // Check for review queue conditions
    let needsReview = false;
    let reviewReason: string | null = null;

    if (calculatedDiscount > 85) {
      needsReview = true;
      reviewReason = `Extremely high discount of ${calculatedDiscount}% detected; flagged for manual check`;
    } else if (!product.imageUrl || !product.imageUrl.startsWith("http")) {
      needsReview = true;
      reviewReason = "Missing valid product image";
    }

    if (needsReview) {
      reviewQueueCount++;
    }

    // 3. Duplicate Detection: Check existing product by externalId or canonical URL
    const existing = await prisma.deal.findFirst({
      where: {
        OR: [
          { externalId: product.externalId },
          { affiliateUrl: product.affiliateUrl },
        ],
      },
    });

    if (existing) {
      // Product exists -> Update existing product instead of creating duplicate
      if (!dryRun) {
        const priceChanged = existing.currentPrice !== currentPrice;

        await prisma.deal.update({
          where: { id: existing.id },
          data: {
            title: product.title,
            currentPrice,
            originalPrice,
            discount: calculatedDiscount,
            inStock: product.inStock,
            imageUrl: product.imageUrl || existing.imageUrl,
            lastCheckedAt: new Date(),
            lastSuccessfulCheckAt: new Date(),
            consecutiveFailures: 0,
            isPriceStale: false,
            reviewQueue: needsReview ? true : existing.reviewQueue,
            reviewReason: reviewReason || existing.reviewReason,
          },
        });

        if (priceChanged) {
          await prisma.priceHistory.create({
            data: {
              dealId: existing.id,
              price: currentPrice,
              originalPrice,
              discount: calculatedDiscount,
              capturedAt: new Date(),
            },
          });
        }
      }
      updatedCount++;
    } else {
      // 4. New Product Insertion
      if (!dryRun && defaultStore && defaultCategory) {
        const baseSlug = slugify(product.title);
        // Guarantee unique slug
        let slug = baseSlug;
        const slugExists = await prisma.deal.findUnique({ where: { slug } });
        if (slugExists) {
          slug = `${baseSlug}-${product.externalId.toLowerCase()}`;
        }

        const initialStatus =
          needsReview || !options.autoPublish
            ? PublishStatus.DRAFT
            : PublishStatus.PUBLISHED;

        const newDeal = await prisma.deal.create({
          data: {
            title: product.title,
            slug,
            description:
              product.description || `Verified deal on ${product.title}`,
            currentPrice,
            originalPrice,
            discount: calculatedDiscount,
            affiliateUrl: product.affiliateUrl,
            imageUrl:
              product.imageUrl ||
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
            categoryId: defaultCategory.id,
            storeId: defaultStore.id,
            externalId: product.externalId,
            provider: providerId,
            dealType: calculatedDiscount >= 20 ? DealType.HOT : DealType.LIVE,
            status: initialStatus,
            reviewQueue: needsReview,
            reviewReason,
            inStock: product.inStock,
            lastCheckedAt: new Date(),
            lastSuccessfulCheckAt: new Date(),
            isPriceStale: false,
          },
        });

        await prisma.priceHistory.create({
          data: {
            dealId: newDeal.id,
            price: currentPrice,
            originalPrice,
            discount: calculatedDiscount,
            capturedAt: new Date(),
          },
        });
      }
      createdCount++;
    }
  }

  const durationMs = Math.round(performance.now() - startTime);

  // Record Discovery Run for audit trail
  if (!dryRun) {
    try {
      await prisma.discoveryRun.create({
        data: {
          provider: providerId,
          keyword: options.keywords?.join(", "),
          category: options.categorySlug,
          isDryRun: dryRun,
          foundCount: listToProcess.length,
          createdCount,
          updatedCount,
          skippedCount,
          rejectedCount,
          details:
            rejections.length > 0
              ? JSON.parse(JSON.stringify(rejections))
              : undefined,
          status: rejectedCount > 0 ? "PARTIAL" : "SUCCESS",
          durationMs,
        },
      });
    } catch (logErr) {
      console.error("[Discovery] Error logging discovery run:", logErr);
    }
  }

  return {
    success: true,
    isDryRun: dryRun,
    provider: providerId,
    foundCount: listToProcess.length,
    createdCount,
    updatedCount,
    skippedCount,
    rejectedCount,
    reviewQueueCount,
    rejections,
    durationMs,
    message: dryRun
      ? `Dry Run Complete: Found ${listToProcess.length}, New: ${createdCount}, Existing: ${updatedCount}, Rejected: ${rejectedCount}, Review: ${reviewQueueCount}`
      : `Discovery Complete: ${createdCount} created, ${updatedCount} updated, ${rejectedCount} rejected`,
  };
}
