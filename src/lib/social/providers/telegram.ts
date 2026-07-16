import { Deal, SocialPostQueue } from "@prisma/client";
import { generateTelegramCaption } from "../captions";
import { SocialProvider, ProviderResult } from "./interface";

export class TelegramProvider implements SocialProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async publish(deal: Deal, _job: SocialPostQueue): Promise<ProviderResult> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://smartnivad.com";

    if (!token || !channelId) {
      return { success: false, error: "Missing Telegram credentials" };
    }

    const caption = generateTelegramCaption(deal, siteUrl);
    const photoUrl = deal.imageUrl.startsWith("http")
      ? deal.imageUrl
      : `${siteUrl}${deal.imageUrl}`;

    try {
      // 1. Try sending as Photo
      const photoResult = await this.sendPhoto(
        token,
        channelId,
        photoUrl,
        caption,
      );

      if (photoResult.ok) {
        return { success: true, data: photoResult };
      }

      // If it fails (e.g., image too large, invalid URL), fallback to Text Message
      console.warn(
        `[Telegram] Photo upload failed, falling back to text. Error: ${photoResult.description}`,
      );
      const textResult = await this.sendMessage(token, channelId, caption);

      if (textResult.ok) {
        return { success: true, data: textResult };
      }

      return {
        success: false,
        error: textResult.description || "Telegram API error (Text Fallback)",
        data: textResult,
      };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to connect to Telegram";
      return { success: false, error: message };
    }
  }

  private async sendPhoto(
    token: string,
    channelId: string,
    photoUrl: string,
    caption: string,
  ) {
    const url = `https://api.telegram.org/bot${token}/sendPhoto`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: channelId,
        photo: photoUrl,
        caption: caption,
        parse_mode: "Markdown",
      }),
    });
    return response.json();
  }

  private async sendMessage(token: string, channelId: string, text: string) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: channelId,
        text: text,
        parse_mode: "Markdown",
        link_preview_options: {
          is_disabled: false, // Let Telegram try to fetch the image from the URL in the caption
        },
      }),
    });
    return response.json();
  }
}
