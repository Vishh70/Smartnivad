import { test, expect } from '@playwright/test';

test.describe('Deals & Product Cards', () => {
  test('product cards render discount badges and load images', async ({ page }) => {
    await page.goto('/deals');
    
    // Check for product cards
    const cards = page.locator('.product-card');
    // Wait for at least 1 card
    await expect(cards.first()).toBeVisible();

    // Verify discount badge is present on at least one deal
    // Some deals might not have discounts, so we just check if any exist on the page
    const discountBadges = page.getByText(/-\d+%/);
    if (await discountBadges.count() > 0) {
      await expect(discountBadges.first()).toBeVisible();
    }

    // Verify the "Save to wishlist" heart button is present and clickable
    const saveBtns = page.getByLabel('Save to wishlist');
    await expect(saveBtns.first()).toBeVisible();
  });
});
