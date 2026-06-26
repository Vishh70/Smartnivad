import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [pending, success, failed, permanent, avgDurationRaw] =
      await Promise.all([
        prisma.socialPostQueue.count({
          where: { status: { in: ["PENDING", "POSTING"] } },
        }),
        prisma.socialPostQueue.count({ where: { status: "SUCCESS" } }),
        prisma.socialPostQueue.count({ where: { status: "FAILED" } }),
        prisma.socialPostQueue.count({ where: { status: "FAILED_PERMANENT" } }),
        prisma.socialLog.aggregate({
          _avg: {
            durationMs: true,
          },
          where: {
            durationMs: { not: null },
          },
        }),
      ]);

    return NextResponse.json({
      pending,
      success,
      failed,
      permanent,
      avgProcessingTime: Math.round(avgDurationRaw._avg.durationMs || 0),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch metrics";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
