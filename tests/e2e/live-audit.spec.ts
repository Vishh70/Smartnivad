import { test, expect } from "@playwright/test";

const LIVE_URL = "https://smartnivad.vercel.app";

// Collect global errors during the run
const consoleErrors: string[] = [];
const networkErrors: string[] = [];
const visitedUrls = new Set<string>();

test.describe("Live Site Audit", () => {
  test.beforeEach(async ({ page }) => {
    // Intercept console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(`[${page.url()}] Console Error: ${msg.text()}`);
      }
    });

    // Intercept page errors (uncaught exceptions)
    page.on("pageerror", (err) => {
      consoleErrors.push(`[${page.url()}] Page Error: ${err.message}`);
    });

    // Intercept failed network requests
    page.on("requestfailed", (request) => {
      const url = request.url();
      // Ignore typical ad-blocker or known analytics blocked requests if necessary
      if (!url.includes("google-analytics") && !url.includes("analytics")) {
        networkErrors.push(
          `[${page.url()}] Network Error: ${url} - ${request.failure()?.errorText}`,
        );
      }
    });

    // Intercept 404/500 responses
    page.on("response", (response) => {
      const status = response.status();
      if (status >= 400 && status !== 401 && status !== 403) {
        // Exclude 401/403 since auth endpoints often return them initially
        networkErrors.push(`[${page.url()}] HTTP ${status}: ${response.url()}`);
      }
    });
  });

  test("Phase 1 & 2 & 3: Full Site Discovery and Console/Network Check", async ({
    page,
  }) => {
    test.setTimeout(120000); // 2 mins for discovery
    await page.goto(LIVE_URL);
    visitedUrls.add(LIVE_URL);

    // Collect all links on the homepage
    const links = await page
      .locator("a[href^='/'], a[href^='" + LIVE_URL + "']")
      .evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).href));

    // Deduplicate and filter out hash links or assets
    const uniqueLinks = Array.from(new Set(links)).filter(
      (l) => !l.includes("#") && !l.match(/\.(png|jpg|jpeg|svg|css|js)$/i),
    );

    // Visit a subset of unique links to prevent the test from taking 2 hours
    // (We will visit up to 15 unique internal pages)
    const linksToVisit = uniqueLinks.slice(0, 15);

    for (const link of linksToVisit) {
      if (!visitedUrls.has(link)) {
        await page.goto(link);
        await page.waitForLoadState("networkidle");
        visitedUrls.add(link);
      }
    }

    // Check if any errors occurred during discovery
    expect(
      consoleErrors.length,
      `Found console errors: ${consoleErrors.join(", ")}`,
    ).toBe(0);
    expect(
      networkErrors.length,
      `Found network errors: ${networkErrors.join(", ")}`,
    ).toBe(0);
  });

  test("Phase 4: Mobile Responsive Audit (375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(LIVE_URL);

    // Ensure no horizontal scroll (client width should be same as scroll width, or body doesn't overflow)
    const isOverflowing = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(isOverflowing, "Horizontal scrolling detected on 375px").toBe(false);

    // Open Mobile Drawer
    const menuBtn = page.locator("button:has(svg.lucide-menu)").first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      // Ensure drawer opened
      await expect(page.locator("nav").first()).toBeVisible();
    }
  });

  test("Phase 10: Critical Regression Paths", async ({ page }) => {
    await page.goto(LIVE_URL);

    // 1. Search
    const searchTrigger = page
      .locator('button:has(svg.lucide-search), input[placeholder*="Search"]')
      .first();
    if ((await searchTrigger.count()) > 0) {
      await searchTrigger.click();
      const searchInput = page.locator('input[placeholder*="Search"]').last();
      await searchInput.fill("laptop");
    }

    // 2. Deals / Wishlist
    await page.goto(`${LIVE_URL}/deals`);
    await page.waitForLoadState("networkidle");
    const saveBtn = page.getByLabel("Save to wishlist").first();
    if ((await saveBtn.count()) > 0) {
      await saveBtn.click();
      await page.goto(`${LIVE_URL}/wishlist`);
      await expect(page.locator(".product-card").first()).toBeVisible();
    }

    // 3. Login
    await page.goto(`${LIVE_URL}/login`);
    await expect(
      page.locator("h1").filter({ hasText: /login|sign in/i }),
    ).toBeVisible();
  });
});
