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
