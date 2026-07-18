# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\accessibility.spec.ts >> Accessibility WCAG 2.2 AA Sweep >> Deals page passes accessibility checks
- Location: tests\e2e\accessibility.spec.ts:22:7

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
  2  | import AxeBuilder from "@axe-core/playwright";
  3  |
  4  | test.describe("Accessibility WCAG 2.2 AA Sweep", () => {
  5  |   test("Homepage passes accessibility checks", async ({ page }) => {
  6  |     await page.goto("/");
  7  |
  8  |     const accessibilityScanResults = await new AxeBuilder({ page })
  9  |       .withTags([
  10 |         "wcag2a",
  11 |         "wcag2aa",
  12 |         "wcag21a",
  13 |         "wcag21aa",
  14 |         "wcag22a",
  15 |         "wcag22aa",
  16 |       ])
  17 |       .analyze();
  18 |
  19 |     expect(accessibilityScanResults.violations).toEqual([]);
  20 |   });
  21 |
  22 |   test("Deals page passes accessibility checks", async ({ page }) => {
> 23 |     await page.goto("/deals");
     |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  24 |
  25 |     // Wait for network/hydration
  26 |     await page.waitForTimeout(1000);
  27 |
  28 |     const accessibilityScanResults = await new AxeBuilder({ page })
  29 |       .withTags([
  30 |         "wcag2a",
  31 |         "wcag2aa",
  32 |         "wcag21a",
  33 |         "wcag21aa",
  34 |         "wcag22a",
  35 |         "wcag22aa",
  36 |       ])
  37 |       .analyze();
  38 |
  39 |     expect(accessibilityScanResults.violations).toEqual([]);
  40 |   });
  41 | });
  42 |
```
