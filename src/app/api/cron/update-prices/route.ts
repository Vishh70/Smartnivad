import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapePrice } from "@/lib/scraper";

// Max execution time for hobby plan is typically 10-60s
export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    // 1. Verify Authentication
    const authHeader = request.headers.get("authorization");
    if (
      authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
      process.env.NODE_ENV !== "development"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting automation engine...");

    // 2. Fetch active deals to check
    // In a real scenario, you might limit this to the oldest checked deals to prevent timeouts
    const deals = await prisma.deal.findMany({
      where: {
        status: "PUBLISHED",
        dealType: { in: ["LIVE", "HOT"] },
      },
      include: {
        store: true,
      },
      orderBy: { updatedAt: "asc" },
      take: 20, // Process 20 per run to stay under Vercel timeout
    });

    const results = [];

    // 3. Process each deal
    for (const deal of deals) {
      const startTime = performance.now();
      let status = "Success";
      let errorMessage = null;
      let newPrice: number | null = null;

      try {
        if (
          !deal.affiliateUrl ||
          deal.affiliateUrl === "#" ||
          !deal.affiliateUrl.startsWith("http")
        ) {
          throw new Error("Invalid URL");
        }

        newPrice = await scrapePrice(deal.affiliateUrl, deal.store.name);

        if (newPrice && newPrice !== deal.currentPrice) {
          // Price changed!

          // Only log history if price actually dropped or changed significantly
          await prisma.$transaction(async (tx) => {
            // Update the deal
            await tx.deal.update({
              where: { id: deal.id },
              data: { currentPrice: newPrice! },
            });

            // Add to price history
            await tx.priceHistory.create({
              data: {
                dealId: deal.id,
                price: newPrice!,
                capturedAt: new Date(),
              },
            });
          });

          status = "PriceUpdated";
        } else if (!newPrice) {
          status = "Failed";
          errorMessage = "Scraper returned null";
          await prisma.deal.update({ where: { id: deal.id }, data: { updatedAt: new Date() }});
        } else {
          status = "Unchanged";
          await prisma.deal.update({ where: { id: deal.id }, data: { updatedAt: new Date() }});
        }
      } catch (error: unknown) {
        status = "Error";
        errorMessage = error instanceof Error ? error.message : "Unknown error";
      }

      const duration = (performance.now() - startTime) / 1000;

      // 4. Log the result
      await prisma.automationLog.create({
        data: {
          dealId: deal.id,
          store: deal.store.name,
          status,
          oldPrice: deal.currentPrice,
          newPrice: newPrice || null,
          duration,
          errorMessage,
        },
      });

      results.push({
        dealId: deal.id,
        store: deal.store.name,
        status,
        oldPrice: deal.currentPrice,
        newPrice,
        duration: `${duration.toFixed(2)}s`,
      });

      // Add a small delay between requests to be polite to servers
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} deals`,
      results,
    });
  } catch (error: unknown) {
    console.error("Cron execution failed:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
