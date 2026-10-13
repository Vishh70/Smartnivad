export interface DiscoveredProduct {
  externalId: string; // ASIN (e.g. B0BDK62PDX) or Flipkart PID/FSN
  provider: "AMAZON" | "FLIPKART" | "MANUAL";
  title: string;
  description?: string;
  currentPrice: number;
  originalPrice: number;
  discount: number; // integer 0-100
  affiliateUrl: string; // validated, tracking tag appended
  canonicalUrl: string; // clean URL without tracking/session parameters
  imageUrl: string;
  rating: number; // 0.0 to 5.0
  inStock: boolean;
  brand?: string;
  categorySlug?: string;
  isVerified: boolean;
  rejectionReason?: string;
}

export interface ProviderConfigStatus {
  provider: "AMAZON" | "FLIPKART";
  name: string;
  isConfigured: boolean;
  isPaused: boolean;
  statusMessage: string;
  trackingTag: string;
  marketplace: string;
  rateLimitPerSecond: number;
  lastCheckedAt?: Date;
}

export interface SearchOptions {
  category?: string;
  limit?: number;
  minDiscount?: number;
}

export interface AffiliateProvider {
  readonly id: "AMAZON" | "FLIPKART";
  readonly name: string;

  getConfigStatus(): Promise<ProviderConfigStatus>;
  buildAffiliateUrl(urlOrId: string): string;
  extractExternalId(url: string): string | null;
  validateAffiliateUrl(url: string): boolean;
  searchProducts(
    query: string,
    options?: SearchOptions,
  ): Promise<DiscoveredProduct[]>;
  getProductDetails(identifier: string): Promise<DiscoveredProduct | null>;
}
