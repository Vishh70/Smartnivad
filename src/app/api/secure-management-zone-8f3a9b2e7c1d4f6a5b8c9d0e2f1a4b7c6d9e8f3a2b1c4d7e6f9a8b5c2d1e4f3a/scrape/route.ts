import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const parsedUrl = new URL(targetUrl);

    // SSRF Protection: Restrict protocols
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return NextResponse.json({ error: "Invalid protocol" }, { status: 400 });
    }

    // SSRF Protection: Prevent requests to local or internal IPs/hostnames
    const hostname = parsedUrl.hostname;
    const isInternal =
      /^(localhost|127\.0\.0\.1|::1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)$/i.test(
        hostname,
      ) || hostname.endsWith(".local");

    if (isInternal) {
      return NextResponse.json(
        { error: "Internal hostnames are not allowed" },
        { status: 403 },
      );
    }

    // Basic user-agent to avoid being blocked immediately by standard anti-bot protection
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

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
    console.error("Scraping error:", error);
    return NextResponse.json(
      { error: "Internal server error while scraping" },
      { status: 500 },
    );
  }
}
