import * as cheerio from "cheerio";
import { fetchWithRetry } from "./retry";
import { parsePrice } from "./parser";

export async function scrapeFlipkartPrice(url: string): Promise<number | null> {
  try {
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);

    // Flipkart uses specific classes for current price
    const selectors = [
      ".Nx9bqj.CxhGGd",
      "div._30jeq3._16Jk6d",
      "._30jeq3" // older fallback
    ];

    for (const selector of selectors) {
      const el = $(selector).first();
      const text = el.text().trim();
      if (text) {
        const price = parsePrice(text);
        if (price) return price;
      }
    }

    return null;
  } catch (error) {
    console.error(`Flipkart Scraper Error for ${url}:`, error);
    return null;
  }
}
