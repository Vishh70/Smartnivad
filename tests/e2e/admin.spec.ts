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
});
