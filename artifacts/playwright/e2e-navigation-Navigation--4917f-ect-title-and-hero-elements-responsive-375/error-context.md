# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\navigation.spec.ts >> Navigation & Core Flows >> homepage has correct title and hero elements
- Location: tests\e2e\navigation.spec.ts:4:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  |
  3  | test.describe("Navigation & Core Flows", () => {
  4  |   test("homepage has correct title and hero elements", async ({ page }) => {
> 5  |     await page.goto("/");
     |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  6  |
  7  |     // Check title
  8  |     await expect(page).toHaveTitle(/SmartNivad/);
  9  |
  10 |     // Check Hero text
  11 |     const heading = page.locator("h1");
  12 |     await expect(heading).toContainText("Find the Best Deals. Save More.");
  13 |
  14 |     // Check CTA buttons
  15 |     const exploreBtn = page.getByRole("button", { name: /Explore Deals/i });
  16 |     const compareBtn = page.getByRole("button", { name: /Compare Products/i });
  17 |     await expect(exploreBtn).toBeVisible();
  18 |     await expect(compareBtn).toBeVisible();
  19 |   });
  20 |
  21 |   test("mobile hamburger menu opens correctly", async ({ page, isMobile }) => {
  22 |     if (!isMobile) return; // Skip if desktop
  23 |
  24 |     await page.goto("/");
  25 |
  26 |     // Click the hamburger menu
  27 |     const menuBtn = page.getByLabel("Toggle menu");
  28 |     await expect(menuBtn).toBeVisible();
  29 |     await menuBtn.click();
  30 |
  31 |     // Verify mobile menu overlay appears
  32 |     const loginBtn = page.getByRole("button", { name: /Log In \/ Sign Up/i });
  33 |     await expect(loginBtn).toBeVisible();
  34 |   });
  35 | });
  36 |
```
