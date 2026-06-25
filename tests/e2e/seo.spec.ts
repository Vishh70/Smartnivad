import { expect, test } from "@playwright/test";

test.describe("SEO metadata", () => {
  test("homepage exposes crawlable metadata", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/SmartNivad/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /tech deals/i,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /SmartNivad/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      /summary/i,
    );
  });

  test("robots and sitemap are available", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBe(true);
    await expect(robots.text()).resolves.toContain("Sitemap:");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    await expect(sitemap.text()).resolves.toContain("<urlset");
  });
});
