import { NextResponse } from "next/server";
import { processSocialQueue } from "@/lib/social/worker";

export async function GET(request: Request) {
  try {
    // Vercel Cron Authentication
    const authHeader = request.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
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
