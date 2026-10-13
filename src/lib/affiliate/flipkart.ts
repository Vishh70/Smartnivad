import {
  AffiliateProvider,
  DiscoveredProduct,
  ProviderConfigStatus,
  SearchOptions,
} from "./types";

export class FlipkartAffiliateProvider implements AffiliateProvider {
  readonly id = "FLIPKART" as const;
  readonly name = "Flipkart Affiliate Platform";

  private get affiliateId(): string | undefined {
    return process.env.FLIPKART_AFFILIATE_ID;
  }

  private get affiliateToken(): string | undefined {
    return process.env.FLIPKART_AFFILIATE_TOKEN;
  }

  private get isCredentialsSet(): boolean {
    return !!(this.affiliateId && this.affiliateToken);
  }

  async getConfigStatus(): Promise<ProviderConfigStatus> {
    return {
      provider: "FLIPKART",
      name: this.name,
      isConfigured: this.isCredentialsSet,
      isPaused: process.env.FLIPKART_PROVIDER_PAUSED === "true",
      statusMessage: this.isCredentialsSet
        ? "Flipkart Affiliate API active"
        : "Missing FLIPKART_AFFILIATE_ID or FLIPKART_AFFILIATE_TOKEN. Manual verified import mode enabled.",
      trackingTag: this.affiliateId || "not-set",
      marketplace: "flipkart.com",
      rateLimitPerSecond: 2,
      lastCheckedAt: new Date(),
    };
  }

  extractExternalId(urlOrPid: string): string | null {
    if (!urlOrPid) return null;
    const clean = urlOrPid.trim();

    // Check if input is an alphanumeric FSN/PID like ITM123456789 or 16-char PID
    if (/^[A-Z0-9]{12,18}$/i.test(clean)) {
      return clean.toUpperCase();
    }

    // Match pid query param: ?pid=XYZ or &pid=XYZ
    const pidMatch = clean.match(/[?&]pid=([A-Z0-9]+)/i);
    if (pidMatch && pidMatch[1]) {
      return pidMatch[1].toUpperCase();
    }

    // Match /p/itm... pattern
    const itmMatch = clean.match(/\/p\/(itm[a-z0-9]+)/i);
    if (itmMatch && itmMatch[1]) {
      return itmMatch[1].toUpperCase();
    }

    return null;
  }

  buildAffiliateUrl(urlOrId: string): string {
    if (!urlOrId) return "#";
    const affid = this.affiliateId || "smartnivad";

    try {
      const parsed = new URL(urlOrId);
      if (parsed.hostname.includes("flipkart.com")) {
        parsed.searchParams.delete("affid");
        parsed.searchParams.delete("affExtParam1");
        parsed.searchParams.set("affid", affid);
        return parsed.toString();
      }
    } catch {
      // Input might be a product ID
      const pid = this.extractExternalId(urlOrId);
      if (pid) {
        return `https://www.flipkart.com/product/p/itme?pid=${pid}&affid=${affid}`;
      }
    }

    return urlOrId;
  }

  validateAffiliateUrl(url: string): boolean {
    if (!url || typeof url !== "string") return false;
    if (!url.startsWith("https://")) return false;

    try {
      const parsed = new URL(url);
      const isFlipkart =
        parsed.hostname === "www.flipkart.com" ||
        parsed.hostname === "flipkart.com" ||
        parsed.hostname === "dl.flipkart.com";

      if (!isFlipkart) return false;

      const affid = parsed.searchParams.get("affid");
      return !!affid && affid === (this.affiliateId || "smartnivad");
    } catch {
      return false;
    }
  }

  async searchProducts(
    query: string,
    options?: SearchOptions,
  ): Promise<DiscoveredProduct[]> {
    if (!this.isCredentialsSet) {
      console.warn(
        "[FlipkartProvider] Cannot execute search: Flipkart API credentials not configured.",
      );
      return [];
    }

    if (process.env.FLIPKART_PROVIDER_PAUSED === "true") {
      console.warn("[FlipkartProvider] Flipkart provider is currently paused.");
      return [];
    }

    try {
      const count = Math.min(options?.limit || 10, 10);
      const url = `https://affiliate-api.flipkart.net/affiliate/1.0/search.json?query=${encodeURIComponent(query)}&resultCount=${count}`;

      const response = await fetch(url, {
        headers: {
          "Fk-Affiliate-Id": this.affiliateId!,
          "Fk-Affiliate-Token": this.affiliateToken!,
        },
      });

      if (!response.ok) {
        console.error(
          `[FlipkartProvider] Search failed with status ${response.status}`,
        );
        return [];
      }

      const data = (await response.json()) as {
        products?: Record<string, unknown>[];
      };
      const products = data.products || [];
      return products
        .map((p) => this.mapFlipkartProduct(p))
        .filter(Boolean) as DiscoveredProduct[];
    } catch (err) {
      console.error("[FlipkartProvider] Search error:", err);
      return [];
    }
  }

  async getProductDetails(
    identifier: string,
  ): Promise<DiscoveredProduct | null> {
    const pid = this.extractExternalId(identifier);
    if (!pid || !this.isCredentialsSet) return null;

    try {
      const url = `https://affiliate-api.flipkart.net/affiliate/1.0/product.json?id=${pid}`;
      const response = await fetch(url, {
        headers: {
          "Fk-Affiliate-Id": this.affiliateId!,
          "Fk-Affiliate-Token": this.affiliateToken!,
        },
      });

      if (!response.ok) return null;

      const data = (await response.json()) as Record<string, unknown>;
      return this.mapFlipkartProduct(data);
    } catch {
      return null;
    }
  }

  mapFlipkartProduct(item: Record<string, unknown>): DiscoveredProduct | null {
    try {
      const baseInfo = item.productBaseInfoV1 as
        | Record<string, unknown>
        | undefined;
      if (!baseInfo) return null;

      const pid =
        typeof baseInfo.productId === "string" ? baseInfo.productId : null;
      const title = typeof baseInfo.title === "string" ? baseInfo.title : null;
      const sellingPriceObj = baseInfo.flipkartSellingPrice as
        | Record<string, unknown>
        | undefined;
      const currentPrice =
        typeof sellingPriceObj?.amount === "number"
          ? sellingPriceObj.amount
          : undefined;
      const mrpObj = baseInfo.maximumRetailPrice as
        | Record<string, unknown>
        | undefined;
      const originalPrice =
        typeof mrpObj?.amount === "number" ? mrpObj.amount : currentPrice;

      if (
        !pid ||
        !title ||
        typeof currentPrice !== "number" ||
        currentPrice <= 0
      ) {
        return null;
      }

      const discount =
        originalPrice && originalPrice > currentPrice
          ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
          : 0;

      const imageUrls = baseInfo.imageUrls as
        | Record<string, string>
        | undefined;
      const imageUrl =
        imageUrls?.["800x800"] ||
        imageUrls?.["400x400"] ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";

      const affiliateUrl = this.buildAffiliateUrl(
        typeof baseInfo.productUrl === "string" ? baseInfo.productUrl : pid,
      );
      const canonicalUrl = `https://www.flipkart.com/product/p/itme?pid=${pid}`;

      return {
        externalId: pid,
        provider: "FLIPKART",
        title,
        description:
          typeof baseInfo.productDescription === "string"
            ? baseInfo.productDescription
            : undefined,
        currentPrice,
        originalPrice: originalPrice || currentPrice,
        discount,
        affiliateUrl,
        canonicalUrl,
        imageUrl,
        rating: 4.1,
        inStock:
          typeof baseInfo.inStock === "boolean" ? baseInfo.inStock : true,
        brand:
          typeof baseInfo.productBrand === "string"
            ? baseInfo.productBrand
            : undefined,
        isVerified: true,
      };
    } catch {
      return null;
    }
  }
}

export const flipkartProvider = new FlipkartAffiliateProvider();
