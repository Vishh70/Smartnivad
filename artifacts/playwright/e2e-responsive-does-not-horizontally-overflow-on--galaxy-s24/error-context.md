# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\responsive.spec.ts >> does not horizontally overflow on /
- Location: tests\e2e\responsive.spec.ts:7:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | import { expectNoHorizontalOverflow } from "../helpers/responsive";
  3  |
  4  | const routes = ["/", "/deals", "/compare"];
  5  |
  6  | for (const route of routes) {
  7  |   test(`does not horizontally overflow on ${route}`, async ({ page }) => {
> 8  |     await page.goto(route);
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  9  |     await expect(page.locator("body")).toBeVisible();
  10 |     await expectNoHorizontalOverflow(page);
  11 |   });
  12 | }
  13 |
```
