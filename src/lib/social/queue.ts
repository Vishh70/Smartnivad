import { prisma } from "@/lib/prisma";
import { SocialPlatform } from "@prisma/client";

/**
 * Enqueues a deal for social posting.
 * Uses idempotency to prevent duplicate pending/success records.
 */
export async function enqueuePost(
  dealId: string,
  platform: SocialPlatform,
  scheduledAt?: Date,
) {
  // Check if a PENDING, POSTING, or SUCCESS record already exists for this deal+platform
  const existing = await prisma.socialPostQueue.findFirst({
    where: {
      dealId,
      platform,
      status: {
        in: ["PENDING", "POSTING", "SUCCESS"],
      },
    },
  });

  if (existing) {
    return existing; // Idempotent: don't create duplicates
  }

  return await prisma.socialPostQueue.create({
    data: {
      dealId,
      platform,
      scheduledAt: scheduledAt || new Date(),
    },
  });
}
