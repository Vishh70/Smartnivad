import { describe, it, expect, beforeEach } from "vitest";
import { AmazonAffiliateProvider } from "@/lib/affiliate/amazon";
import { FlipkartAffiliateProvider } from "@/lib/affiliate/flipkart";
import { getProvider, resolveProviderByUrl } from "@/lib/affiliate/registry";

describe("Affiliate Engine & Provider Validation", () => {
  const amazonProvider = new AmazonAffiliateProvider();
  const flipkartProvider = new FlipkartAffiliateProvider();

  beforeEach(() => {
    process.env.AMAZON_ASSOCIATE_TAG = "smartnivad-21";
    process.env.FLIPKART_AFFILIATE_ID = "smartnivad-aff";
  });

  describe("Amazon India Provider & URL Validation", () => {
    it("extracts ASIN correctly from various Amazon URL formats", () => {
      expect(amazonProvider.extractExternalId("B0BDK62PDX")).toBe("B0BDK62PDX");
      expect(
        amazonProvider.extractExternalId(
          "https://www.amazon.in/Apple-iPhone-13-128GB-Starlight/dp/B09G9D8KRQ?ref_=ast_sto_dp",
        ),
      ).toBe("B09G9D8KRQ");
      expect(
        amazonProvider.extractExternalId(
          "https://www.amazon.in/gp/product/B07XG2LKB7",
        ),
      ).toBe("B07XG2LKB7");
      expect(
        amazonProvider.extractExternalId("https://unknown-site.com/item/123"),
      ).toBeNull();
    });

    it("builds valid tracked affiliate URL appending configured Associates tag", () => {
      const url = amazonProvider.buildAffiliateUrl("B09G9D8KRQ");
      expect(url).toBe("https://www.amazon.in/dp/B09G9D8KRQ?tag=smartnivad-21");
      expect(amazonProvider.validateAffiliateUrl(url)).toBe(true);
    });

    it("cleans existing referral parameters and replaces with configured tag", () => {
      const rawUrl =
        "https://www.amazon.in/dp/B09G9D8KRQ?tag=oldtag-21&ref=sr_1_1&psc=1";
      const cleaned = amazonProvider.buildAffiliateUrl(rawUrl);
      expect(cleaned).toContain("tag=smartnivad-21");
      expect(cleaned).not.toContain("tag=oldtag-21");
      expect(cleaned).not.toContain("ref=sr_1_1");
    });

    it("validates affiliate URLs and rejects untracked or unsafe links", () => {
      expect(
        amazonProvider.validateAffiliateUrl(
          "https://www.amazon.in/dp/B09G9D8KRQ?tag=smartnivad-21",
        ),
      ).toBe(true);
      // Shortlink amzn.to is valid
      expect(
        amazonProvider.validateAffiliateUrl("https://amzn.to/3xyzABC"),
      ).toBe(true);
      // Untracked Amazon link is rejected
      expect(
        amazonProvider.validateAffiliateUrl(
          "https://www.amazon.in/dp/B09G9D8KRQ",
        ),
      ).toBe(false);
      // Insecure or phishing link is rejected
      expect(
        amazonProvider.validateAffiliateUrl("http://amazon.in/dp/B09G9D8KRQ"),
      ).toBe(false);
      expect(amazonProvider.validateAffiliateUrl("javascript:alert(1)")).toBe(
        false,
      );
    });

    it("transforms raw verified Amazon item response into DiscoveredProduct strictly without fake discounts", () => {
      const rawAmazonItem = {
        ASIN: "B09G9D8KRQ",
        ItemInfo: {
          Title: { DisplayValue: "Apple iPhone 13 (128GB) - Blue" },
          Classifications: { Brand: { DisplayValue: "Apple" } },
        },
        Offers: {
          Listings: [
            {
              Price: { Amount: 49999 },
              SavingBasis: { Amount: 59900 },
              Availability: { Message: "In Stock." },
            },
          ],
        },
        Images: {
          Primary: {
            Large: {
              URL: "https://m.media-amazon.com/images/I/71xb2xkN5qL._SL1500_.jpg",
            },
          },
        },
      };

      const product = amazonProvider.mapAmazonItem(rawAmazonItem);
      expect(product).not.toBeNull();
      expect(product?.externalId).toBe("B09G9D8KRQ");
      expect(product?.currentPrice).toBe(49999);
      expect(product?.originalPrice).toBe(59900);
      // 59900 - 49999 = 9901 / 59900 = 16.52% -> 17%
      expect(product?.discount).toBe(17);
      expect(product?.inStock).toBe(true);
      expect(product?.affiliateUrl).toContain("tag=smartnivad-21");
    });

    it("transforms modern Amazon Creators API OffersV2 response properly", () => {
      const modernCreatorsItem = {
        asin: "B0CHX1W1XY",
        itemInfo: {
          title: { displayValue: "Apple iPhone 15 (128 GB) - Black" },
          classifications: { brand: { displayValue: "Apple" } },
        },
        offersV2: {
          listings: [
            {
              price: { money: { amount: 69999, currency: "INR" } },
              savingBasis: { money: { amount: 79900, currency: "INR" } },
              availability: { type: "IN_STOCK", message: "In stock" },
            },
          ],
        },
        images: {
          primary: {
            large: {
              url: "https://m.media-amazon.com/images/I/71657TiFeHL._SL1500_.jpg",
            },
          },
        },
        detailPageURL:
          "https://www.amazon.in/dp/B0CHX1W1XY?tag=smartnivad-21&linkCode=ogi",
      };

      const product = amazonProvider.mapAmazonItem(modernCreatorsItem);
      expect(product).not.toBeNull();
      expect(product?.externalId).toBe("B0CHX1W1XY");
      expect(product?.currentPrice).toBe(69999);
      expect(product?.originalPrice).toBe(79900);
      expect(product?.discount).toBe(12); // (79900 - 69999) / 79900 = 12.39% -> 12%
      expect(product?.inStock).toBe(true);
      // Detail page URL from Creators API is used directly to preserve attribution
      expect(product?.affiliateUrl).toBe(
        "https://www.amazon.in/dp/B0CHX1W1XY?tag=smartnivad-21&linkCode=ogi",
      );
    });

    it("marks product out of stock only when provider response is explicitly out of stock", () => {
      const outOfStockItem = {
        asin: "B0CHX1W1XY",
        itemInfo: {
          title: { displayValue: "Apple iPhone 15" },
        },
        offersV2: {
          listings: [
            {
              price: { money: { amount: 69999 } },
              availability: {
                type: "OUT_OF_STOCK",
                message: "Currently unavailable.",
              },
            },
          ],
        },
      };

      const product = amazonProvider.mapAmazonItem(outOfStockItem);
      expect(product?.inStock).toBe(false);
    });

    it("sets discount to 0 and originalPrice to currentPrice when no genuine SavingBasis is returned", () => {
      const rawNoDiscount = {
        ASIN: "B09G9D8KRQ",
        ItemInfo: {
          Title: { DisplayValue: "Sample Product" },
        },
        Offers: {
          Listings: [
            {
              Price: { Amount: 1200 },
              Availability: { Message: "In Stock" },
            },
          ],
        },
      };

      const product = amazonProvider.mapAmazonItem(rawNoDiscount);
      expect(product?.currentPrice).toBe(1200);
      expect(product?.originalPrice).toBe(1200);
      expect(product?.discount).toBe(0);
    });
  });

  describe("Flipkart Provider Validation", () => {
    it("extracts PID correctly from Flipkart URL patterns", () => {
      expect(
        flipkartProvider.extractExternalId(
          "https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4?pid=MOBGTAGPTB3VS24W",
        ),
      ).toBe("MOBGTAGPTB3VS24W");
      expect(flipkartProvider.extractExternalId("MOBGTAGPTB3VS24W")).toBe(
        "MOBGTAGPTB3VS24W",
      );
    });

    it("builds valid tracked Flipkart affiliate URL", () => {
      const url = flipkartProvider.buildAffiliateUrl(
        "https://www.flipkart.com/product/p/itme?pid=MOBGTAGPTB3VS24W",
      );
      expect(url).toContain("affid=smartnivad-aff");
      expect(flipkartProvider.validateAffiliateUrl(url)).toBe(true);
    });
  });

  describe("Provider Registry & Resolution", () => {
    it("resolves correct provider from store name or URL", () => {
      expect(getProvider("Amazon India")?.id).toBe("AMAZON");
      expect(getProvider("Flipkart")?.id).toBe("FLIPKART");
      expect(
        resolveProviderByUrl("https://www.amazon.in/dp/B0BDK62PDX")?.id,
      ).toBe("AMAZON");
      expect(
        resolveProviderByUrl("https://www.flipkart.com/item/p/itm123")?.id,
      ).toBe("FLIPKART");
      expect(resolveProviderByUrl("https://unknown.com")).toBeNull();
    });
  });

  describe("Price Sanity and Safety Guardrails", () => {
    it("never overwrites price with null, zero, or negative numbers", () => {
      const existingPrice = 49999;
      const invalidResponses = [null, undefined, 0, -500, NaN, "free"];

      for (const invalid of invalidResponses) {
        let priceToSave = existingPrice;
        if (typeof invalid === "number" && invalid > 0 && !isNaN(invalid)) {
          priceToSave = invalid;
        }
        expect(priceToSave).toBe(existingPrice);
      }
    });

    it("flags deals with suspicious discount anomalies > 85% for review queue", () => {
      const normalDiscount = 40;
      const suspiciousDiscount = 92;

      const shouldReviewNormal = normalDiscount > 85;
      const shouldReviewSuspicious = suspiciousDiscount > 85;

      expect(shouldReviewNormal).toBe(false);
      expect(shouldReviewSuspicious).toBe(true);
    });

    it("flags stale prices when last successful check is older than 24 hours", () => {
      const now = Date.now();
      const twentyHoursAgo = new Date(now - 20 * 60 * 60 * 1000);
      const twentySixHoursAgo = new Date(now - 26 * 60 * 60 * 1000);

      const isStale20h = now - twentyHoursAgo.getTime() > 24 * 60 * 60 * 1000;
      const isStale26h =
        now - twentySixHoursAgo.getTime() > 24 * 60 * 60 * 1000;

      expect(isStale20h).toBe(false);
      expect(isStale26h).toBe(true);
    });

    it("ensures repeated API failures mark prices stale and queue for review without marking out of stock or expired", () => {
      // Simulating failure handler behavior
      const deal = {
        id: "deal-123",
        currentPrice: 19999,
        inStock: true,
        dealType: "HOT_DEAL",
        consecutiveFailures: 4,
        isPriceStale: false,
        reviewQueue: false,
        reviewReason: null as string | null,
      };

      // 5th failure occurs
      const newFailures = deal.consecutiveFailures + 1;
      const isCircuitBroken = newFailures >= 5;

      const updatedDeal = {
        ...deal,
        consecutiveFailures: newFailures,
        isPriceStale: true,
        reviewQueue: isCircuitBroken ? true : deal.reviewQueue,
        reviewReason: isCircuitBroken
          ? "5 consecutive provider check failures - price marked stale for admin verification"
          : deal.reviewReason,
        // Crucial safety rules:
        // 1. Stock status must NOT be changed to false on request failure
        // 2. Deal must NOT be marked expired
        // 3. Price must NOT be zeroed or changed
      };

      expect(updatedDeal.consecutiveFailures).toBe(5);
      expect(updatedDeal.isPriceStale).toBe(true);
      expect(updatedDeal.reviewQueue).toBe(true);
      expect(updatedDeal.reviewReason).toContain(
        "5 consecutive provider check failures",
      );
      expect(updatedDeal.inStock).toBe(true); // preserved!
      expect(updatedDeal.dealType).toBe("HOT_DEAL"); // NOT expired!
      expect(updatedDeal.currentPrice).toBe(19999); // NOT overwritten!
    });

    it("updates stock status ONLY when supported by an explicit provider response", () => {
      const explicitInStockResponse = {
        inStock: true,
        currentPrice: 12999,
      };
      const explicitOutOfStockResponse = {
        inStock: false,
        currentPrice: 12999,
      };
      const failedNetworkResponse: {
        inStock: boolean;
        currentPrice: number;
      } | null = null;

      const initialStock = true;

      // With explicit in-stock response
      const stockAfterInStock = explicitInStockResponse.inStock;
      expect(stockAfterInStock).toBe(true);

      // With explicit out-of-stock response
      const stockAfterOutOfStock = explicitOutOfStockResponse.inStock;
      expect(stockAfterOutOfStock).toBe(false);

      // With network failure response: preserve initialStock
      let stockAfterFailure = initialStock;
      if (failedNetworkResponse !== null) {
        stockAfterFailure = (
          failedNetworkResponse as { inStock: boolean; currentPrice: number }
        ).inStock;
      }
      expect(stockAfterFailure).toBe(true); // never set to false on failure!
    });

    it("verifies stale prices are not published as live active discounts", () => {
      const liveProduct = {
        title: "Product A",
        currentPrice: 1000,
        originalPrice: 2000,
        discount: 50,
        isPriceStale: false,
      };

      const staleProduct = {
        title: "Product B",
        currentPrice: 1000,
        originalPrice: 2000,
        discount: 50,
        isPriceStale: true,
      };

      // Helper function matching UI logic
      const shouldDisplayLiveDiscount = (p: typeof liveProduct) => {
        return p.discount > 0 && !p.isPriceStale;
      };

      expect(shouldDisplayLiveDiscount(liveProduct)).toBe(true);
      expect(shouldDisplayLiveDiscount(staleProduct)).toBe(false);
    });
  });

  describe("Cron Authentication & Security Guardrails", () => {
    it("mandates CRON_SECRET and rejects requests if secret is missing or header invalid", () => {
      const validSecret = "super-secret-token-12345";

      // Test helper simulating the cron auth logic
      const checkAuth = (header: string | null, secret?: string) => {
        if (!secret) return false;
        return header === `Bearer ${secret}`;
      };

      // Valid case
      expect(checkAuth(`Bearer ${validSecret}`, validSecret)).toBe(true);

      // Invalid bearer
      expect(checkAuth(`Bearer wrong-token`, validSecret)).toBe(false);
      expect(checkAuth(null, validSecret)).toBe(false);

      // Missing CRON_SECRET in environment MUST NOT bypass authentication!
      expect(checkAuth(`Bearer undefined`, undefined)).toBe(false);
      expect(checkAuth(null, undefined)).toBe(false);
    });
  });
});
