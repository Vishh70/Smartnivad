import { test, expect } from "@playwright/test";

test.describe("Admin Panel E2E Tests", () => {
  test("unauthenticated users are redirected to login", async ({ page }) => {
    // Attempt to access the admin dashboard directly
    await page.goto("/admin");

    // Verify redirection to the NextAuth signin page or custom login page
    // (Depending on how requireAdmin() is implemented, it might redirect to /api/auth/signin or /login)
    await expect(page).toHaveURL(/.*\/login.*/);
  });

  test("admin deals page requires authentication", async ({ page }) => {
    await page.goto("/admin/deals");
    await expect(page).toHaveURL(/.*\/login.*/);
  });
});
