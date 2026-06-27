import { test, expect } from "@playwright/test";

test.describe("Synthetic Production Smoke Test", () => {
  test("Core user journey is functional", async ({ page }) => {
    // 1. Open Homepage
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    // 2. Verify Hero renders
    await expect(page.locator("h1").first()).toBeVisible();

    // 3. Navigate to Deals page directly
    //    (The "All Deals" link lives inside a hover-dropdown behind the hero section,
    //     which causes pointer-event interception failures in headless browsers.)
    await page.goto("/deals");
    await expect(page).toHaveURL(/.*\/deals/);

    // 4. Verify product cards render
    await expect(page.locator(".product-card").first()).toBeVisible({
      timeout: 15000,
    });
  });
});
