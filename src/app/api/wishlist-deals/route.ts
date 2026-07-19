import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";

const wishlistSchema = z.object({
  ids: z.array(z.string()).max(50),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateCheck = checkRateLimit(`wishlist_${ip}`, 30, 60000);
    
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const result = wishlistSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
    }
    
    const { ids } = result.data;

    if (ids.length === 0) {
      return NextResponse.json([]);
    }

    const deals = await prisma.deal.findMany({
      where: { id: { in: ids } },
      include: { store: true, brand: true, category: true },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error("[API /wishlist-deals] Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
