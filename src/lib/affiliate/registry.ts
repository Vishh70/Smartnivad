import { AffiliateProvider, ProviderConfigStatus } from "./types";
import { amazonProvider } from "./amazon";
import { flipkartProvider } from "./flipkart";

const providers: Record<string, AffiliateProvider> = {
  AMAZON: amazonProvider,
  FLIPKART: flipkartProvider,
};

export function getProvider(
  idOrStoreName?: string | null,
): AffiliateProvider | null {
  if (!idOrStoreName) return null;
  const key = idOrStoreName.trim().toUpperCase();

  if (providers[key]) return providers[key];
  if (key.includes("AMAZON")) return amazonProvider;
  if (key.includes("FLIPKART")) return flipkartProvider;

  return null;
}

export function getAllProviders(): AffiliateProvider[] {
  return Object.values(providers);
}

export async function getAllConfigStatuses(): Promise<ProviderConfigStatus[]> {
  const list = getAllProviders();
  return Promise.all(list.map((p) => p.getConfigStatus()));
}

export function resolveProviderByUrl(url: string): AffiliateProvider | null {
  if (!url) return null;
  const lower = url.toLowerCase();
  if (lower.includes("amazon.in") || lower.includes("amzn.to")) {
    return amazonProvider;
  }
  if (lower.includes("flipkart.com")) {
    return flipkartProvider;
  }
  return null;
}
