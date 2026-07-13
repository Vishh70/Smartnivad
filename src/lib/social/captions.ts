import { Deal } from "@prisma/client";
import { formatNumber } from "@/lib/format";

/**
 * Shared data structure for caption generation.
 * Any template can use these fields.
 */
interface CaptionData {
  title: string;
  price: string;
  originalPrice: string;
  discount: number;
  rating: number;
  url: string;
  isHot: boolean;
  hashtags: string;
}

function buildCaptionData(deal: Deal, siteUrl: string): CaptionData {
  const url = `${siteUrl}/product/${deal.slug}`;
  const tagList = [
    "#SmartNivad",
    ...deal.tags.map((t) => `#${t.replace(/\s+/g, "")}`),
  ];

  return {
    title: deal.title,
    price: `₹${formatNumber(deal.currentPrice)}`,
    originalPrice: `₹${formatNumber(deal.originalPrice)}`,
    discount: deal.discount,
    rating: deal.rating,
    url,
    isHot: deal.dealType === "HOT",
    hashtags: tagList.slice(0, 6).join(" "),
  };
}

// ─── Telegram Caption ─────────────────────────────────────────────────────────

export function generateTelegramCaption(deal: Deal, siteUrl: string): string {
  const d = buildCaptionData(deal, siteUrl);

  const header = d.isHot ? `🚨 *HOT DEAL ALERT!* 🚨` : `🔥 *Deal Alert!* 🔥`;

  const savings =
    d.discount > 0
      ? `🏷️ *Save*: ${d.discount}% OFF (Was ${d.originalPrice})`
      : "";

  const ratingLine = d.rating > 0 ? `⭐ *Rating*: ${d.rating}/5` : "";

  const lines = [
    header,
    "",
    `*${d.title}*`,
    "",
    `💰 *Price*: ${d.price}`,
    savings,
    ratingLine,
    "",
    `🚀 *Limited Time Offer*`,
    `👉 View on SmartNivad: ${d.url}`,
    "",
    d.hashtags,
  ].filter(Boolean);

  return lines.join("\n");
}

// ─── Instagram Caption (Phase 2) ──────────────────────────────────────────────

export function generateInstagramCaption(deal: Deal, siteUrl: string): string {
  const d = buildCaptionData(deal, siteUrl);

  const savingsAmt = deal.originalPrice - deal.currentPrice;
  const formattedSavings = savingsAmt > 0 ? `₹${formatNumber(savingsAmt)}` : "";

  const lines = [
    d.isHot ? `🚨 HOT DEAL ALERT! 🚨` : `🔥 Deal Alert!`,
    "",
    d.title,
    "",
    `💰 ${d.price}`,
    formattedSavings ? `🏷️ Save ${formattedSavings}` : "",
    d.rating > 0 ? `⭐ ${d.rating} Rating` : "",
    "",
    `🚀 Limited Time`,
    "",
    `👉 ${d.url}`,
    "",
    `#SmartNivad`,
    `#AmazonDeals`,
    `#FlipkartDeals`,
    `#SmartNivad`,
    ...deal.tags.map((t) => `#${t.replace(/\s+/g, "")}`),
  ].filter(Boolean);

  return lines.join("\n");
}

// ─── Discord Caption (Phase 3) ────────────────────────────────────────────────

export function generateDiscordCaption(deal: Deal, siteUrl: string): string {
  const d = buildCaptionData(deal, siteUrl);

  const lines = [
    d.isHot ? `🚨 **HOT DEAL ALERT!**` : `🔥 **New Deal!**`,
    "",
    `**${d.title}**`,
    "",
    `> 💰 Price: ${d.price}`,
    d.discount > 0 ? `> 🏷️ Save: ${d.discount}% OFF` : "",
    d.rating > 0 ? `> ⭐ Rating: ${d.rating}/5` : "",
    "",
    `👉 ${d.url}`,
  ].filter(Boolean);

  return lines.join("\n");
}
