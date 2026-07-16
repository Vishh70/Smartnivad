import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";

    if (query.length < 2) {
      return NextResponse.json([]);
    }

    const suggestions = await prisma.deal.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        imageUrl: true,
        currentPrice: true,
        rating: true,
      },
      take: 5,
      orderBy: { clicks: "desc" }, // Return the most popular matching deals first
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("[API /search/suggestions] Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
