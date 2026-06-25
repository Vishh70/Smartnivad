import * as cheerio from "cheerio";
import { fetchWithRetry } from "./retry";
import { parsePrice } from "./parser";

export async function scrapeAmazonPrice(url: string): Promise<number | null> {
  try {
    const html = await fetchWithRetry(url);
    const $ = cheerio.load(html);

    // Amazon uses different selectors for price, try them in order
    const selectors = [
      ".a-price.a-text-price.a-size-medium.apexPriceToPay .a-offscreen",
      ".a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay .a-offscreen",
      "#corePriceDisplay_desktop_feature_div .a-price.a-text-price .a-offscreen",
      "#corePrice_desktop .a-price .a-offscreen",
      "#priceblock_ourprice",
      "#priceblock_dealprice",
      ".a-price .a-offscreen" // generic fallback
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
    console.error(`Amazon Scraper Error for ${url}:`, error);
    return null;
  }
}
