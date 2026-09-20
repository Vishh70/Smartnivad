import { test, expect } from "../fixtures";

test.describe("Admin Panel E2E Tests", () => {
  test("unauthenticated users are redirected to login", async ({ page }) => {
    // Attempt to access the admin dashboard directly
    await page.goto(
      "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a",
    );

    // Verify redirection to the NextAuth signin page or custom login page
    // (Depending on how requireAdmin() is implemented, it might redirect to /api/auth/signin or /login)
    await expect(page).toHaveURL(/.*\/login.*/);
  });

  test("admin deals page requires authentication", async ({ page }) => {
    await page.goto(
      "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals",
    );
    await expect(page).toHaveURL(/.*\/login.*/);
  });

  test("admin can login and view bulk actions on deals page", async ({
    page,
  }) => {
    const adminEmail =
      process.env.SUPER_ADMIN_TEST_EMAIL ||
      process.env.SUPER_ADMIN_EMAIL ||
      "admin@example.com";
    const adminPassword = process.env.SUPER_ADMIN_TEST_PASSWORD;

    if (!adminPassword) {
      throw new Error(
        "SUPER_ADMIN_TEST_PASSWORD is required to execute admin login E2E test. Set SUPER_ADMIN_TEST_PASSWORD in your environment.",
      );
    }

    // 1. Go to login
    await page.goto("/login");

    // 2. Fill credentials
    await page.fill('input[type="email"]', adminEmail);
    await page.fill('input[type="password"]', adminPassword);
    await page.click('button[type="submit"]');

    // Wait for navigation after login (could go to / or /secure-management-zone-...)
    await page.waitForURL((url) => !url.toString().includes("/login"));

    // 3. Navigate to deals page
    await page.goto(
      "/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/deals",
    );

    // Ensure we are on the page
    await expect(page.locator("h1")).toContainText("Manage Deals");

    // 4. Test Bulk Actions UI
    // Initially, bulk action buttons should not be visible
    const publishSelectedBtn = page.getByRole("button", {
      name: "Publish Selected",
    });
    await expect(publishSelectedBtn).not.toBeVisible();

    // Click the top-left "Select All" checkbox in the table header
    // The select all button is the first button inside the thead
    const selectAllBtn = page.locator("thead button").first();
    await selectAllBtn.click();

    // If there are deals, the bulk action buttons should now appear
    // Wait a brief moment for state to update
    await page.waitForTimeout(500);

    // We can't guarantee deals exist in the DB, so we only assert if rows exist
    const rows = await page.locator("tbody tr").count();
    // If deals exist (and aren't the "No deals found" row which has colSpan)
    const hasDeals =
      rows > 0 && !(await page.locator("tbody td[colSpan]").isVisible());

    if (hasDeals) {
      await expect(publishSelectedBtn).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Delete Selected" }),
      ).toBeVisible();
    }
  });
});
