import { NextResponse } from "next/server";
import { runProductDiscovery } from "@/lib/affiliate/discovery";

export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Run scheduled discovery with safe bounded batch
    const result = await runProductDiscovery({
      keywords: ["best deals", "electronics offers"],
      providerId: "AMAZON",
      batchSize: 10,
      dryRun: false,
      autoPublish: false, // Default to review queue / draft for safety
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (error: unknown) {
    console.error("Scheduled discovery failed:", error);
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
