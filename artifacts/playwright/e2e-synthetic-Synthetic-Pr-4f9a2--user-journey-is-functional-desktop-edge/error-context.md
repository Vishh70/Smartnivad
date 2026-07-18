# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\synthetic.spec.ts >> Synthetic Production Smoke Test >> Core user journey is functional
- Location: tests\e2e\synthetic.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1').first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('h1').first()
    - waiting for" http://localhost:3000/" navigation to finish...

```

```yaml
- navigation:
    - button "previous" [disabled]:
        - img "previous"
    - text: 1/1
    - button "next" [disabled]:
        - img "next"
- img
- link "Next.js 15.5.20 (outdated) Webpack":
    - /url: https://nextjs.org/docs/messages/version-staleness
    - img
    - text: Next.js 15.5.20 (outdated) Webpack
- img
- dialog "Runtime SyntaxError":
    - text: Runtime SyntaxError
    - button "Copy Error Info":
        - img
    - button "No related documentation found" [disabled]:
        - img
    - link "Learn more about enabling Node.js inspector for server code with Chrome DevTools":
        - /url: https://nextjs.org/docs/app/building-your-application/configuring/debugging#server-side-code
        - img
    - paragraph: Unexpected end of JSON input
    - paragraph: Call Stack 16
    - button "Show 15 ignore-listed frame(s)":
        - text: Show 15 ignore-listed frame(s)
        - img
    - text: JSON.parse <anonymous>
- contentinfo:
    - region "Error feedback":
        - paragraph:
            - link "Was this helpful?":
                - /url: https://nextjs.org/telemetry#error-feedback
        - button "Mark as helpful"
        - button "Mark as not helpful"
- button "Open Next.js Dev Tools":
    - img
- button "Open issues overlay": 1 Issue
- button "Collapse issues badge":
    - img
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  |
  3  | test.describe("Synthetic Production Smoke Test", () => {
  4  |   test("Core user journey is functional", async ({ page }) => {
  5  |     // Increase test timeout for CI environments
  6  |     test.setTimeout(60_000);
  7  |
  8  |     // 1. Open Homepage (baseURL is configured in playwright.config.ts or env)
  9  |     const response = await page.goto("/", { waitUntil: "networkidle" });
  10 |     expect(response?.status()).toBeGreaterThan(0);
  11 |
  12 |     // 2. Verify Hero renders
> 13 |     await expect(page.locator("h1").first()).toBeVisible({ timeout: 15_000 });
     |                                              ^ Error: expect(locator).toBeVisible() failed
  14 |
  15 |     // Optional: dismiss cookie/banner overlays that may block interactions
  16 |     const cookieClose = page
  17 |       .locator(
  18 |         '[data-testid="cookie-close"], button:has-text("Accept"), button:has-text("Dismiss")',
  19 |       )
  20 |       .first();
  21 |     if (await cookieClose.count()) {
  22 |       await cookieClose.click().catch(() => {});
  23 |     }
  24 |
  25 |     // 3. Navigate to Deals page directly
  26 |     //    (The "All Deals" link lives inside a hover-dropdown behind the hero section,
  27 |     //     which causes pointer-event interception failures in headless browsers.)
  28 |     await page.goto("/deals", { waitUntil: "networkidle" });
  29 |     await expect(page).toHaveURL(/.*\/deals/, { timeout: 15_000 });
  30 |
  31 |     // 4. Verify product cards render
  32 |     await expect(page.locator(".product-card").first()).toBeVisible({
  33 |       timeout: 15_000,
  34 |     });
  35 |   });
  36 | });
  37 |
```
