import { prisma } from "@/lib/prisma";
import { getProvider, resolveProviderByUrl } from "./registry";
import { DealType, PublishStatus } from "@prisma/client";

export interface PriceMonitorResult {
  processed: number;
  updated: number;
  unchanged: number;
  failed: number;
  expired: number;
  durationMs: number;
  items: Array<{
    dealId: string;
    title: string;
    status: string;
    oldPrice: number;
    newPrice?: number;
    failures: number;
  }>;
}

const MUTEX_KEY = "cron_price_monitor_lock";
const LOCK_EXPIRY_MS = 3 * 60 * 1000; // 3 minutes lock expiry

/**
 * Acquire concurrency lock to prevent overlapping runs on serverless/cron invocations
 */
async function acquireLock(): Promise<boolean> {
  try {
    const existing = await prisma.platformSetting.findUnique({
      where: { key: MUTEX_KEY },
    });

    const now = Date.now();
    if (existing) {
      const lockTime = parseInt(existing.value, 10);
      if (!isNaN(lockTime) && now - lockTime < LOCK_EXPIRY_MS) {
        // Lock still valid and running
        return false;
      }
      // Stale lock, overwrite
      await prisma.platformSetting.update({
        where: { key: MUTEX_KEY },
        data: { value: now.toString() },
      });
      return true;
    }

    await prisma.platformSetting.create({
      data: { key: MUTEX_KEY, value: now.toString() },
    });
    return true;
  } catch {
    // If setting table is locked or unreachable, proceed cautiously
    return true;
  }
}

async function releaseLock(): Promise<void> {
  try {
    await prisma.platformSetting.deleteMany({
      where: { key: MUTEX_KEY },
    });
  } catch {
    // Ignore error on lock release
  }
}

/**
 * Upgrade price monitoring engine with approved provider interfaces,
 * bounded batching, exponential failure backoff, price safety, and stale detection.
 */
export async function runPriceMonitoring(
  batchLimit = 15,
): Promise<PriceMonitorResult> {
  const startTime = performance.now();
  const locked = await acquireLock();
  if (!locked) {
    console.warn(
      "[PriceMonitor] Overlapping cron run detected. Aborting this run.",
    );
    return {
      processed: 0,
      updated: 0,
      unchanged: 0,
      failed: 0,
      expired: 0,
      durationMs: 0,
      items: [],
    };
  }

  const boundedLimit = Math.min(Math.max(batchLimit, 1), 30);
  const now = new Date();
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

  try {
    // 1. Fetch active deals prioritizing oldest checked and active status
    const deals = await prisma.deal.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        dealType: { in: [DealType.LIVE, DealType.HOT] },
        consecutiveFailures: { lt: 5 }, // Circuit-breaker: skip permanently broken deals
      },
      include: {
        store: true,
      },
      orderBy: [{ lastCheckedAt: "asc" }, { updatedAt: "asc" }],
      take: boundedLimit,
    });

    let updated = 0;
    let unchanged = 0;
    let failed = 0;
    let expired = 0;
    const items = [];

    for (const deal of deals) {
      const dealStart = performance.now();
      let status = "Unchanged";
      let errorMessage: string | null = null;
      let verifiedNewPrice: number | null = null;
      let newOriginalPrice: number | null = null;
      let inStock = deal.inStock;

      // 2. Check Expiry Date
      if (deal.expiresAt && now > deal.expiresAt) {
        await prisma.deal.update({
          where: { id: deal.id },
          data: {
            dealType: DealType.EXPIRED,
            lastCheckedAt: now,
          },
        });
        expired++;
        items.push({
          dealId: deal.id,
          title: deal.title,
          status: "Expired",
          oldPrice: deal.currentPrice,
          failures: deal.consecutiveFailures,
        });
        continue;
      }

      // 3. Resolve Provider
      const provider =
        getProvider(deal.provider) ||
        getProvider(deal.store?.name) ||
        resolveProviderByUrl(deal.affiliateUrl);

      try {
        if (provider) {
          const identifier = deal.externalId || deal.affiliateUrl;
          const details = await provider.getProductDetails(identifier);

          if (
            details &&
            typeof details.currentPrice === "number" &&
            details.currentPrice > 0
          ) {
            verifiedNewPrice = details.currentPrice;
            newOriginalPrice = details.originalPrice || null;
            inStock = details.inStock;
          }
        }

        // If provider returned null and external scraper is enabled as fallback
        if (!verifiedNewPrice && deal.affiliateUrl) {
          const { scrapePrice } = await import("@/lib/scraper");
          const scraped = await scrapePrice(
            deal.affiliateUrl,
            deal.store?.name || "",
          );
          if (typeof scraped === "number" && scraped > 0) {
            verifiedNewPrice = scraped;
          }
        }

        // 4. Process Verified Price or Handle Failure
        if (verifiedNewPrice && verifiedNewPrice > 0) {
          const isPriceDifferent =
            Math.abs(verifiedNewPrice - deal.currentPrice) >= 0.01;

          let originalPrice = deal.originalPrice;
          if (newOriginalPrice && newOriginalPrice >= verifiedNewPrice) {
            originalPrice = newOriginalPrice;
          } else if (originalPrice < verifiedNewPrice) {
            originalPrice = verifiedNewPrice;
          }

          const discount =
            originalPrice > verifiedNewPrice
              ? Math.round(
                  ((originalPrice - verifiedNewPrice) / originalPrice) * 100,
                )
              : 0;

          if (isPriceDifferent) {
            // Price changed! Transactionally update deal and append PriceHistory
            await prisma.$transaction(async (tx) => {
              await tx.deal.update({
                where: { id: deal.id },
                data: {
                  currentPrice: verifiedNewPrice!,
                  originalPrice,
                  discount,
                  inStock,
                  lastCheckedAt: now,
                  lastSuccessfulCheckAt: now,
                  consecutiveFailures: 0,
                  isPriceStale: false,
                },
              });

              await tx.priceHistory.create({
                data: {
                  dealId: deal.id,
                  price: verifiedNewPrice!,
                  originalPrice,
                  discount,
                  capturedAt: now,
                },
              });
            });

            status = "PriceUpdated";
            updated++;
          } else {
            // Price verified unchanged
            await prisma.deal.update({
              where: { id: deal.id },
              data: {
                inStock,
                lastCheckedAt: now,
                lastSuccessfulCheckAt: now,
                consecutiveFailures: 0,
                isPriceStale: false,
              },
            });
            status = "Unchanged";
            unchanged++;
          }
        } else {
          // Failed to obtain price - DO NOT overwrite existing valid price!
          const newFailures = deal.consecutiveFailures + 1;
          const isStale =
            !deal.lastSuccessfulCheckAt ||
            now.getTime() - deal.lastSuccessfulCheckAt.getTime() >
              TWENTY_FOUR_HOURS_MS ||
            newFailures >= 2;

          const isCircuitBroken = newFailures >= 5;

          await prisma.deal.update({
            where: { id: deal.id },
            data: {
              lastCheckedAt: now,
              consecutiveFailures: newFailures,
              isPriceStale: isStale, // Mark price stale on repeated failures or age > 24h
              // DO NOT mark expired or out of stock solely because requests failed!
              // Stock status is only updated when supported by an explicit provider response.
              reviewQueue: isCircuitBroken ? true : deal.reviewQueue,
              reviewReason: isCircuitBroken
                ? "5 consecutive provider check failures - price marked stale for admin verification"
                : deal.reviewReason,
            },
          });

          status = isCircuitBroken ? "StaleQueuedForReview" : "FailedCheck";
          errorMessage = "Provider returned no price or product unreachable";
          failed++;
        }
      } catch (err: unknown) {
        status = "Error";
        errorMessage = err instanceof Error ? err.message : String(err);
        failed++;

        const newFailures = deal.consecutiveFailures + 1;
        const isCircuitBroken = newFailures >= 5;

        await prisma.deal.update({
          where: { id: deal.id },
          data: {
            lastCheckedAt: now,
            consecutiveFailures: newFailures,
            isPriceStale: true,
            // Do not mark out of stock or expired solely due to request failure!
            reviewQueue: isCircuitBroken ? true : deal.reviewQueue,
            reviewReason: isCircuitBroken
              ? "5 consecutive provider check exceptions - price marked stale for admin review"
              : deal.reviewReason,
          },
        });
      }

      const durationSec = (performance.now() - dealStart) / 1000;

      // 5. Write to AutomationLog
      await prisma.automationLog.create({
        data: {
          dealId: deal.id,
          store: deal.store?.name || "Unknown",
          status,
          oldPrice: deal.currentPrice,
          newPrice: verifiedNewPrice || null,
          duration: parseFloat(durationSec.toFixed(2)),
          errorMessage,
        },
      });

      items.push({
        dealId: deal.id,
        title: deal.title,
        status,
        oldPrice: deal.currentPrice,
        newPrice: verifiedNewPrice || undefined,
        failures: deal.consecutiveFailures,
      });

      // Respect provider rate limits: polite delay between requests
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    const totalDurationMs = Math.round(performance.now() - startTime);

    return {
      processed: deals.length,
      updated,
      unchanged,
      failed,
      expired,
      durationMs: totalDurationMs,
      items,
    };
  } finally {
    await releaseLock();
  }
}
