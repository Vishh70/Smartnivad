import { Deal } from "@prisma/client";
import { generateTelegramCaption } from "../captions";

export async function publishToTelegram(
  deal: Deal,
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartnivad.com";

  if (!token || !channelId) {
    return { success: false, error: "Missing Telegram credentials" };
  }

  const caption = generateTelegramCaption(deal, siteUrl);

  try {
    const url = `https://api.telegram.org/bot${token}/sendPhoto`;

    // Determine the photo to send. If the image is a data URI or a local path that Telegram can't read,
    // it won't work. We assume imageUrl is a public HTTP url for deals.
    const photoUrl = deal.imageUrl.startsWith("http")
      ? deal.imageUrl
      : `${siteUrl}${deal.imageUrl}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: channelId,
        photo: photoUrl,
        caption: caption,
        parse_mode: "Markdown",
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      return {
        success: false,
        error: data.description || "Telegram API error",
        data,
      };
    }

    return { success: true, data };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to connect to Telegram";
    return { success: false, error: message };
  }
}
