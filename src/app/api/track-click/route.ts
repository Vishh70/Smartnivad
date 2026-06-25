import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dealId = searchParams.get("dealId");
  const targetUrl = searchParams.get("url");

  if (!dealId || !targetUrl) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    // Record click in the database for real-time analytics
    await prisma.dealClick.create({
      data: { dealId },
    });

    // Increment the counter on the deal directly
    await prisma.deal.update({
      where: { id: dealId },
      data: { clicks: { increment: 1 } },
    });

    console.log(`[AFFILIATE TRACKING] Clicked deal ${dealId} -> ${targetUrl}`);

    // Redirect to the affiliate URL
    return NextResponse.redirect(targetUrl, 302);
  } catch (error) {
    console.error("Click tracking error:", error);
    // Even if tracking fails, we should still redirect the user to not lose the sale
    return NextResponse.redirect(targetUrl, 302);
  }
}
