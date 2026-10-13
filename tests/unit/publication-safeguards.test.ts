import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma for isolated unit testing
const mockDealFindMany = vi.fn();
const mockDealFindUnique = vi.fn();
const mockDealFindFirst = vi.fn();
const mockDealCreate = vi.fn();
const mockStoreFindFirst = vi.fn();
const mockCategoryFindFirst = vi.fn();
const mockImportQueueCreate = vi.fn();
const mockDiscoveryRunCreate = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    deal: {
      findMany: (...args: unknown[]) => mockDealFindMany(...args),
      findUnique: (...args: unknown[]) => mockDealFindUnique(...args),
      findFirst: (...args: unknown[]) => mockDealFindFirst(...args),
      create: (...args: unknown[]) => mockDealCreate(...args),
    },
    store: {
      findFirst: (...args: unknown[]) => mockStoreFindFirst(...args),
    },
    category: {
      findFirst: (...args: unknown[]) => mockCategoryFindFirst(...args),
    },
    importQueueItem: {
      create: (...args: unknown[]) => mockImportQueueCreate(...args),
    },
    discoveryRun: {
      create: (...args: unknown[]) => mockDiscoveryRunCreate(...args),
    },
  },
}));

import { processAmazonLinkImports } from "@/lib/affiliate/import-service";
import { getDeals, getDealBySlug } from "@/lib/data";

describe("Publication Safeguards & Catalog Protection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Catalog Query Enforcements", () => {
    it("getDeals enforces status: PUBLISHED filter on all queries", async () => {
      mockDealFindMany.mockResolvedValue([
        {
          id: "deal-1",
          slug: "verified-deal",
          title: "Verified Deal",
          status: "PUBLISHED",
          currentPrice: 999,
          originalPrice: 1999,
        },
      ]);

      const result = await getDeals(10, 0);

      expect(mockDealFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "PUBLISHED" },
        }),
      );
      expect(result).toHaveLength(1);
    });

    it("getDealBySlug rejects non-published or unverified deals", async () => {
      mockDealFindUnique.mockResolvedValue(null);

      const result = await getDealBySlug("unverified-sparx-shoes");

      expect(mockDealFindUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            slug: "unverified-sparx-shoes",
            status: "PUBLISHED",
          },
        }),
      );
      expect(result).toBeNull();
    });
  });

  describe("Import Pipeline Safeguards", () => {
    it("quarantines candidates without API credentials as AWAITING_VERIFICATION and creates zero deals", async () => {
      // Mock network resolution for candidate
      vi.spyOn(global, "fetch").mockImplementation(
        (url: string | URL | Request) => {
          if (String(url).includes("amzn.to/candidate")) {
            return Promise.resolve(
              new Response(null, {
                status: 301,
                headers: {
                  location:
                    "https://www.amazon.in/SPARX-SM-9039-Shoes/dp/B0B4KCH1LV?tag=smartnivad-21",
                },
              }),
            );
          }
          return Promise.resolve(new Response(null, { status: 200 }));
        },
      );

      // Ensure Creators API credentials are not set
      delete process.env.AMAZON_CREATORS_CREDENTIAL_ID;
      delete process.env.AMAZON_CREATORS_CREDENTIAL_SECRET;
      delete process.env.AMAZON_ACCESS_KEY;
      delete process.env.AMAZON_SECRET_KEY;

      const result = await processAmazonLinkImports(
        ["https://amzn.to/candidate"],
        {
          dryRun: false,
          autoPublish: true, // Auto publish is requested, but must be BLOCKED
        },
      );

      expect(result.items).toHaveLength(1);
      const candidate = result.items[0];

      // Must be quarantined
      expect(candidate.importStatus).toBe("AWAITING_VERIFICATION");
      expect(candidate.currentPrice).toBeNull();
      expect(candidate.originalPrice).toBeNull();
      expect(candidate.dealId).toBeUndefined();

      // Zero deals created in DB
      expect(mockDealCreate).not.toHaveBeenCalled();
    });

    it("rejects invalid links and HTTP errors with REJECTED_ERROR", async () => {
      vi.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve(new Response(null, { status: 404 })),
      );

      const result = await processAmazonLinkImports(
        ["https://link.amazon/invalid404"],
        {
          dryRun: false,
          autoPublish: true,
        },
      );

      expect(result.items).toHaveLength(1);
      const item = result.items[0];
      expect(item.importStatus).toBe("REJECTED_ERROR");
      expect(mockDealCreate).not.toHaveBeenCalled();
    });
  });
});
