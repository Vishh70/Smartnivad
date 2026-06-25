const PRODUCTION_ORIGIN = "https://smartnivad.vercel.app";

export function getSiteUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!rawUrl) {
    return PRODUCTION_ORIGIN;
  }

  try {
    const url = new URL(rawUrl);
    return url.origin;
  } catch {
    return PRODUCTION_ORIGIN;
  }
}
