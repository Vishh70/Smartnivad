import { test, expect } from "../fixtures";

test.describe("SmartNivad Regression Suite", () => {
  test("Search functionality", async ({ page }) => {
    await page.goto("/");
    
    // Attempt to open global search
    const searchTrigger = page.getByTestId("search-trigger");
    await searchTrigger.click();
    
    const searchInput = page.getByTestId("search-input");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("laptop");
    
    // Depending on the UI, it either shows a modal or navigates
    // We just verify it doesn't crash and shows results or a loading state
    const searchResults = page.getByTestId("search-results");
    await expect(searchResults).toBeVisible();
  });

  test("Wishlist functionality", async ({ page }) => {
    await page.goto("/deals");
    
    // Save a deal to wishlist
    const saveBtn = page.getByLabel("Save to wishlist").first();
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();
    
    // Navigate to wishlist
    await page.goto("/wishlist");
    
    // Verify persistence
    const wishlistItems = page.locator(".product-card");
    await expect(wishlistItems.first()).toBeVisible();
  });

  test("Product page rendering", async ({ page }) => {
    await page.goto("/deals");
    const firstProductLink = page.locator(".product-card a").first();
    await expect(firstProductLink).toBeVisible();
    const productUrl = await firstProductLink.getAttribute("href");
    
    if (productUrl) {
      await page.goto(productUrl);
      // Verify title
      await expect(page.locator("h1").first()).toBeVisible();
      // Verify image
      await expect(page.locator("img").first()).toBeVisible();
      // Verify affiliate button
      await expect(page.getByRole("link", { name: /view deal|buy/i }).first()).toBeVisible();
    }
  });

  test("Authentication routing", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1").filter({ hasText: /login|sign in/i }).first()).toBeVisible();
    
    // Protected routes redirect correctly
    await page.goto("/dashboard");
    // Should redirect to login
    await expect(page).toHaveURL(/.*login.*/);
  });

  test("Service Worker registration", async ({ page }) => {
    await page.goto("/");
    const swState = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      return registration.active?.state;
    });
    expect(swState).toBe("activated");
  });
});
