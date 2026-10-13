import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DealType, OfferVerificationStatus } from "@prisma/client";

export const maxDuration = 30;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    // 1. Mark expired deals
    const expiredDeals = await prisma.deal.updateMany({
      where: {
        expiresAt: { lte: now },
        dealType: { not: DealType.EXPIRED },
      },
      data: {
        dealType: DealType.EXPIRED,
      },
    });

    // 2. Mark expired bank offers
    const expiredOffers = await prisma.bankOffer.updateMany({
      where: {
        endDate: { lte: now },
        verificationStatus: { not: OfferVerificationStatus.EXPIRED },
      },
      data: {
        verificationStatus: OfferVerificationStatus.EXPIRED,
        active: false,
      },
    });

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      cleanedDeals: expiredDeals.count,
      cleanedOffers: expiredOffers.count,
    });
  } catch (error: unknown) {
    console.error("Clean expired promotions job failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
