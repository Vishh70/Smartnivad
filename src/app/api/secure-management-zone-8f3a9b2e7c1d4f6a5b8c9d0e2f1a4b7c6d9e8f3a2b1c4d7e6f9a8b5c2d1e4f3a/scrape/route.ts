import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

/**
 * Allowlist of domains that the scraper is permitted to fetch.
 * Only exact matches or subdomains are accepted.
 */
const ALLOWED_DOMAINS = [
  "amazon.in",
  "amazon.com",
  "flipkart.com",
  "myntra.com",
  "ajio.com",
  "meesho.com",
  "snapdeal.com",
  "jiomart.com",
  "tatacliq.com",
  "croma.com",
  "reliancedigital.in",
  "nykaa.com",
];

function isAllowedDomain(hostname: string): boolean {
  return ALLOWED_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const parsedUrl = new URL(targetUrl);

    // SSRF Protection: Restrict protocols to http/https only
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return NextResponse.json({ error: "Invalid protocol" }, { status: 400 });
    }

    // SSRF Protection: Only allow known e-commerce domains (allowlist > blocklist)
    if (!isAllowedDomain(parsedUrl.hostname)) {
      return NextResponse.json(
        { error: "Domain not in allowlist" },
        { status: 403 },
      );
    }

    // Prevent credentials in URL
    if (parsedUrl.username || parsedUrl.password) {
      return NextResponse.json(
        { error: "Credentials in URL not allowed" },
        { status: 400 },
      );
    }

    // Fetch with timeout to avoid hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: controller.signal,
      redirect: "error", // Prevent redirect-based SSRF
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch the target URL" },
        { status: response.status },
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract Open Graph Data
    let title =
      $('meta[property="og:title"]').attr("content") || $("title").text();
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";
    const image = $('meta[property="og:image"]').attr("content") || "";

    // Clean up title (sometimes it has " | Amazon.in" etc.)
    if (title) {
      title = title.split(" | ")[0].trim();
      title = title.split(" - ")[0].trim();
    }

    // Try to find a price if possible (Very basic heuristic, highly dependent on the site)
    let price = "";
    const priceMatch = html.match(/₹[\d,]+/);
    if (priceMatch) {
      price = priceMatch[0].replace(/[^\d]/g, "");
    }

    return NextResponse.json({
      title,
      description,
      image,
      price: price ? parseInt(price, 10) : null,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return NextResponse.json({ error: "Request timed out" }, { status: 504 });
    }
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Internal server error while scraping" },
      { status: 500 },
    );
  }
}
