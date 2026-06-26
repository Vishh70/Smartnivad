import { prisma } from "@/lib/prisma";
import { publishToTelegram } from "./providers/telegram";
import { getNextRetryTime } from "./retry";

export async function processSocialQueue() {
  // 1. Fetch pending or retrying posts that are due
  const pendingPosts = await prisma.socialPostQueue.findMany({
    where: {
      status: {
        in: ["PENDING", "FAILED"],
      },
      scheduledAt: {
        lte: new Date(),
      },
    },
    include: {
      deal: true,
    },
    take: 10, // Process in batches to avoid Vercel function timeouts
  });

  if (pendingPosts.length === 0) return { processed: 0 };

  let processedCount = 0;

  for (const post of pendingPosts) {
    // 2. Mark as POSTING
    await prisma.socialPostQueue.update({
      where: { id: post.id },
      data: { status: "POSTING" },
    });

    let result: { success: boolean; data?: unknown; error?: string };

    // 3. Route to the correct provider
    try {
      if (post.platform === "TELEGRAM") {
        result = await publishToTelegram(post.deal);
      } else {
        // Fallback for unimplemented platforms
        result = {
          success: false,
          error: `Platform ${post.platform} is not implemented yet.`,
        };
      }
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Unknown error during publish";
      result = { success: false, error: message };
    }

    // 4. Handle result and Logging
    if (result.success) {
      await prisma.$transaction([
        prisma.socialPostQueue.update({
          where: { id: post.id },
          data: {
            status: "SUCCESS",
            postedAt: new Date(),
            errorMessage: null,
          },
        }),
        prisma.socialLog.create({
          data: {
            platform: post.platform,
            dealId: post.dealId,
            status: "SUCCESS",
            response: result.data || {},
          },
        }),
      ]);
    } else {
      const nextRetry = getNextRetryTime(post.retryCount);
      const isFinalFailure = !nextRetry;

      await prisma.$transaction([
        prisma.socialPostQueue.update({
          where: { id: post.id },
          data: {
            status: isFinalFailure ? "FAILED" : "PENDING", // Keep PENDING if retrying
            retryCount: post.retryCount + 1,
            errorMessage: result.error,
            scheduledAt: nextRetry || post.scheduledAt, // Update schedule for next retry
          },
        }),
        prisma.socialLog.create({
          data: {
            platform: post.platform,
            dealId: post.dealId,
            status: "FAILED",
            error: result.error,
          },
        }),
      ]);
    }

    processedCount++;
  }

  return { processed: processedCount };
}
