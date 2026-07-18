/* eslint-disable react-hooks/rules-of-hooks */
import { test as baseTest } from "@playwright/test";

// A tiny 1x1 transparent PNG to act as a placeholder for external images
const TRANSPARENT_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64"
);

export const test = baseTest.extend({
  page: async ({ page }, use) => {
    // Intercept external image requests (Unsplash, Cloudinary, Amazon, Flipkart, Placehold.co)
    await page.route(
      (url) =>
        url.hostname.includes("unsplash.com") ||
        url.hostname.includes("cloudinary.com") ||
        url.hostname.includes("m.media-amazon.com") ||
        url.hostname.includes("rukminim2.flixcart.com") ||
        url.hostname.includes("placehold.co"),
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
      }
    );

    // Continue with the modified page
    await use(page);
  },
});

export { expect } from "@playwright/test";
