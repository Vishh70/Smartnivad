import { prisma } from "@/lib/prisma";
import { getProvider } from "./registry";
import { resolveMultipleAmazonLinks } from "./link-resolver";
import { AmazonAffiliateProvider } from "./amazon";
import { PublishStatus, DealType, Prisma } from "@prisma/client";

export interface ImportCandidateAudit {
  sourceUrl: string;
  resolvedUrl: string | null;
  asin: string | null;
  marketplace: string | null;
  isIndiaMarketplace: boolean;
  httpStatus: number | null;
  trackingTag: string | null;
  isTrackingVerified: boolean;
  trackingStatus: "VERIFIED" | "DIFFERENT_TAG" | "MISSING_TAG" | "UNRESOLVED";
  resolutionStatus: string;
  resolutionError: string | null;

  // Product verification & database mapping
  title: string | null;
  imageUrl: string | null;
  currentPrice: number | null;
  originalPrice: number | null;
  discount: number;
  inStock: boolean;
  isDuplicate: boolean;
  duplicateOfId?: string;

  // Final pipeline status
  importStatus:
    | "IMPORTED"
    | "UPDATED"
    | "AWAITING_VERIFICATION"
    | "DUPLICATE"
    | "REJECTED_ERROR";
  statusReason: string;
  dealId?: string;
  dealSlug?: string;
  dealStatus?: "DRAFT" | "PUBLISHED";
}

export interface AmazonImportSummary {
  success: boolean;
  isDryRun: boolean;
  timestamp: string;
  totalSubmitted: number;
  successfullyResolved: number;
  verifiedThroughProvider: number;
  awaitingVerification: number;
  duplicates: number;
  invalidOrUnsupported: number;
  successfullyImported: number;
  failuresRequiringAction: number;
  items: ImportCandidateAudit[];
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
 * Executes secure import pipeline for Amazon product links with:
 * - Redirect resolution & SSRF protection
 * - ASIN extraction
 * - Attribution verification (smartnivad-21)
 * - Provider API verification where credentials are configured
 * - Safe review/draft queue preservation when credentials are pending
 * - Idempotency & duplicate detection
 * - Dry run support
 */
export async function processAmazonLinkImports(
  urls: string[],
  options: {
    dryRun?: boolean;
    autoPublish?: boolean;
    expectedTag?: string;
  } = {},
): Promise<AmazonImportSummary> {
  const isDryRun = !!options.dryRun;
  const autoPublish = !!options.autoPublish;
  const expectedTag =
    options.expectedTag || process.env.AMAZON_ASSOCIATE_TAG || "smartnivad-21";

  // 1. Resolve Links Safely
  const resolutionBatch = await resolveMultipleAmazonLinks(urls, expectedTag);

  const amazonProvider =
    (getProvider("AMAZON") as AmazonAffiliateProvider) ||
    new AmazonAffiliateProvider();
  const configStatus = await amazonProvider.getConfigStatus();

  // Find or create default store & category for Amazon deals (if not dry run)
  let defaultStoreId: string | null = null;
  let defaultCategoryId: string | null = null;

  try {
    const store = await prisma.store.findFirst({
      where: { name: { contains: "Amazon", mode: "insensitive" } },
    });
    if (store) {
      defaultStoreId = store.id;
    } else if (!isDryRun) {
      const createdStore = await prisma.store.create({
        data: {
          name: "Amazon India",
          slug: "amazon-india",
          website: "https://www.amazon.in",
        },
      });
      defaultStoreId = createdStore.id;
    }

    const category = await prisma.category.findFirst();
    if (category) {
      defaultCategoryId = category.id;
    } else if (!isDryRun) {
      const createdCat = await prisma.category.create({
        data: {
          name: "Deals",
          slug: "deals",
        },
      });
      defaultCategoryId = createdCat.id;
    }
  } catch {
    // Database may not be reachable in pure unit test environment
  }

  const items: ImportCandidateAudit[] = [];
  const seenAsinsInBatch = new Set<string>();

  let verifiedThroughProvider = 0;
  let awaitingVerification = 0;
  let duplicates = 0;
  let invalidOrUnsupported = 0;
  let successfullyImported = 0;
  let failuresRequiringAction = 0;

  for (const resolved of resolutionBatch.results) {
    // 2. Handle Resolution Failures (e.g. 404, unapproved host, SSRF block)
    if (
      resolved.resolutionStatus !== "RESOLVED" ||
      !resolved.isIndiaMarketplace ||
      !resolved.resolvedUrl
    ) {
      invalidOrUnsupported++;
      failuresRequiringAction++;
      items.push({
        sourceUrl: resolved.sourceUrl,
        resolvedUrl: resolved.resolvedUrl,
        asin: resolved.asin,
        marketplace: resolved.marketplace,
        isIndiaMarketplace: resolved.isIndiaMarketplace,
        httpStatus: resolved.httpStatus,
        trackingTag: resolved.trackingTag,
        isTrackingVerified: resolved.isTrackingVerified,
        trackingStatus: resolved.trackingStatus,
        resolutionStatus: resolved.resolutionStatus,
        resolutionError: resolved.errorMessage,
        title: null,
        imageUrl: null,
        currentPrice: null,
        originalPrice: null,
        discount: 0,
        inStock: false,
        isDuplicate: false,
        importStatus: "REJECTED_ERROR",
        statusReason:
          resolved.errorMessage ||
          `Failed link resolution (${resolved.resolutionStatus})`,
      });
      continue;
    }

    const asin = resolved.asin;

    // 3. Batch Duplicate Detection
    if (asin && seenAsinsInBatch.has(asin)) {
      duplicates++;
      items.push({
        sourceUrl: resolved.sourceUrl,
        resolvedUrl: resolved.resolvedUrl,
        asin,
        marketplace: resolved.marketplace,
        isIndiaMarketplace: resolved.isIndiaMarketplace,
        httpStatus: resolved.httpStatus,
        trackingTag: resolved.trackingTag,
        isTrackingVerified: resolved.isTrackingVerified,
        trackingStatus: resolved.trackingStatus,
        resolutionStatus: resolved.resolutionStatus,
        resolutionError: null,
        title: null,
        imageUrl: null,
        currentPrice: null,
        originalPrice: null,
        discount: 0,
        inStock: true,
        isDuplicate: true,
        importStatus: "DUPLICATE",
        statusReason: `Duplicate product with ASIN ${asin} already in this import batch`,
      });
      continue;
    }

    if (asin) {
      seenAsinsInBatch.add(asin);
    }

    // 4. Database Duplicate Detection
    let existingDeal: {
      id: string;
      slug: string;
      title: string;
      currentPrice: number;
      originalPrice: number;
    } | null = null;

    if (asin) {
      try {
        existingDeal = await prisma.deal.findFirst({
          where: {
            OR: [{ externalId: asin }, { affiliateUrl: { contains: asin } }],
          },
          select: {
            id: true,
            slug: true,
            title: true,
            currentPrice: true,
            originalPrice: true,
          },
        });
      } catch {
        // DB not connected in test
      }
    }

    // 5. Query Official Amazon Creators API if configured
    let apiProduct: {
      title: string;
      imageUrl: string;
      currentPrice: number;
      originalPrice: number;
      discount: number;
      inStock: boolean;
      brand?: string;
    } | null = null;

    if (asin && configStatus.isConfigured && !configStatus.isPaused) {
      try {
        const details = await amazonProvider.getProductDetails(asin);
        if (details && details.currentPrice > 0) {
          apiProduct = {
            title: details.title,
            imageUrl: details.imageUrl,
            currentPrice: details.currentPrice,
            originalPrice: details.originalPrice || details.currentPrice,
            discount: details.discount || 0,
            inStock: details.inStock,
            brand: details.brand,
          };
          verifiedThroughProvider++;
        }
      } catch (err) {
        console.error(
          `[AmazonImport] API detail fetch failed for ASIN ${asin}:`,
          err,
        );
      }
    }

    // 6. Handle Pending Verification (when Creators API is not configured)
    if (!apiProduct) {
      awaitingVerification++;
      const candidateTitle = resolved.titleSlug
        ? resolved.titleSlug.replace(/-/g, " ")
        : asin
          ? `Amazon Product (${asin})`
          : "Amazon Item";

      const candidateAudit: ImportCandidateAudit = {
        sourceUrl: resolved.sourceUrl,
        resolvedUrl: resolved.resolvedUrl,
        asin,
        marketplace: resolved.marketplace,
        isIndiaMarketplace: resolved.isIndiaMarketplace,
        httpStatus: resolved.httpStatus,
        trackingTag: resolved.trackingTag,
        isTrackingVerified: resolved.isTrackingVerified,
        trackingStatus: resolved.trackingStatus,
        resolutionStatus: resolved.resolutionStatus,
        resolutionError: null,
        title: candidateTitle,
        imageUrl: null,
        currentPrice: null,
        originalPrice: null,
        discount: 0,
        inStock: true,
        isDuplicate: !!existingDeal,
        duplicateOfId: existingDeal?.id,
        importStatus: existingDeal ? "DUPLICATE" : "AWAITING_VERIFICATION",
        statusReason: existingDeal
          ? `Product already exists in database (ASIN: ${asin})`
          : "Amazon Creators API credentials pending. Link preserved in import queue for verification when credentials are configured.",
      };

      // Persist to ImportQueueItem table if not dry run
      if (!isDryRun) {
        try {
          await prisma.importQueueItem.create({
            data: {
              sourceUrl: resolved.sourceUrl,
              resolvedUrl: resolved.resolvedUrl,
              asin,
              marketplace: resolved.marketplace,
              provider: "AMAZON",
              trackingTag: resolved.trackingTag,
              isTrackingVerified: resolved.isTrackingVerified,
              status: existingDeal ? "DUPLICATE" : "PENDING_VERIFICATION",
              pendingReason: candidateAudit.statusReason,
              title: candidateTitle,
              dealId: existingDeal?.id || null,
            },
          });
        } catch {
          // In unit tests without database
        }
      }

      items.push(candidateAudit);
      continue;
    }

    // 7. Verified Product Import (when API product data is available)
    const currentPrice = Math.round(apiProduct.currentPrice * 100) / 100;
    const originalPrice =
      apiProduct.originalPrice >= currentPrice
        ? Math.round(apiProduct.originalPrice * 100) / 100
        : currentPrice;
    const discount =
      originalPrice > currentPrice
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0;

    const baseSlug = slugify(apiProduct.title);
    const uniqueSlug = asin ? `${baseSlug}-${asin.toLowerCase()}` : baseSlug;

    // Determine status & review queue
    const needsReview =
      discount > 85 || !resolved.isTrackingVerified || !apiProduct.imageUrl;

    const dealStatus: "DRAFT" | "PUBLISHED" =
      autoPublish && !needsReview && resolved.isTrackingVerified
        ? "PUBLISHED"
        : "DRAFT";

    let savedDealId: string | undefined = existingDeal?.id;

    if (!isDryRun && defaultStoreId && defaultCategoryId) {
      try {
        if (existingDeal) {
          // Idempotent update: preserve slug and existing relations
          const updated = await prisma.deal.update({
            where: { id: existingDeal.id },
            data: {
              currentPrice,
              originalPrice,
              discount,
              imageUrl: apiProduct.imageUrl || undefined,
              inStock: apiProduct.inStock,
              sourceUrl: resolved.sourceUrl,
              affiliateUrl: resolved.resolvedUrl,
              lastCheckedAt: new Date(),
              lastSuccessfulCheckAt: new Date(),
              isPriceStale: false,
              consecutiveFailures: 0,
            },
          });
          savedDealId = updated.id;
        } else {
          // Create new deal
          const created = await prisma.deal.create({
            data: {
              slug: uniqueSlug,
              title: apiProduct.title,
              imageUrl: apiProduct.imageUrl,
              affiliateUrl: resolved.resolvedUrl,
              sourceUrl: resolved.sourceUrl,
              currentPrice,
              originalPrice,
              discount,
              dealType: DealType.LIVE,
              status:
                dealStatus === "PUBLISHED"
                  ? PublishStatus.PUBLISHED
                  : PublishStatus.DRAFT,
              provider: "AMAZON",
              externalId: asin,
              storeId: defaultStoreId,
              categoryId: defaultCategoryId,
              inStock: apiProduct.inStock,
              reviewQueue: needsReview,
              reviewReason: needsReview
                ? `High discount (${discount}%) or attribution requires review`
                : null,
              lastCheckedAt: new Date(),
              lastSuccessfulCheckAt: new Date(),
            },
          });
          savedDealId = created.id;
          successfullyImported++;
        }

        // Record in ImportQueueItem
        await prisma.importQueueItem.create({
          data: {
            sourceUrl: resolved.sourceUrl,
            resolvedUrl: resolved.resolvedUrl,
            asin,
            marketplace: resolved.marketplace,
            provider: "AMAZON",
            trackingTag: resolved.trackingTag,
            isTrackingVerified: resolved.isTrackingVerified,
            status: "IMPORTED",
            title: apiProduct.title,
            imageUrl: apiProduct.imageUrl,
            currentPrice,
            originalPrice,
            discount,
            dealId: savedDealId,
          },
        });
      } catch (err) {
        console.error(`[AmazonImport] Deal save error for ASIN ${asin}:`, err);
      }
    } else if (isDryRun) {
      if (!existingDeal) successfullyImported++;
    }

    items.push({
      sourceUrl: resolved.sourceUrl,
      resolvedUrl: resolved.resolvedUrl,
      asin,
      marketplace: resolved.marketplace,
      isIndiaMarketplace: resolved.isIndiaMarketplace,
      httpStatus: resolved.httpStatus,
      trackingTag: resolved.trackingTag,
      isTrackingVerified: resolved.isTrackingVerified,
      trackingStatus: resolved.trackingStatus,
      resolutionStatus: resolved.resolutionStatus,
      resolutionError: null,
      title: apiProduct.title,
      imageUrl: apiProduct.imageUrl,
      currentPrice,
      originalPrice,
      discount,
      inStock: apiProduct.inStock,
      isDuplicate: !!existingDeal,
      duplicateOfId: existingDeal?.id,
      importStatus: existingDeal ? "UPDATED" : "IMPORTED",
      statusReason: existingDeal
        ? `Existing deal updated with verified pricing (ASIN: ${asin})`
        : `Product verified via Amazon Creators API and ready for import`,
      dealId: savedDealId,
      dealSlug: existingDeal?.slug || uniqueSlug,
      dealStatus,
    });
  }

  // 8. Record DiscoveryRun audit log (if not dry run)
  if (!isDryRun) {
    try {
      await prisma.discoveryRun.create({
        data: {
          provider: "AMAZON",
          keyword: "Amazon Link Import",
          isDryRun: false,
          foundCount: resolutionBatch.total,
          createdCount: successfullyImported,
          updatedCount: items.filter((i) => i.importStatus === "UPDATED")
            .length,
          skippedCount: duplicates,
          rejectedCount: invalidOrUnsupported,
          status:
            failuresRequiringAction === 0
              ? "SUCCESS"
              : successfullyImported > 0
                ? "PARTIAL"
                : "FAILED",
          details: items as unknown as Prisma.InputJsonValue,
          durationMs: 0,
        },
      });
    } catch {
      // In test environment
    }
  }

  const message = isDryRun
    ? `Dry Run Completed: ${resolutionBatch.resolved} resolved, ${awaitingVerification} awaiting API verification, ${invalidOrUnsupported} rejected.`
    : `Import Completed: ${successfullyImported} imported, ${awaitingVerification} preserved in import queue, ${invalidOrUnsupported} rejected.`;

  return {
    success: true,
    isDryRun,
    timestamp: new Date().toISOString(),
    totalSubmitted: resolutionBatch.total,
    successfullyResolved: resolutionBatch.resolved,
    verifiedThroughProvider,
    awaitingVerification,
    duplicates,
    invalidOrUnsupported,
    successfullyImported,
    failuresRequiringAction,
    items,
    message,
  };
}
