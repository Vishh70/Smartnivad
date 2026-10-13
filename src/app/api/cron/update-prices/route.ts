import { NextResponse } from "next/server";
import { runPriceMonitoring } from "@/lib/affiliate/price-monitor";

// Maximum execution time for Vercel functions (stays well within limits)
export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    // 1. Mandatory Cron Authentication (strictly prevents bypass if CRON_SECRET is missing or invalid)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: !cronSecret
            ? "CRON_SECRET is not configured on the server"
            : "Invalid authorization header",
        },
        { status: 401 },
      );
    }

    // 2. Execute bounded batch price monitoring
    const result = await runPriceMonitoring(15);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        processed: result.processed,
        updated: result.updated,
        unchanged: result.unchanged,
        failed: result.failed,
        expired: result.expired,
        duration: `${(result.durationMs / 1000).toFixed(2)}s`,
      },
      results: result.items,
    });
  } catch (error: unknown) {
    console.error("Scheduled price monitoring failed:", error);
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
