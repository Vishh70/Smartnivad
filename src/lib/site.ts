const PRODUCTION_ORIGIN = "https://smartnivad.vercel.app";

export function getSiteUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  // Return production origin if NEXT_PUBLIC_SITE_URL is not set or empty
  if (!rawUrl) {
    return PRODUCTION_ORIGIN;
  }

  try {
    // Only create URL if rawUrl is a valid URL string
    const url = new URL(rawUrl);
    return url.origin;
  } catch (error) {
    // If URL parsing fails, log and fallback to production
    console.warn(
      `[getSiteUrl] Invalid NEXT_PUBLIC_SITE_URL: "${rawUrl}". Using fallback.`,
      error
    );
    return PRODUCTION_ORIGIN;
  }
}
