import { test, expect } from "@playwright/test";

test.describe("Navigation & Core Flows", () => {
  test("homepage has correct title and hero elements", async ({ page }) => {
    await page.goto("/");

    // Check title
    await expect(page).toHaveTitle(/SmartNivad/);

    // Check Hero text
    const heading = page.locator("h1");
    await expect(heading).toContainText("Find the Best Deals. Save More.");

    // Check CTA buttons
    const exploreBtn = page.getByRole("button", { name: /Explore Deals/i });
    const compareBtn = page.getByRole("button", { name: /Compare Products/i });
    await expect(exploreBtn).toBeVisible();
    await expect(compareBtn).toBeVisible();
  });

  test("mobile hamburger menu opens correctly", async ({ page, isMobile }) => {
    if (!isMobile) return; // Skip if desktop

    await page.goto("/");

    // Click the hamburger menu
    const menuBtn = page.getByLabel("Toggle menu");
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    // Verify mobile menu overlay appears
    const loginBtn = page.getByRole("button", { name: /Log In \/ Sign Up/i });
    await expect(loginBtn).toBeVisible();
  });
});
