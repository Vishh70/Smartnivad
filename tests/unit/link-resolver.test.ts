import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isPrivateOrBlockedHost,
  isApprovedAmazonHost,
  extractAsinFromUrl,
  extractTitleSlugFromUrl,
  verifyTrackingAttribution,
  resolveAmazonLink,
  resolveMultipleAmazonLinks,
} from "@/lib/affiliate/link-resolver";

describe("Amazon Link Resolver & Security", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env.AMAZON_ASSOCIATE_TAG = "smartnivad-21";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe("SSRF Protections & Blocked Hosts", () => {
    it("blocks localhost, loopback, and internal hostnames", () => {
      expect(isPrivateOrBlockedHost("localhost")).toBe(true);
      expect(isPrivateOrBlockedHost("sub.localhost")).toBe(true);
      expect(isPrivateOrBlockedHost("server.local")).toBe(true);
      expect(isPrivateOrBlockedHost("api.internal")).toBe(true);
      expect(isPrivateOrBlockedHost("0.0.0.0")).toBe(true);
      expect(isPrivateOrBlockedHost("::1")).toBe(true);
    });

    it("blocks IPv4 loopback and RFC 1918 private network ranges", () => {
      // Loopback 127.0.0.0/8
      expect(isPrivateOrBlockedHost("127.0.0.1")).toBe(true);
      expect(isPrivateOrBlockedHost("127.1.2.3")).toBe(true);

      // 10.0.0.0/8
      expect(isPrivateOrBlockedHost("10.0.0.1")).toBe(true);
      expect(isPrivateOrBlockedHost("10.254.10.1")).toBe(true);

      // 172.16.0.0/12
      expect(isPrivateOrBlockedHost("172.16.0.1")).toBe(true);
      expect(isPrivateOrBlockedHost("172.31.255.254")).toBe(true);
      expect(isPrivateOrBlockedHost("172.32.0.1")).toBe(false); // public

      // 192.168.0.0/16
      expect(isPrivateOrBlockedHost("192.168.0.1")).toBe(true);
      expect(isPrivateOrBlockedHost("192.168.1.100")).toBe(true);

      // Link-local & Cloud Metadata 169.254.0.0/16 (AWS metadata 169.254.169.254)
      expect(isPrivateOrBlockedHost("169.254.169.254")).toBe(true);
      expect(isPrivateOrBlockedHost("169.254.1.1")).toBe(true);

      // Valid public hostnames
      expect(isPrivateOrBlockedHost("www.amazon.in")).toBe(false);
      expect(isPrivateOrBlockedHost("amzn.to")).toBe(false);
      expect(isPrivateOrBlockedHost("link.amazon")).toBe(false);
    });

    it("rejects URLs with credentials in authority", async () => {
      const result = await resolveAmazonLink(
        "https://user:pass@amzn.to/3xyzABC",
      );
      expect(result.resolutionStatus).toBe("SSRF_BLOCKED");
      expect(result.errorMessage).toContain("credentials");
    });

    it("rejects non-HTTP protocols", async () => {
      const result = await resolveAmazonLink("file:///etc/passwd");
      expect(result.resolutionStatus).toBe("INVALID_URL");
      expect(result.errorMessage).toContain("Unsupported protocol");
    });

    it("blocks SSRF attempts pointing to internal metadata IP", async () => {
      const result = await resolveAmazonLink(
        "http://169.254.169.254/latest/meta-data/",
      );
      expect(result.resolutionStatus).toBe("SSRF_BLOCKED");
    });
  });

  describe("Approved Amazon Domains & Marketplace Validation", () => {
    it("recognizes approved Amazon India and shortlink hosts", () => {
      expect(isApprovedAmazonHost("amzn.to")).toEqual({
        approved: true,
        isIndia: true,
        isShortlink: true,
      });
      expect(isApprovedAmazonHost("link.amazon")).toEqual({
        approved: true,
        isIndia: true,
        isShortlink: true,
      });
      expect(isApprovedAmazonHost("www.amazon.in")).toEqual({
        approved: true,
        isIndia: true,
        isShortlink: false,
      });
      expect(isApprovedAmazonHost("amazon.in")).toEqual({
        approved: true,
        isIndia: true,
        isShortlink: false,
      });
    });

    it("flags non-India Amazon marketplaces as unsupported", () => {
      const usCheck = isApprovedAmazonHost("www.amazon.com");
      expect(usCheck.approved).toBe(true);
      expect(usCheck.isIndia).toBe(false);

      const ukCheck = isApprovedAmazonHost("www.amazon.co.uk");
      expect(ukCheck.approved).toBe(true);
      expect(ukCheck.isIndia).toBe(false);
    });

    it("rejects unapproved third-party domains", () => {
      expect(isApprovedAmazonHost("google.com").approved).toBe(false);
      expect(isApprovedAmazonHost("phishing-amazon.com").approved).toBe(false);
    });
  });

  describe("ASIN & Slug Extraction", () => {
    it("extracts 10-character alphanumeric ASIN from standard Amazon formats", () => {
      expect(extractAsinFromUrl("B01LTI9KAW")).toBe("B01LTI9KAW");
      expect(
        extractAsinFromUrl(
          "https://www.amazon.in/Billdesk-test_model-Mobile-Prepaid-Recharge/dp/B01LTI9KAW?tag=smartnivad-21",
        ),
      ).toBe("B01LTI9KAW");
      expect(
        extractAsinFromUrl(
          "https://www.amazon.in/SPARX-SM-9039-Stylish-Comfortable/dp/B0B4KCH1LV?tag=smartnivad-21",
        ),
      ).toBe("B0B4KCH1LV");
      expect(
        extractAsinFromUrl(
          "https://www.amazon.in/Zebronics-Keyboard-keystrokes-Comfortable-Retractable/dp/B0B29G5SSW",
        ),
      ).toBe("B0B29G5SSW");
      expect(
        extractAsinFromUrl(
          "https://www.amazon.in/Moisturizer-Non-Greasy-Vitamin-Instant-Hydration/dp/B00E96N6O8",
        ),
      ).toBe("B00E96N6O8");
      expect(
        extractAsinFromUrl("https://www.amazon.in/gp/product/B09G9D8KRQ"),
      ).toBe("B09G9D8KRQ");
      expect(extractAsinFromUrl("https://www.amazon.in/d/B08N5WRWNW")).toBe(
        "B08N5WRWNW",
      );
      expect(
        extractAsinFromUrl("https://www.amazon.in/product?asin=B07XG2LKB7"),
      ).toBe("B07XG2LKB7");
      expect(extractAsinFromUrl("invalid-asin")).toBeNull();
    });

    it("extracts title slug from URL path", () => {
      expect(
        extractTitleSlugFromUrl(
          "https://www.amazon.in/SPARX-SM-9039-Stylish-Comfortable/dp/B0B4KCH1LV",
        ),
      ).toBe("SPARX-SM-9039-Stylish-Comfortable");
      expect(
        extractTitleSlugFromUrl(
          "https://www.amazon.in/Zebronics-Keyboard-keystrokes-Comfortable-Retractable/dp/B0B29G5SSW",
        ),
      ).toBe("Zebronics-Keyboard-keystrokes-Comfortable-Retractable");
    });
  });

  describe("Tracking Attribution Verification", () => {
    it("verifies tracking attribution when tag matches configured ID", () => {
      const url =
        "https://www.amazon.in/dp/B0B4KCH1LV?tag=smartnivad-21&linkCode=as4";
      const attribution = verifyTrackingAttribution(url, "smartnivad-21");
      expect(attribution.isTrackingVerified).toBe(true);
      expect(attribution.trackingTag).toBe("smartnivad-21");
      expect(attribution.trackingStatus).toBe("VERIFIED");
    });

    it("flags different tracking tag when attribution belongs to another associate", () => {
      const url = "https://www.amazon.in/dp/B0B4KCH1LV?tag=othertag-21";
      const attribution = verifyTrackingAttribution(url, "smartnivad-21");
      expect(attribution.isTrackingVerified).toBe(false);
      expect(attribution.trackingTag).toBe("othertag-21");
      expect(attribution.trackingStatus).toBe("DIFFERENT_TAG");
    });

    it("flags missing tracking tag when destination has no tag parameter", () => {
      const url = "https://www.amazon.in/dp/B0B4KCH1LV";
      const attribution = verifyTrackingAttribution(url, "smartnivad-21");
      expect(attribution.isTrackingVerified).toBe(false);
      expect(attribution.trackingTag).toBeNull();
      expect(attribution.trackingStatus).toBe("MISSING_TAG");
    });
  });

  describe("Resolution of the 5 Supplied Import Links (Mocked Network)", () => {
    it("resolves the 5 supplied URLs accurately with destination, ASIN, and attribution", async () => {
      // Mock fetch to simulate real server behaviors
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

        // Final destinations return 200
        if (u.includes("amazon.in/")) {
          return Promise.resolve(new Response(null, { status: 200 }));
        }

        return Promise.resolve(new Response(null, { status: 404 }));
      });

      const urls = [
        "https://amzn.to/3VKp4AG",
        "https://amzn.to/3TYvcVs",
        "https://amzn.to/4yKV71P",
        "https://amzn.to/3TYvdJ0",
        "https://link.amazon/B05YNFlPW",
      ];

      const batch = await resolveMultipleAmazonLinks(urls, "smartnivad-21");

      expect(batch.total).toBe(5);
      expect(batch.resolved).toBe(4);
      expect(batch.failed).toBe(1);
      expect(batch.indiaMarketplaceCount).toBe(4);
      expect(batch.trackingVerifiedCount).toBe(4);

      // Link 1: 3VKp4AG
      const l1 = batch.results[0];
      expect(l1.sourceUrl).toBe("https://amzn.to/3VKp4AG");
      expect(l1.asin).toBe("B01LTI9KAW");
      expect(l1.isIndiaMarketplace).toBe(true);
      expect(l1.isTrackingVerified).toBe(true);
      expect(l1.resolutionStatus).toBe("RESOLVED");

      // Link 2: 3TYvcVs
      const l2 = batch.results[1];
      expect(l2.sourceUrl).toBe("https://amzn.to/3TYvcVs");
      expect(l2.asin).toBe("B0B4KCH1LV");
      expect(l2.isIndiaMarketplace).toBe(true);
      expect(l2.isTrackingVerified).toBe(true);
      expect(l2.resolutionStatus).toBe("RESOLVED");

      // Link 3: 4yKV71P
      const l3 = batch.results[2];
      expect(l3.sourceUrl).toBe("https://amzn.to/4yKV71P");
      expect(l3.asin).toBe("B0B29G5SSW");
      expect(l3.isIndiaMarketplace).toBe(true);
      expect(l3.isTrackingVerified).toBe(true);
      expect(l3.resolutionStatus).toBe("RESOLVED");

      // Link 4: 3TYvdJ0
      const l4 = batch.results[3];
      expect(l4.sourceUrl).toBe("https://amzn.to/3TYvdJ0");
      expect(l4.asin).toBe("B00E96N6O8");
      expect(l4.isIndiaMarketplace).toBe(true);
      expect(l4.isTrackingVerified).toBe(true);
      expect(l4.resolutionStatus).toBe("RESOLVED");

      // Link 5: link.amazon/B05YNFlPW (404)
      const l5 = batch.results[4];
      expect(l5.sourceUrl).toBe("https://link.amazon/B05YNFlPW");
      expect(l5.resolutionStatus).toBe("HTTP_ERROR");
      expect(l5.httpStatus).toBe(404);
      expect(l5.isTrackingVerified).toBe(false);
      expect(l5.errorMessage).toContain("HTTP 404");
    });

    it("prevents redirect loops and stops within bounded hops", async () => {
      // Loop: a -> b -> a
      global.fetch = vi.fn().mockImplementation((url: string) => {
        const u = String(url);
        if (u === "https://amzn.to/loopA") {
          return Promise.resolve(
            new Response(null, {
              status: 301,
              headers: {
                location:
                  "https://www.amazon.in/dp/B000000001?tag=smartnivad-21",
              },
            }),
          );
        }
        if (u.includes("dp/B000000001")) {
          return Promise.resolve(
            new Response(null, {
              status: 301,
              headers: { location: "https://amzn.to/loopA" },
            }),
          );
        }
        return Promise.resolve(new Response(null, { status: 200 }));
      });

      const res = await resolveAmazonLink("https://amzn.to/loopA");
      expect(res.resolutionStatus).toBe("HTTP_ERROR");
      expect(res.errorMessage).toContain("loop");
    });
  });
});
