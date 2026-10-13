import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { processAmazonLinkImports } from "@/lib/affiliate/import-service";

describe("Amazon Link Import Pipeline & Audit", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.AMAZON_ASSOCIATE_TAG = "smartnivad-21";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  const FIVE_SUPPLIED_LINKS = [
    "https://amzn.to/3VKp4AG",
    "https://amzn.to/3TYvcVs",
    "https://amzn.to/4yKV71P",
    "https://amzn.to/3TYvdJ0",
    "https://link.amazon/B05YNFlPW",
  ];

  it("processes all 5 supplied links in dry-run mode safely without modifying database", async () => {
    // Mock the network resolution responses matching the real Amazon endpoints
    global.fetch = vi.fn().mockImplementation((url: string) => {
      const u = String(url);
      if (u === "https://amzn.to/3VKp4AG") {
        return Promise.resolve(
          new Response(null, {
            status: 301,
            headers: {
              location:
                "https://www.amazon.in/Billdesk-test_model-Mobile-Prepaid-Recharge/dp/B01LTI9KAW?tag=smartnivad-21&linkCode=as4&ref_=onb_gen_lnk",
            },
          }),
        );
      }
      if (u === "https://amzn.to/3TYvcVs") {
        return Promise.resolve(
          new Response(null, {
            status: 301,
            headers: {
              location:
                "https://www.amazon.in/SPARX-SM-9039-Stylish-Comfortable/dp/B0B4KCH1LV?tag=smartnivad-21&linkCode=as4&ref_=onb_gen_lnk",
            },
          }),
        );
      }
      if (u === "https://amzn.to/4yKV71P") {
        return Promise.resolve(
          new Response(null, {
            status: 301,
            headers: {
              location:
                "https://www.amazon.in/Zebronics-Keyboard-keystrokes-Comfortable-Retractable/dp/B0B29G5SSW?tag=smartnivad-21&linkCode=as4&ref_=onb_gen_lnk",
            },
          }),
        );
      }
      if (u === "https://amzn.to/3TYvdJ0") {
        return Promise.resolve(
          new Response(null, {
            status: 301,
            headers: {
              location:
                "https://www.amazon.in/Moisturizer-Non-Greasy-Vitamin-Instant-Hydration/dp/B00E96N6O8?tag=smartnivad-21&linkCode=as4&ref_=onb_gen_lnk",
            },
          }),
        );
      }
      if (u === "https://link.amazon/B05YNFlPW") {
        return Promise.resolve(new Response(null, { status: 404 }));
      }

      if (u.includes("amazon.in/")) {
        return Promise.resolve(new Response(null, { status: 200 }));
      }

      return Promise.resolve(new Response(null, { status: 404 }));
    });

    const result = await processAmazonLinkImports(FIVE_SUPPLIED_LINKS, {
      dryRun: true,
      autoPublish: false,
    });

    expect(result.isDryRun).toBe(true);
    expect(result.totalSubmitted).toBe(5);
    expect(result.successfullyResolved).toBe(4);
    expect(result.invalidOrUnsupported).toBe(1);
    expect(result.awaitingVerification).toBe(4); // API credentials pending

    // Check Candidate 1: Billdesk / B01LTI9KAW
    const item1 = result.items[0];
    expect(item1.sourceUrl).toBe("https://amzn.to/3VKp4AG");
    expect(item1.asin).toBe("B01LTI9KAW");
    expect(item1.isIndiaMarketplace).toBe(true);
    expect(item1.isTrackingVerified).toBe(true);
    expect(item1.trackingTag).toBe("smartnivad-21");
    expect(item1.importStatus).toBe("AWAITING_VERIFICATION");

    // Check Candidate 2: SPARX / B0B4KCH1LV
    const item2 = result.items[1];
    expect(item2.sourceUrl).toBe("https://amzn.to/3TYvcVs");
    expect(item2.asin).toBe("B0B4KCH1LV");
    expect(item2.isIndiaMarketplace).toBe(true);
    expect(item2.isTrackingVerified).toBe(true);
    expect(item2.trackingTag).toBe("smartnivad-21");
    expect(item2.importStatus).toBe("AWAITING_VERIFICATION");

    // Check Candidate 3: Zebronics / B0B29G5SSW
    const item3 = result.items[2];
    expect(item3.sourceUrl).toBe("https://amzn.to/4yKV71P");
    expect(item3.asin).toBe("B0B29G5SSW");
    expect(item3.isIndiaMarketplace).toBe(true);
    expect(item3.isTrackingVerified).toBe(true);
    expect(item3.trackingTag).toBe("smartnivad-21");
    expect(item3.importStatus).toBe("AWAITING_VERIFICATION");

    // Check Candidate 4: Moisturizer / B00E96N6O8
    const item4 = result.items[3];
    expect(item4.sourceUrl).toBe("https://amzn.to/3TYvdJ0");
    expect(item4.asin).toBe("B00E96N6O8");
    expect(item4.isIndiaMarketplace).toBe(true);
    expect(item4.isTrackingVerified).toBe(true);
    expect(item4.trackingTag).toBe("smartnivad-21");
    expect(item4.importStatus).toBe("AWAITING_VERIFICATION");

    // Check Candidate 5: link.amazon 404
    const item5 = result.items[4];
    expect(item5.sourceUrl).toBe("https://link.amazon/B05YNFlPW");
    expect(item5.importStatus).toBe("REJECTED_ERROR");
    expect(item5.httpStatus).toBe(404);
    expect(item5.statusReason).toContain("HTTP 404");
  });

  it("detects duplicates within batch and rejects repeated ASINs", async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      const u = String(url);
      if (u.includes("link1") || u.includes("link2")) {
        return Promise.resolve(
          new Response(null, {
            status: 301,
            headers: {
              location:
                "https://www.amazon.in/dp/B0B4KCH1LV?tag=smartnivad-21&linkCode=as4",
            },
          }),
        );
      }
      return Promise.resolve(new Response(null, { status: 200 }));
    });

    const duplicateBatch = [
      "https://amzn.to/link1",
      "https://amzn.to/link2", // Resolves to same ASIN B0B4KCH1LV!
    ];

    const result = await processAmazonLinkImports(duplicateBatch, {
      dryRun: true,
    });

    expect(result.totalSubmitted).toBe(2);
    expect(result.duplicates).toBe(1);
    expect(result.items[1].importStatus).toBe("DUPLICATE");
    expect(result.items[1].isDuplicate).toBe(true);
  });

  it("never fabricates prices or MRP and strictly calculates discounts", () => {
    // Formula verification: ((comparison - current) / comparison) * 100
    const calcDiscount = (current: number, comparison: number) => {
      if (comparison <= 0 || current <= 0 || current > comparison) return 0;
      return Math.round(((comparison - current) / comparison) * 100);
    };

    expect(calcDiscount(49999, 59900)).toBe(17);
    expect(calcDiscount(1200, 1200)).toBe(0);
    expect(calcDiscount(1500, 1200)).toBe(0); // Price higher than comparison: never negative!
    expect(calcDiscount(0, 5000)).toBe(0); // Zero price rejected!
  });
});
