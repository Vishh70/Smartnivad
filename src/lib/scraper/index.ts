import { scrapeAmazonPrice } from "./amazon";
import { scrapeFlipkartPrice } from "./flipkart";

export async function scrapePrice(url: string, storeName: string): Promise<number | null> {
  const store = storeName.toLowerCase();
  
  if (store.includes("amazon")) {
    return await scrapeAmazonPrice(url);
  } else if (store.includes("flipkart")) {
    return await scrapeFlipkartPrice(url);
  }
  
  // Future fallback or default parser can go here
  return null;
}
