import { test, expect } from "@playwright/test";

test.describe("Synthetic Production Smoke Test", () => {
  test("Core user journey is functional", async ({ page }) => {
    // 1. Open Homepage
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    // 2. Verify Hero renders
    await expect(page.locator("h1").first()).toBeVisible();

    // 3. Navigate to Deals
    await page.getByRole("link", { name: /deals/i }).first().click();
    await expect(page).toHaveURL(/.*\/deals/);

    // 4. Verify product cards render
    await expect(page.locator(".product-card").first()).toBeVisible({
      timeout: 10000,
    });
  });
});
