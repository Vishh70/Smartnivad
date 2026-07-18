# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\admin.spec.ts >> Admin Panel E2E Tests >> admin deals page requires authentication
- Location: tests\e2e\admin.spec.ts:13:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*\/login.*/
Received string:  "http://localhost:3000/admin/deals"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    12 × unexpected value "http://localhost:3000/admin/deals"

```

```yaml
- heading "404" [level=1]
- heading "This page could not be found." [level=2]
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  |
  3  | test.describe("Admin Panel E2E Tests", () => {
  4  |   test("unauthenticated users are redirected to login", async ({ page }) => {
  5  |     // Attempt to access the admin dashboard directly
  6  |     await page.goto("/admin");
  7  |
  8  |     // Verify redirection to the NextAuth signin page or custom login page
  9  |     // (Depending on how requireAdmin() is implemented, it might redirect to /api/auth/signin or /login)
  10 |     await expect(page).toHaveURL(/.*\/login.*/);
  11 |   });
  12 |
  13 |   test("admin deals page requires authentication", async ({ page }) => {
  14 |     await page.goto("/admin/deals");
> 15 |     await expect(page).toHaveURL(/.*\/login.*/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  16 |   });
  17 | });
  18 |
```
