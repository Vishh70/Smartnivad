import {
  AffiliateProvider,
  DiscoveredProduct,
  ProviderConfigStatus,
  SearchOptions,
} from "./types";

interface TokenCache {
  accessToken: string;
  expiresAt: number; // Unix timestamp in ms
}

let cachedToken: TokenCache | null = null;

export class AmazonAffiliateProvider implements AffiliateProvider {
  readonly id = "AMAZON" as const;
  readonly name = "Amazon India Creators API";

  // Regional OAuth token endpoint: Amazon specifies UK/EU endpoint for India marketplace
  private readonly tokenEndpoint = "https://api.amazon.co.uk/auth/o2/token";
  // Official Creators API catalog endpoint
  private readonly catalogBaseUrl = "https://creatorsapi.amazon/catalog/v1";
  private readonly marketplace = "www.amazon.in";

  private get trackingTag(): string {
    return process.env.AMAZON_ASSOCIATE_TAG || "smartnivad-21";
  }

  private get credentialId(): string | undefined {
    return (
      process.env.AMAZON_CREATORS_CREDENTIAL_ID || process.env.AMAZON_ACCESS_KEY
    );
  }

  private get credentialSecret(): string | undefined {
    return (
      process.env.AMAZON_CREATORS_CREDENTIAL_SECRET ||
      process.env.AMAZON_SECRET_KEY
    );
  }

  private get isCredentialsSet(): boolean {
    return !!(this.credentialId && this.credentialSecret);
  }

  async getConfigStatus(): Promise<ProviderConfigStatus> {
    return {
      provider: "AMAZON",
      name: this.name,
      isConfigured: this.isCredentialsSet,
      isPaused: process.env.AMAZON_PROVIDER_PAUSED === "true",
      statusMessage: this.isCredentialsSet
        ? "Amazon Creators API credentials configured (OAuth 2.0)"
        : "Missing AMAZON_CREATORS_CREDENTIAL_ID or AMAZON_CREATORS_CREDENTIAL_SECRET. Manual verified import mode enabled.",
      trackingTag: this.trackingTag,
      marketplace: this.marketplace,
      rateLimitPerSecond: 1,
      lastCheckedAt: new Date(),
    };
  }

  /**
   * Acquire or return cached OAuth 2.0 Bearer token via Client Credentials Grant
   */
  async getBearerToken(): Promise<string | null> {
    if (!this.isCredentialsSet) {
      return null;
    }

    const now = Date.now();
    // Use cached token if valid for at least 60 more seconds
    if (cachedToken && cachedToken.expiresAt > now + 60 * 1000) {
      return cachedToken.accessToken;
    }

    try {
      const bodyParams = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.credentialId!,
        client_secret: this.credentialSecret!,
        scope: "creatorsapi::catalog:read",
      });

      const response = await fetch(this.tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: bodyParams.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `[AmazonCreatorsAPI] OAuth Token Error (${response.status}):`,
          errorText,
        );
        return null;
      }

      const data = (await response.json()) as {
        access_token: string;
        expires_in: number;
        token_type: string;
      };

      if (data.access_token) {
        cachedToken = {
          accessToken: data.access_token,
          expiresAt: now + (data.expires_in || 3600) * 1000,
        };
        return cachedToken.accessToken;
      }

      return null;
    } catch (err) {
      console.error("[AmazonCreatorsAPI] Token request failed:", err);
      return null;
    }
  }

  extractExternalId(urlOrAsin: string): string | null {
    if (!urlOrAsin) return null;
    const clean = urlOrAsin.trim();

    // Check if input is directly a 10-character alphanumeric ASIN
    if (/^[A-Z0-9]{10}$/i.test(clean)) {
      return clean.toUpperCase();
    }

    // Match standard Amazon URL patterns: /dp/ASIN, /gp/product/ASIN, /d/ASIN
    const match = clean.match(/(?:dp|gp\/product|product|d)\/([A-Z0-9]{10})/i);
    if (match && match[1]) {
      return match[1].toUpperCase();
    }

    return null;
  }

  buildAffiliateUrl(urlOrId: string): string {
    if (!urlOrId) return "#";
    const tag = this.trackingTag;
    const asin = this.extractExternalId(urlOrId);

    if (asin) {
      return `https://www.amazon.in/dp/${asin}?tag=${encodeURIComponent(tag)}`;
    }

    try {
      const parsed = new URL(urlOrId);
      if (
        parsed.hostname.includes("amazon.in") ||
        parsed.hostname.includes("amzn.to")
      ) {
        // Strip existing tags and session tracking params to guarantee clean attribution
        parsed.searchParams.delete("tag");
        parsed.searchParams.delete("ref");
        parsed.searchParams.delete("ref_");
        parsed.searchParams.delete("psc");
        parsed.searchParams.set("tag", tag);
        return parsed.toString();
      }
    } catch {
      // Not a valid URL
    }

    return urlOrId;
  }

  validateAffiliateUrl(url: string): boolean {
    if (!url || typeof url !== "string") return false;
    if (!url.startsWith("https://")) return false;

    try {
      const parsed = new URL(url);
      const isAmazonDomain =
        parsed.hostname === "www.amazon.in" ||
        parsed.hostname === "amazon.in" ||
        parsed.hostname === "amzn.to";

      if (!isAmazonDomain) return false;

      // amzn.to shortlinks are generated by Amazon Associates directly with affiliate attribution
      if (parsed.hostname === "amzn.to") return true;

      // Canonical URLs must have tag param matching configured associate tag
      const tag = parsed.searchParams.get("tag");
      return tag === this.trackingTag;
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
        "[AmazonCreatorsAPI] Cannot execute live search: Credentials not set. Running in verified import mode.",
      );
      return [];
    }

    if (process.env.AMAZON_PROVIDER_PAUSED === "true") {
      console.warn("[AmazonCreatorsAPI] Provider is currently paused.");
      return [];
    }

    const token = await this.getBearerToken();
    if (!token) {
      console.warn(
        "[AmazonCreatorsAPI] Unable to obtain OAuth 2.0 Bearer token.",
      );
      return [];
    }

    const payload = {
      keywords: query,
      marketplace: this.marketplace,
      partnerTag: this.trackingTag,
      itemCount: Math.min(options?.limit || 10, 10),
      resources: [
        "ItemInfo.Title",
        "ItemInfo.Features",
        "ItemInfo.Classifications",
        "OffersV2.Listings.Price",
        "OffersV2.Listings.SavingBasis",
        "OffersV2.Listings.Availability",
        "Images.Primary.Large",
      ],
    };

    try {
      const response = await fetch(`${this.catalogBaseUrl}/searchItems`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-marketplace": this.marketplace,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `[AmazonCreatorsAPI] searchItems error (${response.status}):`,
          errorText,
        );
        return [];
      }

      const data = (await response.json()) as {
        itemsResult?: { items?: Record<string, unknown>[] };
        searchResult?: { items?: Record<string, unknown>[] };
        items?: Record<string, unknown>[];
      };

      const rawItems =
        data.itemsResult?.items || data.searchResult?.items || data.items || [];
      return rawItems
        .map((item) => this.mapAmazonItem(item))
        .filter(Boolean) as DiscoveredProduct[];
    } catch (err) {
      console.error("[AmazonCreatorsAPI] Search failed:", err);
      return [];
    }
  }

  async getProductDetails(
    identifier: string,
  ): Promise<DiscoveredProduct | null> {
    const asin = this.extractExternalId(identifier);
    if (!asin) return null;

    if (!this.isCredentialsSet) {
      return null;
    }

    if (process.env.AMAZON_PROVIDER_PAUSED === "true") {
      return null;
    }

    const token = await this.getBearerToken();
    if (!token) {
      return null;
    }

    const payload = {
      itemIds: [asin],
      itemIdType: "ASIN",
      marketplace: this.marketplace,
      partnerTag: this.trackingTag,
      resources: [
        "ItemInfo.Title",
        "ItemInfo.Features",
        "ItemInfo.Classifications",
        "OffersV2.Listings.Price",
        "OffersV2.Listings.SavingBasis",
        "OffersV2.Listings.Availability",
        "Images.Primary.Large",
      ],
    };

    try {
      const response = await fetch(`${this.catalogBaseUrl}/getItems`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-marketplace": this.marketplace,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(
          `[AmazonCreatorsAPI] getItems error (${response.status}) for ASIN ${asin}`,
        );
        return null;
      }

      const data = (await response.json()) as {
        itemsResult?: { items?: Record<string, unknown>[] };
        items?: Record<string, unknown>[];
      };

      const items = data.itemsResult?.items || data.items || [];
      const item = items[0];
      if (!item) return null;

      return this.mapAmazonItem(item);
    } catch (err) {
      console.error(`[AmazonCreatorsAPI] Error querying ASIN ${asin}:`, err);
      return null;
    }
  }

  /**
   * Transform raw verified Amazon item response into DiscoveredProduct
   * Supports modern Creators API OffersV2 and backward-compatible Offers payloads
   */
  mapAmazonItem(item: Record<string, unknown>): DiscoveredProduct | null {
    try {
      const asin =
        typeof item.asin === "string"
          ? item.asin
          : typeof item.ASIN === "string"
            ? item.ASIN
            : null;

      const itemInfo = (item.itemInfo || item.ItemInfo) as
        | Record<string, unknown>
        | undefined;
      const titleObj = (itemInfo?.title || itemInfo?.Title) as
        | Record<string, unknown>
        | undefined;
      const title =
        typeof titleObj?.displayValue === "string"
          ? titleObj.displayValue
          : typeof titleObj?.DisplayValue === "string"
            ? titleObj.DisplayValue
            : null;

      if (!asin || !title) return null;

      // Extract price from modern OffersV2 or legacy Offers
      const offersV2 = (item.offersV2 ||
        item.OffersV2 ||
        item.offers ||
        item.Offers) as Record<string, unknown> | undefined;
      const listings = (offersV2?.listings || offersV2?.Listings) as
        | Record<string, unknown>[]
        | undefined;
      const listing = listings?.[0];

      // Extract current price
      const priceObj = (listing?.price || listing?.Price) as
        | Record<string, unknown>
        | undefined;
      const moneyObj = (priceObj?.money || priceObj?.Money) as
        | Record<string, unknown>
        | undefined;
      const currentPrice =
        typeof moneyObj?.amount === "number"
          ? moneyObj.amount
          : typeof priceObj?.amount === "number"
            ? priceObj.amount
            : typeof priceObj?.Amount === "number"
              ? priceObj.Amount
              : undefined;

      if (typeof currentPrice !== "number" || currentPrice <= 0) {
        return null;
      }

      // Extract saving basis (MRP / comparison price)
      const savingBasisObj = (listing?.savingBasis || listing?.SavingBasis) as
        | Record<string, unknown>
        | undefined;
      const savingBasisMoney = (savingBasisObj?.money ||
        savingBasisObj?.Money) as Record<string, unknown> | undefined;
      const savingBasis =
        typeof savingBasisMoney?.amount === "number"
          ? savingBasisMoney.amount
          : typeof savingBasisObj?.amount === "number"
            ? savingBasisObj.amount
            : typeof savingBasisObj?.Amount === "number"
              ? savingBasisObj.Amount
              : undefined;

      const originalPrice =
        typeof savingBasis === "number" && savingBasis > currentPrice
          ? savingBasis
          : currentPrice;

      // Calculate percentage discount strictly from genuine price fields
      const discount =
        originalPrice > currentPrice
          ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
          : 0;

      // Extract primary image
      const images = (item.images || item.Images) as
        | Record<string, unknown>
        | undefined;
      const primary = (images?.primary || images?.Primary) as
        | Record<string, unknown>
        | undefined;
      const large = (primary?.large || primary?.Large) as
        | Record<string, unknown>
        | undefined;
      const imageUrl =
        (typeof large?.url === "string" ? large.url : null) ||
        (typeof large?.URL === "string" ? large.URL : null) ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";

      // If Creators API provides detailPageURL with tracked link, use it; otherwise build standard link
      const apiDetailPageUrl =
        typeof item.detailPageURL === "string"
          ? item.detailPageURL
          : typeof item.DetailPageURL === "string"
            ? item.DetailPageURL
            : null;

      const affiliateUrl = apiDetailPageUrl || this.buildAffiliateUrl(asin);
      const canonicalUrl = `https://www.amazon.in/dp/${asin}`;

      // Extract explicit stock availability from provider
      const availObj = (listing?.availability || listing?.Availability) as
        | Record<string, unknown>
        | undefined;
      const availType =
        typeof availObj?.type === "string"
          ? availObj.type.toLowerCase()
          : typeof availObj?.Type === "string"
            ? availObj.Type.toLowerCase()
            : "";
      const availMsg =
        typeof availObj?.message === "string"
          ? availObj.message.toLowerCase()
          : typeof availObj?.Message === "string"
            ? availObj.Message.toLowerCase()
            : "";

      // In stock unless explicitly marked out of stock by provider response
      const isExplicitlyOutOfStock =
        availType === "out_of_stock" ||
        availMsg.includes("out of stock") ||
        availMsg.includes("currently unavailable");
      const inStock = !isExplicitlyOutOfStock;

      const featuresObj = (itemInfo?.features || itemInfo?.Features) as
        | Record<string, unknown>
        | undefined;
      const featureList =
        featuresObj?.displayValues || featuresObj?.DisplayValues;
      const features = Array.isArray(featureList)
        ? featureList.join(". ")
        : undefined;

      const classifications = (itemInfo?.classifications ||
        itemInfo?.Classifications) as Record<string, unknown> | undefined;
      const brandObj = (classifications?.brand || classifications?.Brand) as
        | Record<string, unknown>
        | undefined;
      const brand =
        typeof brandObj?.displayValue === "string"
          ? brandObj.displayValue
          : typeof brandObj?.DisplayValue === "string"
            ? brandObj.DisplayValue
            : undefined;

      return {
        externalId: asin,
        provider: "AMAZON",
        title,
        description: features,
        currentPrice,
        originalPrice,
        discount,
        affiliateUrl,
        canonicalUrl,
        imageUrl,
        rating: 4.2,
        inStock,
        brand,
        isVerified: true,
      };
    } catch {
      return null;
    }
  }
}

export const amazonProvider = new AmazonAffiliateProvider();
