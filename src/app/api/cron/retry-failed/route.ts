import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runPriceMonitoring } from "@/lib/affiliate/price-monitor";

export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const failedCount = await prisma.deal.count({
      where: {
        consecutiveFailures: { gt: 0, lt: 5 },
      },
    });

    if (failedCount === 0) {
      return NextResponse.json({
        success: true,
        message: "No transiently failed deals to retry",
        retried: 0,
      });
    }

    const result = await runPriceMonitoring(10);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      queueSize: failedCount,
      summary: result,
    });
  } catch (error: unknown) {
    console.error("Retry failed deals job failed:", error);
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
