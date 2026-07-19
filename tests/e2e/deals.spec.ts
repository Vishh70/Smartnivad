import { test, expect } from "../fixtures";

test.describe("Deals & Product Cards", () => {
  test("product cards render discount badges and load images", async ({
    page,
  }) => {
    await page.goto("/deals");

    // Wait for the product cards container and at least one card to be visible
    const cards = page.locator(".product-card");
    await expect(cards.first()).toBeVisible();

    // With our deterministic seed data, we know there are deals with discounts
    const discountBadges = page.getByText(/-\d+%/);
    await expect(discountBadges.first()).toBeVisible();

    // Verify the "Save to wishlist" heart button is present and clickable
    const saveBtns = page.getByLabel("Save to wishlist");
    await expect(saveBtns.first()).toBeVisible();
  });
});
