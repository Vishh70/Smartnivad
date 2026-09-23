import { test, expect } from "@playwright/test";

test.describe("Affiliate Content Engine - Functional Scenarios", () => {
  // Use a longer timeout for AI generation tasks
  test.setTimeout(120000);

  test("unauthorized users are blocked", async ({ page }) => {
    // Attempting to access admin without login
    await page.goto(
      "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content",
    );
    await expect(page).toHaveURL(/.*\/login.*/);
  });

  test.describe("Admin Workflows", () => {
    test.beforeEach(async ({ page }) => {
      // Admin login before each test in this block
      await page.goto("/login");
      await page.fill('input[type="email"]', "admin@smartnivad.com");
      await page.fill('input[type="password"]', "Admin123!");
      await page.click('button[type="submit"]');
      await page.waitForURL((url) => !url.toString().includes("/login"));
    });

    test("generates draft, processes workflow, prevents invalid transitions", async ({
      page,
    }) => {
      // Auto-accept all confirm dialogs
      page.on("dialog", (dialog) => dialog.accept());

      // 1. Navigate to Content Dashboard
      await page.goto(
        "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content",
      );
      await expect(page.locator("h1")).toContainText(
        "Affiliate Content Engine",
      );

      // 2. Click 'New Content Draft'
      await page.click("text=New Content Draft");
      await expect(page).toHaveURL(/.*\/content\/new/);

      // 3. Fill out the content form
      const uniqueSuffix = Date.now().toString().slice(-6);
      const title = `E2E Tech Guide ${uniqueSuffix}`;

      await page.fill('input[name="title"]', title);
      await page.selectOption('select[name="type"]', "GUIDE");
      await page.fill(
        'textarea[name="brief"]',
        "Focus on affordable student laptops.",
      );

      // Select the first deal in the list
      await page.locator('input[name="dealIds"]').first().check();

      // 4. Submit and wait for AI generation
      await page.click('button[type="submit"]');

      // Wait for redirect to review screen (AI generation can take up to 20-30s)
      await expect(page).toHaveURL(/.*\/content\/.*\/review/, {
        timeout: 60000,
      });
      await expect(page.locator("h1")).toContainText(
        `Review Content: ${title}`,
      );

      // 5. Initial Status must be DRAFT
      await expect(page.locator("p.text-lg.font-bold")).toContainText("DRAFT");

      // 6. Valid transition: Submit for Review
      await page.click('button:has-text("Submit for Review")');

      // Status should update to IN_REVIEW
      await expect(page.locator("p.text-lg.font-bold")).toContainText(
        "IN_REVIEW",
      );

      // 7. Valid transition: Approve Content
      await page.click('button:has-text("Approve Content")');
      await expect(page.locator("p.text-lg.font-bold")).toContainText(
        "APPROVED",
      );

      // 8. Valid transition: Publish Live
      await page.click('button:has-text("Publish Live")');
      await expect(page.locator("p.text-lg.font-bold")).toContainText(
        "PUBLISHED",
      );

      // At PUBLISHED, no action buttons should exist
      await expect(
        page.locator('button:has-text("Submit for Review")'),
      ).not.toBeVisible();
      await expect(
        page.locator('button:has-text("Approve Content")'),
      ).not.toBeVisible();
      await expect(
        page.locator('button:has-text("Publish Live")'),
      ).not.toBeVisible();
    });
  });
});
