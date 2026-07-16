import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json([]);
    }

    // Limit to 50 IDs to prevent abuse
    const safeIds = ids.slice(0, 50);

    const deals = await prisma.deal.findMany({
      where: { id: { in: safeIds } },
      include: { store: true, brand: true, category: true },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error("[API /wishlist-deals] Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
