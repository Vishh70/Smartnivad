# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\admin.spec.ts >> Admin Panel E2E Tests >> admin deals page requires authentication
- Location: tests\e2e\admin.spec.ts:13:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/admin/deals", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e5]:
    - generic [ref=e6]:
        - generic [ref=e7]: TechDeals Admin
        - paragraph [ref=e8]: Sign in to manage your platform
    - generic [ref=e9]:
        - generic [ref=e10]:
            - generic [ref=e11]: Email Address
            - textbox "Email Address" [ref=e12]: admin@techdeals.ai
        - generic [ref=e13]:
            - generic [ref=e14]: Password
            - textbox "Password" [ref=e15]: admin
        - button "Sign In" [ref=e16]
    - generic [ref=e17]:
        - paragraph [ref=e18]: Or sign in with
        - button "Continue with Google" [ref=e19]:
            - img [ref=e20]
            - text: Continue with Google
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Admin Panel E2E Tests', () => {
  4  |   test('unauthenticated users are redirected to login', async ({ page }) => {
  5  |     // Attempt to access the admin dashboard directly
  6  |     await page.goto('/admin');
  7  |
  8  |     // Verify redirection to the NextAuth signin page or custom login page
  9  |     // (Depending on how requireAdmin() is implemented, it might redirect to /api/auth/signin or /login)
  10 |     await expect(page).toHaveURL(/.*\/login.*/);
  11 |   });
  12 |
  13 |   test('admin deals page requires authentication', async ({ page }) => {
> 14 |     await page.goto('/admin/deals');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  15 |     await expect(page).toHaveURL(/.*\/login.*/);
  16 |   });
  17 | });
  18 |
```
