# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\admin.spec.ts >> Admin Panel E2E Tests >> unauthenticated users are redirected to login
- Location: tests\e2e\admin.spec.ts:4:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/admin", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  |
  3  | test.describe("Admin Panel E2E Tests", () => {
  4  |   test("unauthenticated users are redirected to login", async ({ page }) => {
  5  |     // Attempt to access the admin dashboard directly
> 6  |     await page.goto("/admin");
     |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  7  |
  8  |     // Verify redirection to the NextAuth signin page or custom login page
  9  |     // (Depending on how requireAdmin() is implemented, it might redirect to /api/auth/signin or /login)
  10 |     await expect(page).toHaveURL(/.*\/login.*/);
  11 |   });
  12 |
  13 |   test("admin deals page requires authentication", async ({ page }) => {
  14 |     await page.goto("/admin/deals");
  15 |     await expect(page).toHaveURL(/.*\/login.*/);
  16 |   });
  17 | });
  18 |
```
