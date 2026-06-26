import { NextResponse } from "next/server";
import { processSocialQueue } from "@/lib/social/worker";

export async function GET(request: Request) {
  try {
    // Vercel Cron Authentication
    // Verify the Authorization header is set by Vercel
    const authHeader = request.headers.get("Authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      // Return 401 if unauthorized, but in local dev we might want to bypass or allow manual triggering
      // For now, let's enforce it only if CRON_SECRET is actually set.
      if (process.env.NODE_ENV === "production") {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const result = await processSocialQueue();
    return NextResponse.json({ success: true, processed: result.processed });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Social Worker Cron Error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
