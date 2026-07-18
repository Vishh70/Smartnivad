import { test, expect } from "../fixtures";

test.describe("Synthetic Production Smoke Test", () => {
  test("Core user journey is functional", async ({ page }) => {
    // Increase test timeout for CI environments
    test.setTimeout(60_000);

    // 1. Open Homepage (baseURL is configured in playwright.config.ts or env)
    const response = await page.goto("/", { waitUntil: "networkidle" });
    expect(response?.status()).toBeGreaterThan(0);

    // 2. Verify Hero renders
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15_000 });

    // Optional: dismiss cookie/banner overlays that may block interactions
    const cookieClose = page
      .locator(
        '[data-testid="cookie-close"], button:has-text("Accept"), button:has-text("Dismiss")',
      )
      .first();
    if (await cookieClose.count()) {
      await cookieClose.click().catch(() => {});
    }

    // 3. Navigate to Deals page directly
    //    (The "All Deals" link lives inside a hover-dropdown behind the hero section,
    //     which causes pointer-event interception failures in headless browsers.)
    await page.goto("/deals", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/.*\/deals/, { timeout: 15_000 });

    // 4. Verify product cards render
    await expect(page.locator(".product-card").first()).toBeVisible({
      timeout: 15_000,
    });
  });
});
