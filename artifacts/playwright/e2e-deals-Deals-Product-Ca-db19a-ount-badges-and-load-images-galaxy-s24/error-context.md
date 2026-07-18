# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\deals.spec.ts >> Deals & Product Cards >> product cards render discount badges and load images
- Location: tests\e2e\deals.spec.ts:4:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/deals", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  |
  3  | test.describe("Deals & Product Cards", () => {
  4  |   test("product cards render discount badges and load images", async ({
  5  |     page,
  6  |   }) => {
> 7  |     await page.goto("/deals");
     |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  8  |
  9  |     // Check for product cards
  10 |     const cards = page.locator(".product-card");
  11 |     // Wait for at least 1 card (increase timeout for Next.js dev server compilation)
  12 |     await expect(cards.first()).toBeVisible({ timeout: 30000 });
  13 |
  14 |     // Verify discount badge is present on at least one deal
  15 |     // Some deals might not have discounts, so we just check if any exist on the page
  16 |     const discountBadges = page.getByText(/-\d+%/);
  17 |     if ((await discountBadges.count()) > 0) {
  18 |       await expect(discountBadges.first()).toBeVisible();
  19 |     }
  20 |
  21 |     // Verify the "Save to wishlist" heart button is present and clickable
  22 |     const saveBtns = page.getByLabel("Save to wishlist");
  23 |     await expect(saveBtns.first()).toBeVisible();
  24 |   });
  25 | });
  26 |
```
