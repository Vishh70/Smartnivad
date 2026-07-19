/* eslint-disable react-hooks/rules-of-hooks */
import { test as baseTest } from "@playwright/test";

// A tiny 1x1 transparent PNG to act as a placeholder for external images
const TRANSPARENT_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

export const test = baseTest.extend({
  page: async ({ page }, use) => {
    // Intercept external image requests (Unsplash, Cloudinary, Amazon, Flipkart, Placehold.co)
    await page.route(
      (url) => {
        const h = url.hostname;
        // Use exact match or endsWith(".domain") to prevent substring spoofing
        const matchesDomain = (hostname: string, domain: string) =>
          hostname === domain || hostname.endsWith(`.${domain}`);
        return (
          matchesDomain(h, "unsplash.com") ||
          matchesDomain(h, "cloudinary.com") ||
          matchesDomain(h, "m.media-amazon.com") ||
          matchesDomain(h, "rukminim2.flixcart.com") ||
          matchesDomain(h, "placehold.co")
        );
      },
      async (route, request) => {
        if (request.resourceType() === "image") {
          await route.fulfill({
            status: 200,
            contentType: "image/png",
            body: TRANSPARENT_PNG,
          });
        } else {
          await route.continue();
        }
      },
    );

    // Continue with the modified page
    await use(page);
  },
});

export { expect } from "@playwright/test";
