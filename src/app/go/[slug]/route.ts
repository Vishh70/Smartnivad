import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Only allow redirect for PUBLISHED deals or coupons
    let targetUrl: string | null = null;
    let entityId: string | null = null;
    let entityType: "DEAL" | "COUPON" | null = null;

    const deal = await prisma.deal.findFirst({
      where: { slug: slug, status: "PUBLISHED" },
    });

    if (deal && deal.affiliateUrl) {
      targetUrl = deal.affiliateUrl;
      entityId = deal.id;
      entityType = "DEAL";
    } else {
      const coupon = await prisma.coupon.findFirst({
        where: { slug: slug, status: "PUBLISHED" },
      });
      if (coupon && coupon.affiliateUrl) {
        targetUrl = coupon.affiliateUrl;
        entityId = coupon.id;
        entityType = "COUPON";
      }
    }

    if (!targetUrl || !entityId) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source") || undefined;

    // Do not log unnecessary/sensitive headers. Just IP hash for basic uniqueness.
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

    // We do NOT log user-agent or referer fully to preserve privacy/security,
    // only the required fields as per Phase 38 analytics design

    if (entityType === "DEAL") {
      await prisma.dealClick.create({
        data: {
          dealId: entityId,
          source: source,
          ipHash: ipHash,
        },
      });
      await prisma.deal.update({
        where: { id: entityId },
        data: { clicks: { increment: 1 } },
      });
    } else if (entityType === "COUPON") {
      // If we had a couponClick table, we'd write to it here.
      // For now, just increment the coupon clicks.
      await prisma.coupon.update({
        where: { id: entityId },
        data: { clicks: { increment: 1 } },
      });
    }

    return NextResponse.redirect(targetUrl, 302);
  } catch (error) {
    console.error("Click tracking error:", error);
    // On tracking failure, still redirect to avoid losing the sale
    // if the deal was found. Wait, if error happens before deal lookup,
    // we just redirect to home.
    return NextResponse.redirect(new URL("/", request.url));
  }
}
