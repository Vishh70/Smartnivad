# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\live-audit.spec.ts >> Live Site Audit >> Phase 10: Critical Regression Paths
- Location: tests\e2e\live-audit.spec.ts:122:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | const LIVE_URL = "https://smartnivad.vercel.app";
  4   | 
  5   | // Collect global errors during the run
  6   | const consoleErrors: string[] = [];
  7   | const networkErrors: string[] = [];
  8   | const visitedUrls = new Set<string>();
  9   | 
  10  | test.describe("Live Site Audit", () => {
> 11  |   test.beforeEach(async ({ page }) => {
      |        ^ Test timeout of 30000ms exceeded while running "beforeEach" hook.
  12  |     // Intercept console errors
  13  |     page.on("console", (msg) => {
  14  |       if (msg.type() === "error") {
  15  |         const text = msg.text();
  16  |         // Ignore harmless 3rd party or analytics errors
  17  |         if (
  18  |           !text.includes("_vercel/insights/script.js") &&
  19  |           !text.includes("the server responded with a status of 404") &&
  20  |           !text.includes("[next-auth][error][CLIENT_FETCH_ERROR]")
  21  |         ) {
  22  |           consoleErrors.push(`[${page.url()}] Console Error: ${text}`);
  23  |         }
  24  |       }
  25  |     });
  26  | 
  27  |     // Intercept page errors (uncaught exceptions)
  28  |     page.on("pageerror", (err) => {
  29  |       consoleErrors.push(`[${page.url()}] Page Error: ${err.message}`);
  30  |     });
  31  | 
  32  |     // Intercept failed network requests
  33  |     page.on("requestfailed", (request) => {
  34  |       const url = request.url();
  35  |       // Ignore typical ad-blocker or known analytics blocked requests if necessary
  36  |       if (
  37  |         !url.includes("google-analytics") && 
  38  |         !url.includes("analytics") &&
  39  |         !url.includes("unsplash.com") &&
  40  |         !url.includes("cloudinary.com") &&
  41  |         !url.includes("m.media-amazon.com") &&
  42  |         !url.includes("rukminim2.flixcart.com")
  43  |       ) {
  44  |         networkErrors.push(
  45  |           `[${page.url()}] Network Error: ${url} - ${request.failure()?.errorText}`,
  46  |         );
  47  |       }
  48  |     });
  49  | 
  50  |     // Intercept 404/500 responses
  51  |     page.on("response", (response) => {
  52  |       const status = response.status();
  53  |       if (status >= 400 && status !== 401 && status !== 403) {
  54  |         // Exclude 401/403 since auth endpoints often return them initially
  55  |         networkErrors.push(`[${page.url()}] HTTP ${status}: ${response.url()}`);
  56  |       }
  57  |     });
  58  |   });
  59  | 
  60  |   test("Phase 1 & 2 & 3: Full Site Discovery and Console/Network Check", async ({
  61  |     page,
  62  |   }) => {
  63  |     test.setTimeout(120000); // 2 mins for discovery
  64  |     await page.goto(LIVE_URL);
  65  |     visitedUrls.add(LIVE_URL);
  66  | 
  67  |     // Collect all links on the homepage
  68  |     const links = await page
  69  |       .locator("a[href^='/'], a[href^='" + LIVE_URL + "']")
  70  |       .evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).href));
  71  | 
  72  |     // Deduplicate and filter out hash links or assets
  73  |     const uniqueLinks = Array.from(new Set(links)).filter(
  74  |       (l) => !l.includes("#") && !l.match(/\.(png|jpg|jpeg|svg|css|js)$/i),
  75  |     );
  76  | 
  77  |     // Visit a subset of unique links to prevent the test from taking 2 hours
  78  |     // (We will visit up to 15 unique internal pages)
  79  |     const linksToVisit = uniqueLinks.slice(0, 15);
  80  | 
  81  |     for (const link of linksToVisit) {
  82  |       if (!visitedUrls.has(link)) {
  83  |         await page.goto(link);
  84  |         await page.waitForLoadState("networkidle");
  85  |         visitedUrls.add(link);
  86  |       }
  87  |     }
  88  | 
  89  |     // Check if any errors occurred during discovery
  90  |     expect(
  91  |       consoleErrors.length,
  92  |       `Found console errors: ${consoleErrors.join(", ")}`,
  93  |     ).toBe(0);
  94  |     expect(
  95  |       networkErrors.length,
  96  |       `Found network errors: ${networkErrors.join(", ")}`,
  97  |     ).toBe(0);
  98  |   });
  99  | 
  100 |   test("Phase 4: Mobile Responsive Audit (375px)", async ({ page }) => {
  101 |     await page.setViewportSize({ width: 375, height: 667 });
  102 |     await page.goto(LIVE_URL);
  103 | 
  104 |     // Ensure no horizontal scroll (client width should be same as scroll width, or body doesn't overflow)
  105 |     const isOverflowing = await page.evaluate(() => {
  106 |       return (
  107 |         document.documentElement.scrollWidth >
  108 |         document.documentElement.clientWidth
  109 |       );
  110 |     });
  111 |     expect(isOverflowing, "Horizontal scrolling detected on 375px").toBe(false);
```