# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\live-audit.spec.ts >> Live Site Audit >> Phase 1 & 2 & 3: Full Site Discovery and Console/Network Check
- Location: tests\e2e\live-audit.spec.ts:43:7

# Error details

```
Error: Found console errors: [https://smartnivad1.vercel.app/] Console Error: Failed to load resource: the server responded with a status of 404 ()

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

# Page snapshot

```yaml
- main [ref=e3]:
  - paragraph [ref=e4]:
    - generic [ref=e5]:
      - strong [ref=e6]: "404"
      - text: ": NOT_FOUND"
    - generic [ref=e7]:
      - text: "Code:"
      - code [ref=e8]: "`DEPLOYMENT_NOT_FOUND`"
    - generic [ref=e9]:
      - text: "ID:"
      - code [ref=e10]: "`bom1::fzz4m-1784348661256-865b54eaf24e`"
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | const LIVE_URL = "https://smartnivad1.vercel.app";
  4   | 
  5   | // Collect global errors during the run
  6   | let consoleErrors: string[] = [];
  7   | let networkErrors: string[] = [];
  8   | const visitedUrls = new Set<string>();
  9   | 
  10  | test.describe("Live Site Audit", () => {
  11  |   test.beforeEach(async ({ page }) => {
  12  |     // Intercept console errors
  13  |     page.on("console", (msg) => {
  14  |       if (msg.type() === "error") {
  15  |         consoleErrors.push(`[${page.url()}] Console Error: ${msg.text()}`);
  16  |       }
  17  |     });
  18  | 
  19  |     // Intercept page errors (uncaught exceptions)
  20  |     page.on("pageerror", (err) => {
  21  |       consoleErrors.push(`[${page.url()}] Page Error: ${err.message}`);
  22  |     });
  23  | 
  24  |     // Intercept failed network requests
  25  |     page.on("requestfailed", (request) => {
  26  |       const url = request.url();
  27  |       // Ignore typical ad-blocker or known analytics blocked requests if necessary
  28  |       if (!url.includes("google-analytics") && !url.includes("analytics")) {
  29  |         networkErrors.push(`[${page.url()}] Network Error: ${url} - ${request.failure()?.errorText}`);
  30  |       }
  31  |     });
  32  |     
  33  |     // Intercept 404/500 responses
  34  |     page.on("response", (response) => {
  35  |       const status = response.status();
  36  |       if (status >= 400 && status !== 401 && status !== 403) {
  37  |         // Exclude 401/403 since auth endpoints often return them initially
  38  |         networkErrors.push(`[${page.url()}] HTTP ${status}: ${response.url()}`);
  39  |       }
  40  |     });
  41  |   });
  42  | 
  43  |   test("Phase 1 & 2 & 3: Full Site Discovery and Console/Network Check", async ({ page }) => {
  44  |     test.setTimeout(120000); // 2 mins for discovery
  45  |     await page.goto(LIVE_URL);
  46  |     visitedUrls.add(LIVE_URL);
  47  |     
  48  |     // Collect all links on the homepage
  49  |     const links = await page.locator("a[href^='/'], a[href^='" + LIVE_URL + "']").evaluateAll(els => 
  50  |       els.map(el => (el as HTMLAnchorElement).href)
  51  |     );
  52  |     
  53  |     // Deduplicate and filter out hash links or assets
  54  |     const uniqueLinks = Array.from(new Set(links)).filter(l => !l.includes("#") && !l.match(/\.(png|jpg|jpeg|svg|css|js)$/i));
  55  |     
  56  |     // Visit a subset of unique links to prevent the test from taking 2 hours
  57  |     // (We will visit up to 15 unique internal pages)
  58  |     const linksToVisit = uniqueLinks.slice(0, 15);
  59  |     
  60  |     for (const link of linksToVisit) {
  61  |       if (!visitedUrls.has(link)) {
  62  |         await page.goto(link);
  63  |         await page.waitForLoadState("networkidle");
  64  |         visitedUrls.add(link);
  65  |       }
  66  |     }
  67  |     
  68  |     // Check if any errors occurred during discovery
> 69  |     expect(consoleErrors.length, `Found console errors: ${consoleErrors.join(", ")}`).toBe(0);
      |                                                                                       ^ Error: Found console errors: [https://smartnivad1.vercel.app/] Console Error: Failed to load resource: the server responded with a status of 404 ()
  70  |     expect(networkErrors.length, `Found network errors: ${networkErrors.join(", ")}`).toBe(0);
  71  |   });
  72  | 
  73  |   test("Phase 4: Mobile Responsive Audit (375px)", async ({ page }) => {
  74  |     await page.setViewportSize({ width: 375, height: 667 });
  75  |     await page.goto(LIVE_URL);
  76  |     
  77  |     // Ensure no horizontal scroll (client width should be same as scroll width, or body doesn't overflow)
  78  |     const isOverflowing = await page.evaluate(() => {
  79  |       return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  80  |     });
  81  |     expect(isOverflowing, "Horizontal scrolling detected on 375px").toBe(false);
  82  |     
  83  |     // Open Mobile Drawer
  84  |     const menuBtn = page.locator('button:has(svg.lucide-menu)').first();
  85  |     if (await menuBtn.isVisible()) {
  86  |       await menuBtn.click();
  87  |       // Ensure drawer opened
  88  |       await expect(page.locator("nav").first()).toBeVisible();
  89  |     }
  90  |   });
  91  | 
  92  |   test("Phase 10: Critical Regression Paths", async ({ page }) => {
  93  |     await page.goto(LIVE_URL);
  94  |     
  95  |     // 1. Search
  96  |     const searchTrigger = page.locator('button:has(svg.lucide-search), input[placeholder*="Search"]').first();
  97  |     if (await searchTrigger.count() > 0) {
  98  |         await searchTrigger.click();
  99  |         const searchInput = page.locator('input[placeholder*="Search"]').last();
  100 |         await searchInput.fill("laptop");
  101 |     }
  102 |     
  103 |     // 2. Deals / Wishlist
  104 |     await page.goto(`${LIVE_URL}/deals`);
  105 |     await page.waitForLoadState("networkidle");
  106 |     const saveBtn = page.getByLabel("Save to wishlist").first();
  107 |     if (await saveBtn.count() > 0) {
  108 |       await saveBtn.click();
  109 |       await page.goto(`${LIVE_URL}/wishlist`);
  110 |       await expect(page.locator(".product-card").first()).toBeVisible();
  111 |     }
  112 | 
  113 |     // 3. Login
  114 |     await page.goto(`${LIVE_URL}/login`);
  115 |     await expect(page.locator("h1").filter({ hasText: /login|sign in/i })).toBeVisible();
  116 |   });
  117 | });
  118 | 
```