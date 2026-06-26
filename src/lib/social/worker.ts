import { prisma } from "@/lib/prisma";
import { SocialPlatform } from "@prisma/client";
import { TelegramProvider } from "./providers/telegram";
import { SocialProvider, ProviderResult } from "./providers/interface";
import { getNextRetryTime } from "./retry";

function getProvider(platform: SocialPlatform): SocialProvider | null {
  switch (platform) {
    case "TELEGRAM":
      return new TelegramProvider();
    default:
      return null;
  }
}

export async function processSocialQueue() {
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
    take: 10,
  });

  if (pendingPosts.length === 0) return { processed: 0 };

  let processedCount = 0;

  for (const post of pendingPosts) {
    await prisma.socialPostQueue.update({
      where: { id: post.id },
      data: { status: "POSTING" },
    });

    const startTime = Date.now();
    let result: ProviderResult;

    const provider = getProvider(post.platform);

    try {
      if (provider) {
        result = await provider.publish(post.deal, post);
      } else {
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

    const durationMs = Date.now() - startTime;

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
            durationMs,
          },
        }),
      ]);
    } else {
      const nextRetry = getNextRetryTime(post.retryCount);
      const isFinalFailure = !nextRetry;
      const finalStatus = isFinalFailure ? "FAILED_PERMANENT" : "FAILED";

      await prisma.$transaction([
        prisma.socialPostQueue.update({
          where: { id: post.id },
          data: {
            status: finalStatus,
            retryCount: post.retryCount + 1,
            errorMessage: result.error,
            scheduledAt: nextRetry || post.scheduledAt,
          },
        }),
        prisma.socialLog.create({
          data: {
            platform: post.platform,
            dealId: post.dealId,
            status: finalStatus,
            error: result.error,
            durationMs,
          },
        }),
      ]);
    }

    processedCount++;
  }

  return { processed: processedCount };
}
