import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "30d";

  // Calculate date range
  const now = new Date();
  let since: Date;
  switch (period) {
    case "90d":
      since = new Date(now.getTime() - 90 * 86400000);
      break;
    case "1y":
      since = new Date(now.getTime() - 365 * 86400000);
      break;
    default:
      since = new Date(now.getTime() - 30 * 86400000);
  }

  try {
    const history = await prisma.priceHistory.findMany({
      where: {
        dealId: id,
        capturedAt: { gte: since },
      },
      orderBy: { capturedAt: "asc" },
      select: {
        price: true,
        originalPrice: true,
        discount: true,
        capturedAt: true,
      },
    });

    // Also get the deal's current price for context
    const deal = await prisma.deal.findUnique({
      where: { id },
      select: { currentPrice: true, originalPrice: true },
    });

    // Compute stats
    const prices = history.map(h => h.price);
    const stats = {
      current: deal?.currentPrice ?? 0,
      lowest: prices.length ? Math.min(...prices) : deal?.currentPrice ?? 0,
      highest: prices.length ? Math.max(...prices) : deal?.originalPrice ?? 0,
      average: prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : deal?.currentPrice ?? 0,
    };

    return NextResponse.json({ history, stats, period });
  } catch {
    return NextResponse.json({ history: [], stats: null, period }, { status: 200 });
  }
}
