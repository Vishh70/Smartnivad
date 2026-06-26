import { Deal } from "@prisma/client";
import { formatNumber } from "@/lib/format";

export function generateTelegramCaption(deal: Deal, siteUrl: string): string {
  const url = `${siteUrl}/product/${deal.slug}`;
  const isHot = deal.dealType === "HOT";

  let caption = isHot
    ? `🚨 **HOT DEAL ALERT!** 🚨\n\n`
    : `🔥 **New Deal!** 🔥\n\n`;
  caption += `**${deal.title}**\n\n`;

  caption += `💸 **Price**: ₹${formatNumber(deal.currentPrice)}\n`;
  if (deal.discount > 0) {
    caption += `🏷️ **Save**: ${deal.discount}% OFF (Was ₹${formatNumber(deal.originalPrice)})\n`;
  }

  if (deal.rating > 0) {
    caption += `⭐ **Rating**: ${deal.rating}/5\n`;
  }

  caption += `\n👉 **View Deal on SmartNivad**: ${url}\n\n`;

  const hashtags = [
    "#SmartNivad",
    "#TechDeals",
    ...deal.tags.map((t) => `#${t.replace(/\s+/g, "")}`),
  ];
  caption += hashtags.slice(0, 5).join(" ");

  return caption;
}
