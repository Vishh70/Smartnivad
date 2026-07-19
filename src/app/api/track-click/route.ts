import { NextResponse } from "next/server";
import crypto from "crypto";

import { prisma } from "@/lib/prisma";

const ALLOWED_DOMAINS = [
  "amazon.in",
  "amazon.com",
  "flipkart.com",
  "myntra.com",
  "ajio.com",
  "meesho.com",
  "snapdeal.com",
  "jiomart.com",
  "tatacliq.com",
  "croma.com",
  "reliancedigital.in",
  "nykaa.com",
];

function isAllowedDomain(hostname: string): boolean {
  return ALLOWED_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dealId = searchParams.get("dealId");
  const targetUrl = searchParams.get("url");

  if (!dealId || !targetUrl) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const target = new URL(targetUrl);
    if (!isAllowedDomain(target.hostname)) {
      console.warn(`[AFFILIATE TRACKING] Blocked invalid redirect: ${targetUrl}`);
      return NextResponse.json({ error: "Invalid target URL" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  try {
    const source = searchParams.get("source") || undefined;
    const path = searchParams.get("path") || undefined;
    const userAgent = request.headers.get("user-agent") || undefined;
    const referrer = request.headers.get("referer") || undefined;
    
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");
    // Record click in the database for real-time analytics
    await prisma.dealClick.create({
      data: { 
        dealId,
        source,
        path,
        userAgent,
        referrer,
        ipHash
      },
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
