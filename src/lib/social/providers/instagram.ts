import { Deal, SocialPostQueue } from "@prisma/client";
import { generateInstagramCaption } from "../captions";
import { SocialProvider, ProviderResult } from "./interface";
import { processAndUploadImage } from "../image";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class InstagramProvider implements SocialProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async publish(deal: Deal, _job: SocialPostQueue): Promise<ProviderResult> {
    const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://smartnivad.com";
    const debug = process.env.INSTAGRAM_DEBUG === "true";

    if (!accountId || !accessToken) {
      return { success: false, error: "Missing Instagram credentials" };
    }

    try {
      // 1. Process and upload image (Validation & Optimization)
      let imageUrl = deal.imageUrl;
      if (!imageUrl.startsWith("http")) {
        imageUrl = `${siteUrl}${imageUrl}`;
      }
      const optimizedImageUrl = await processAndUploadImage(imageUrl);

      const caption = generateInstagramCaption(deal, siteUrl);

      // 2. Create Media Container
      const containerUrl = `https://graph.facebook.com/v20.0/${accountId}/media`;
      const containerResponse = await this.fetchWithRateLimitRetry(
        containerUrl,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url: optimizedImageUrl,
            caption: caption,
            access_token: accessToken,
          }),
        },
      );

      const containerData = await containerResponse.json();
      if (debug) console.log("[Instagram] Create Container:", containerData);

      if (!containerResponse.ok || containerData.error) {
        return {
          success: false,
          error: `Failed to create container: ${containerData.error?.message || JSON.stringify(containerData)}`,
          data: containerData,
        };
      }

      const containerId = containerData.id;

      // 3. Poll Container Status (10 retries, backoff: 1s, 2s, 3s...)
      let status = "IN_PROGRESS";
      for (let attempt = 1; attempt <= 10; attempt++) {
        const statusUrl = `https://graph.facebook.com/v20.0/${containerId}?fields=status_code,status_code_reason&access_token=${accessToken}`;
        const statusRes = await this.fetchWithRateLimitRetry(statusUrl, {
          method: "GET",
        });
        const statusData = await statusRes.json();

        if (debug)
          console.log(`[Instagram] Poll Attempt ${attempt}:`, statusData);

        if (statusData.status_code === "FINISHED") {
          status = "FINISHED";
          break;
        } else if (statusData.status_code === "ERROR") {
          return {
            success: false,
            error: `Container error: ${statusData.status_code_reason}. Container ID: ${containerId}`,
            data: { containerId, ...statusData },
          };
        } else if (statusData.status_code === "EXPIRED") {
          return {
            success: false,
            error: `Container expired. Container ID: ${containerId}`,
            data: { containerId, ...statusData },
          };
        }

        // Wait with increasing backoff (1s, 2s, 3s...)
        await sleep(attempt * 1000);
      }

      if (status !== "FINISHED") {
        return {
          success: false,
          error: `Container processing timed out. Container ID: ${containerId}`,
          data: { containerId },
        };
      }

      // 4. Publish Media Container
      const publishUrl = `https://graph.facebook.com/v20.0/${accountId}/media_publish`;
      const publishResponse = await this.fetchWithRateLimitRetry(publishUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: containerId,
          access_token: accessToken,
        }),
      });

      const publishData = await publishResponse.json();
      if (debug) console.log("[Instagram] Publish:", publishData);

      if (!publishResponse.ok || publishData.error) {
        return {
          success: false,
          error: `Failed to publish: ${publishData.error?.message || JSON.stringify(publishData)}. Container ID: ${containerId}`,
          data: { containerId, ...publishData },
        };
      }

      return { success: true, data: publishData };
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown error during Instagram publish";
      return { success: false, error: message };
    }
  }

  private async fetchWithRateLimitRetry(
    url: string,
    options: RequestInit,
  ): Promise<Response> {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      const response = await fetch(url, options);
      if (response.status === 429) {
        attempt++;
        const retryAfter = response.headers.get("Retry-After");
        // Use Retry-After if available, else backoff (2s, 4s, 8s)
        const delay = retryAfter
          ? parseInt(retryAfter) * 1000
          : Math.pow(2, attempt) * 1000;
        console.warn(
          `[Instagram] Rate limited (HTTP 429). Waiting ${delay}ms before retry ${attempt}/${maxRetries}...`,
        );
        await sleep(delay);
        continue;
      }
      return response;
    }

    return fetch(url, options); // Final attempt
  }
}
