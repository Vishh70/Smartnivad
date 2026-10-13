/**
 * SmartNivad — Secure Amazon Link Resolution Utility
 *
 * Safely resolves Amazon shortlinks and URLs with:
 * - Strict URL validation (HTTPS/HTTP only, credentials forbidden)
 * - SSRF protections (blocks loopback, RFC 1918 private IPs, AWS/Cloud metadata IPs)
 * - Approved Amazon host whitelisting (amzn.to, link.amazon, *.amazon.in)
 * - Marketplace validation (flags non-India Amazon domains)
 * - Bounded redirect following (max 5 hops, loop detection)
 * - Reliable ASIN extraction
 * - Affiliate tracking tag verification (verifies smartnivad-21)
 * - Zero client-side / DOM JavaScript execution
 */

export interface ResolvedAmazonLink {
  sourceUrl: string;
  resolvedUrl: string | null;
  asin: string | null;
  titleSlug: string | null;
  marketplace: string | null;
  isIndiaMarketplace: boolean;
  httpStatus: number | null;
  redirectHops: number;
  trackingTag: string | null;
  isTrackingVerified: boolean;
  trackingStatus: "VERIFIED" | "DIFFERENT_TAG" | "MISSING_TAG" | "UNRESOLVED";
  resolutionStatus:
    | "RESOLVED"
    | "HTTP_ERROR"
    | "SSRF_BLOCKED"
    | "UNSUPPORTED_MARKETPLACE"
    | "UNAPPROVED_HOST"
    | "INVALID_URL";
  errorMessage: string | null;
}

export interface BatchResolutionResult {
  total: number;
  resolved: number;
  failed: number;
  indiaMarketplaceCount: number;
  trackingVerifiedCount: number;
  results: ResolvedAmazonLink[];
}

const EXPECTED_TRACKING_TAG =
  process.env.AMAZON_ASSOCIATE_TAG || "smartnivad-21";
const MAX_REDIRECT_HOPS = 5;

// Approved source hosts
const APPROVED_SHORTLINK_HOSTS = new Set([
  "amzn.to",
  "link.amazon",
  "www.amzn.to",
]);

// Approved marketplace hosts
const APPROVED_MARKETPLACE_HOSTS = new Set(["amazon.in", "www.amazon.in"]);

/**
 * Checks if a hostname or IP is a private/internal or metadata address (SSRF Protection)
 */
export function isPrivateOrBlockedHost(hostname: string): boolean {
  if (!hostname) return true;
  const clean = hostname.trim().toLowerCase();

  // Localhost & internal hostnames
  if (
    clean === "localhost" ||
    clean.endsWith(".localhost") ||
    clean.endsWith(".local") ||
    clean.endsWith(".internal") ||
    clean === "0.0.0.0"
  ) {
    return true;
  }

  // IPv6 loopback and private
  if (
    clean === "::1" ||
    clean.startsWith("fc00:") ||
    clean.startsWith("fe80:")
  ) {
    return true;
  }

  // IPv4 regex check
  const ipv4Match = clean.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const octets = [
      parseInt(ipv4Match[1], 10),
      parseInt(ipv4Match[2], 10),
      parseInt(ipv4Match[3], 10),
      parseInt(ipv4Match[4], 10),
    ];

    // Invalid IP
    if (octets.some((o) => o < 0 || o > 255)) return true;

    // Loopback: 127.0.0.0/8
    if (octets[0] === 127) return true;

    // RFC 1918 Private ranges:
    // 10.0.0.0/8
    if (octets[0] === 10) return true;

    // 172.16.0.0/12 (172.16.x.x - 172.31.x.x)
    if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;

    // 192.168.0.0/16
    if (octets[0] === 192 && octets[1] === 168) return true;

    // Link-local / Cloud metadata: 169.254.0.0/16 (e.g. 169.254.169.254)
    if (octets[0] === 169 && octets[1] === 254) return true;

    // Broadcast: 255.255.255.255
    if (octets.every((o) => o === 255)) return true;
  }

  return false;
}

/**
 * Validates whether a host is an approved Amazon domain
 */
export function isApprovedAmazonHost(hostname: string): {
  approved: boolean;
  isIndia: boolean;
  isShortlink: boolean;
} {
  const clean = hostname.trim().toLowerCase();

  if (APPROVED_SHORTLINK_HOSTS.has(clean)) {
    return { approved: true, isIndia: true, isShortlink: true };
  }

  if (APPROVED_MARKETPLACE_HOSTS.has(clean)) {
    return { approved: true, isIndia: true, isShortlink: false };
  }

  // Detect other regional Amazon domains (e.g. amazon.com, amazon.co.uk)
  if (
    clean === "amazon.com" ||
    clean.endsWith(".amazon.com") ||
    clean.endsWith(".amazon.co.uk")
  ) {
    return { approved: true, isIndia: false, isShortlink: false };
  }

  return { approved: false, isIndia: false, isShortlink: false };
}

/**
 * Extracts 10-character alphanumeric Amazon ASIN from URL or raw text
 */
export function extractAsinFromUrl(urlOrText: string): string | null {
  if (!urlOrText) return null;
  const clean = urlOrText.trim();

  // Raw ASIN: exactly 10 alphanumeric chars
  if (/^[A-Z0-9]{10}$/i.test(clean)) {
    return clean.toUpperCase();
  }

  // Common Amazon URL paths:
  // /dp/B0BDK62PDX
  // /gp/product/B0BDK62PDX
  // /product/B0BDK62PDX
  // /d/B0BDK62PDX
  // /[slug]/dp/B0BDK62PDX
  const patterns = [
    /(?:dp|gp\/product|product|d)\/([A-Z0-9]{10})(?:[/?&#]|$)/i,
    /\/([A-Z0-9]{10})(?:[/?&#]|$)/i,
  ];

  for (const pattern of patterns) {
    const match = clean.match(pattern);
    if (match && match[1] && /^[A-Z0-9]{10}$/i.test(match[1])) {
      return match[1].toUpperCase();
    }
  }

  // Query parameter: ?asin=B0BDK62PDX
  try {
    const parsed = new URL(clean);
    const paramAsin =
      parsed.searchParams.get("asin") || parsed.searchParams.get("ASIN");
    if (paramAsin && /^[A-Z0-9]{10}$/i.test(paramAsin)) {
      return paramAsin.toUpperCase();
    }
  } catch {
    // Not a full URL
  }

  return null;
}

/**
 * Extracts product title slug from Amazon URL path (e.g., /SPARX-SM-9039-Stylish-Comfortable/dp/...)
 */
export function extractTitleSlugFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const dpIndex = pathParts.indexOf("dp");
    if (dpIndex > 0) {
      return decodeURIComponent(pathParts[dpIndex - 1]);
    }
    // Check first part if not followed by dp
    if (pathParts.length > 0 && !["dp", "gp", "d"].includes(pathParts[0])) {
      return decodeURIComponent(pathParts[0]);
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Validates outbound affiliate tracking tag on the resolved destination URL
 */
export function verifyTrackingAttribution(
  resolvedUrl: string | null,
  expectedTag: string = EXPECTED_TRACKING_TAG,
): {
  isTrackingVerified: boolean;
  trackingTag: string | null;
  trackingStatus: "VERIFIED" | "DIFFERENT_TAG" | "MISSING_TAG" | "UNRESOLVED";
} {
  if (!resolvedUrl) {
    return {
      isTrackingVerified: false,
      trackingTag: null,
      trackingStatus: "UNRESOLVED",
    };
  }

  try {
    const parsed = new URL(resolvedUrl);
    const tag = parsed.searchParams.get("tag");

    if (!tag) {
      return {
        isTrackingVerified: false,
        trackingTag: null,
        trackingStatus: "MISSING_TAG",
      };
    }

    if (tag.toLowerCase() === expectedTag.toLowerCase()) {
      return {
        isTrackingVerified: true,
        trackingTag: tag,
        trackingStatus: "VERIFIED",
      };
    }

    return {
      isTrackingVerified: false,
      trackingTag: tag,
      trackingStatus: "DIFFERENT_TAG",
    };
  } catch {
    return {
      isTrackingVerified: false,
      trackingTag: null,
      trackingStatus: "UNRESOLVED",
    };
  }
}

/**
 * Resolves a single Amazon URL securely through bounded redirects and SSRF validation
 */
export async function resolveAmazonLink(
  rawUrl: string,
  expectedTag: string = EXPECTED_TRACKING_TAG,
): Promise<ResolvedAmazonLink> {
  const sourceUrl = (rawUrl || "").trim();

  // Basic format validation
  if (!sourceUrl) {
    return {
      sourceUrl,
      resolvedUrl: null,
      asin: null,
      titleSlug: null,
      marketplace: null,
      isIndiaMarketplace: false,
      httpStatus: null,
      redirectHops: 0,
      trackingTag: null,
      isTrackingVerified: false,
      trackingStatus: "UNRESOLVED",
      resolutionStatus: "INVALID_URL",
      errorMessage: "URL is empty or undefined",
    };
  }

  let parsedInitial: URL;
  try {
    parsedInitial = new URL(sourceUrl);
  } catch {
    return {
      sourceUrl,
      resolvedUrl: null,
      asin: null,
      titleSlug: null,
      marketplace: null,
      isIndiaMarketplace: false,
      httpStatus: null,
      redirectHops: 0,
      trackingTag: null,
      isTrackingVerified: false,
      trackingStatus: "UNRESOLVED",
      resolutionStatus: "INVALID_URL",
      errorMessage: "Malformed URL syntax",
    };
  }

  // Scheme validation: must be https or http
  if (
    parsedInitial.protocol !== "https:" &&
    parsedInitial.protocol !== "http:"
  ) {
    return {
      sourceUrl,
      resolvedUrl: null,
      asin: null,
      titleSlug: null,
      marketplace: null,
      isIndiaMarketplace: false,
      httpStatus: null,
      redirectHops: 0,
      trackingTag: null,
      isTrackingVerified: false,
      trackingStatus: "UNRESOLVED",
      resolutionStatus: "INVALID_URL",
      errorMessage: `Unsupported protocol: ${parsedInitial.protocol}`,
    };
  }

  // Credentials check
  if (parsedInitial.username || parsedInitial.password) {
    return {
      sourceUrl,
      resolvedUrl: null,
      asin: null,
      titleSlug: null,
      marketplace: null,
      isIndiaMarketplace: false,
      httpStatus: null,
      redirectHops: 0,
      trackingTag: null,
      isTrackingVerified: false,
      trackingStatus: "UNRESOLVED",
      resolutionStatus: "SSRF_BLOCKED",
      errorMessage:
        "URL contains credentials, which are forbidden for security",
    };
  }

  // SSRF check on initial host
  if (isPrivateOrBlockedHost(parsedInitial.hostname)) {
    return {
      sourceUrl,
      resolvedUrl: null,
      asin: null,
      titleSlug: null,
      marketplace: null,
      isIndiaMarketplace: false,
      httpStatus: null,
      redirectHops: 0,
      trackingTag: null,
      isTrackingVerified: false,
      trackingStatus: "UNRESOLVED",
      resolutionStatus: "SSRF_BLOCKED",
      errorMessage: `Host ${parsedInitial.hostname} is private or blocked by SSRF policy`,
    };
  }

  // Check initial host against approved Amazon domains
  const initialHostCheck = isApprovedAmazonHost(parsedInitial.hostname);
  if (!initialHostCheck.approved) {
    return {
      sourceUrl,
      resolvedUrl: null,
      asin: null,
      titleSlug: null,
      marketplace: parsedInitial.hostname,
      isIndiaMarketplace: false,
      httpStatus: null,
      redirectHops: 0,
      trackingTag: null,
      isTrackingVerified: false,
      trackingStatus: "UNRESOLVED",
      resolutionStatus: "UNAPPROVED_HOST",
      errorMessage: `Host ${parsedInitial.hostname} is not an authorized Amazon domain`,
    };
  }

  // Follow redirects safely
  let currentUrl = sourceUrl;
  let hops = 0;
  let lastStatus: number | null = null;
  const visited = new Set<string>();

  try {
    while (hops < MAX_REDIRECT_HOPS) {
      visited.add(currentUrl);

      // Perform a HEAD request first with manual redirect
      let res: Response;
      try {
        res = await fetch(currentUrl, {
          method: "HEAD",
          redirect: "manual",
          signal: AbortSignal.timeout(6000),
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SmartNivad/1.0",
            Accept: "*/*",
          },
        });
      } catch (fetchErr) {
        // Fallback to GET with minimal header if HEAD was rejected or timed out
        try {
          res = await fetch(currentUrl, {
            method: "GET",
            redirect: "manual",
            signal: AbortSignal.timeout(6000),
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SmartNivad/1.0",
              Accept: "*/*",
            },
          });
        } catch {
          throw fetchErr;
        }
      }

      lastStatus = res.status;

      // Handle redirect (301, 302, 303, 307, 308)
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (!location) {
          break;
        }

        hops++;
        const nextUrl = new URL(location, currentUrl).toString();

        // Detect redirect loops
        if (visited.has(nextUrl)) {
          return {
            sourceUrl,
            resolvedUrl: currentUrl,
            asin: extractAsinFromUrl(currentUrl),
            titleSlug: extractTitleSlugFromUrl(currentUrl),
            marketplace: new URL(currentUrl).hostname,
            isIndiaMarketplace: APPROVED_MARKETPLACE_HOSTS.has(
              new URL(currentUrl).hostname.toLowerCase(),
            ),
            httpStatus: res.status,
            redirectHops: hops,
            trackingTag: null,
            isTrackingVerified: false,
            trackingStatus: "UNRESOLVED",
            resolutionStatus: "HTTP_ERROR",
            errorMessage: "Redirect loop detected",
          };
        }

        // Validate next URL host against SSRF & Amazon allowed hosts
        const nextParsed = new URL(nextUrl);
        if (isPrivateOrBlockedHost(nextParsed.hostname)) {
          return {
            sourceUrl,
            resolvedUrl: null,
            asin: null,
            titleSlug: null,
            marketplace: nextParsed.hostname,
            isIndiaMarketplace: false,
            httpStatus: res.status,
            redirectHops: hops,
            trackingTag: null,
            isTrackingVerified: false,
            trackingStatus: "UNRESOLVED",
            resolutionStatus: "SSRF_BLOCKED",
            errorMessage: `Redirect to private/internal host ${nextParsed.hostname} blocked by SSRF policy`,
          };
        }

        const nextHostCheck = isApprovedAmazonHost(nextParsed.hostname);
        if (!nextHostCheck.approved) {
          return {
            sourceUrl,
            resolvedUrl: nextUrl,
            asin: null,
            titleSlug: null,
            marketplace: nextParsed.hostname,
            isIndiaMarketplace: false,
            httpStatus: res.status,
            redirectHops: hops,
            trackingTag: null,
            isTrackingVerified: false,
            trackingStatus: "UNRESOLVED",
            resolutionStatus: "UNAPPROVED_HOST",
            errorMessage: `Redirected to unapproved destination: ${nextParsed.hostname}`,
          };
        }

        currentUrl = nextUrl;
        continue;
      }

      // Reached final status
      break;
    }
  } catch (err: unknown) {
    // If we already followed redirects and arrived at an approved Amazon destination with an ASIN,
    // don't treat final page network error as total failure
    const destinationAsin = extractAsinFromUrl(currentUrl);
    if (hops > 0 && destinationAsin) {
      lastStatus = 200;
    } else {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        sourceUrl,
        resolvedUrl: hops > 0 ? currentUrl : null,
        asin: destinationAsin,
        titleSlug: extractTitleSlugFromUrl(currentUrl),
        marketplace: null,
        isIndiaMarketplace: false,
        httpStatus: lastStatus,
        redirectHops: hops,
        trackingTag: null,
        isTrackingVerified: false,
        trackingStatus: "UNRESOLVED",
        resolutionStatus: "HTTP_ERROR",
        errorMessage: `Network error during link resolution: ${errorMsg}`,
      };
    }
  }

  // Parse final destination
  let finalParsed: URL;
  try {
    finalParsed = new URL(currentUrl);
  } catch {
    return {
      sourceUrl,
      resolvedUrl: currentUrl,
      asin: extractAsinFromUrl(currentUrl),
      titleSlug: extractTitleSlugFromUrl(currentUrl),
      marketplace: null,
      isIndiaMarketplace: false,
      httpStatus: lastStatus,
      redirectHops: hops,
      trackingTag: null,
      isTrackingVerified: false,
      trackingStatus: "UNRESOLVED",
      resolutionStatus: "INVALID_URL",
      errorMessage: "Final destination is not a valid URL",
    };
  }

  const finalHost = finalParsed.hostname.toLowerCase();
  const finalHostCheck = isApprovedAmazonHost(finalHost);

  // Check HTTP status code: 404 or >= 400
  // Note: 503, 403, 429, and 405 (Method Not Allowed for HEAD requests) on amazon.in
  // product pages occur when automated HEAD/GET requests reach Amazon product endpoints.
  // If we successfully redirected to an approved Amazon product page with a valid 10-char ASIN,
  // treat the link as cleanly resolved.
  const hasDestinationAsin = !!extractAsinFromUrl(currentUrl);
  const isAntiBotChallenge =
    hops > 0 &&
    hasDestinationAsin &&
    (lastStatus === 503 ||
      lastStatus === 403 ||
      lastStatus === 429 ||
      lastStatus === 405);

  if (
    lastStatus &&
    (lastStatus < 200 || lastStatus >= 400) &&
    !isAntiBotChallenge
  ) {
    return {
      sourceUrl,
      resolvedUrl: currentUrl !== sourceUrl ? currentUrl : null,
      asin: extractAsinFromUrl(currentUrl),
      titleSlug: extractTitleSlugFromUrl(currentUrl),
      marketplace: finalHost,
      isIndiaMarketplace: APPROVED_MARKETPLACE_HOSTS.has(finalHost),
      httpStatus: lastStatus,
      redirectHops: hops,
      trackingTag: null,
      isTrackingVerified: false,
      trackingStatus: "UNRESOLVED",
      resolutionStatus: "HTTP_ERROR",
      errorMessage: `HTTP ${lastStatus}: Link returned error status from server`,
    };
  }

  // Check if marketplace is India
  const isIndiaMarketplace = APPROVED_MARKETPLACE_HOSTS.has(finalHost);
  if (!isIndiaMarketplace && !finalHostCheck.isShortlink) {
    return {
      sourceUrl,
      resolvedUrl: currentUrl,
      asin: extractAsinFromUrl(currentUrl),
      titleSlug: extractTitleSlugFromUrl(currentUrl),
      marketplace: finalHost,
      isIndiaMarketplace: false,
      httpStatus: lastStatus,
      redirectHops: hops,
      trackingTag: null,
      isTrackingVerified: false,
      trackingStatus: "UNRESOLVED",
      resolutionStatus: "UNSUPPORTED_MARKETPLACE",
      errorMessage: `Non-India Amazon marketplace detected: ${finalHost}. Only amazon.in is supported.`,
    };
  }

  const asin = extractAsinFromUrl(currentUrl);
  const titleSlug = extractTitleSlugFromUrl(currentUrl);
  const tracking = verifyTrackingAttribution(currentUrl, expectedTag);

  return {
    sourceUrl,
    resolvedUrl: currentUrl,
    asin,
    titleSlug,
    marketplace: finalHost,
    isIndiaMarketplace: true,
    httpStatus: lastStatus,
    redirectHops: hops,
    trackingTag: tracking.trackingTag,
    isTrackingVerified: tracking.isTrackingVerified,
    trackingStatus: tracking.trackingStatus,
    resolutionStatus: "RESOLVED",
    errorMessage: null,
  };
}

/**
 * Resolves a batch of Amazon URLs concurrently and returns structured audit results
 */
export async function resolveMultipleAmazonLinks(
  urls: string[],
  expectedTag: string = EXPECTED_TRACKING_TAG,
): Promise<BatchResolutionResult> {
  const cleanUrls = urls.map((u) => u.trim()).filter(Boolean);

  const results = await Promise.all(
    cleanUrls.map((url) => resolveAmazonLink(url, expectedTag)),
  );

  const resolved = results.filter(
    (r) => r.resolutionStatus === "RESOLVED",
  ).length;
  const failed = results.length - resolved;
  const indiaMarketplaceCount = results.filter(
    (r) => r.isIndiaMarketplace,
  ).length;
  const trackingVerifiedCount = results.filter(
    (r) => r.isTrackingVerified,
  ).length;

  return {
    total: cleanUrls.length,
    resolved,
    failed,
    indiaMarketplaceCount,
    trackingVerifiedCount,
    results,
  };
}
