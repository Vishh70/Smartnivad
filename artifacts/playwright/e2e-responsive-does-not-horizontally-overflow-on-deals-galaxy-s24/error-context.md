# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\responsive.spec.ts >> does not horizontally overflow on /deals
- Location: tests\e2e\responsive.spec.ts:7:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/deals", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e2]:
    - navigation [ref=e3]:
        - generic [ref=e5]:
            - link "SmartNivad LogoSmartNivad" [ref=e6] [cursor=pointer]:
                - /url: /
                - img "SmartNivad Logo" [ref=e7]
                - text: SmartNivad
            - generic [ref=e8]:
                - generic [ref=e9]:
                    - button "Deals" [ref=e10]:
                        - img [ref=e11]
                        - text: Deals
                        - img [ref=e14]
                    - generic [ref=e17]:
                        - link "All Deals" [ref=e18] [cursor=pointer]:
                            - /url: /deals
                        - link "Hot Deals" [ref=e19] [cursor=pointer]:
                            - /url: /deals?type=HOT
                        - link "Coupons" [ref=e20] [cursor=pointer]:
                            - /url: /coupons
                - link "Stores" [ref=e21] [cursor=pointer]:
                    - /url: /store
                    - img [ref=e22]
                    - text: Stores
                - generic [ref=e26]:
                    - button "Hardware" [ref=e27]:
                        - img [ref=e28]
                        - text: Hardware
                        - img [ref=e31]
                    - generic [ref=e34]:
                        - link "Audio" [ref=e35] [cursor=pointer]:
                            - /url: /deals?category=audio
                            - img [ref=e36]
                            - text: Audio
                        - link "Gaming" [ref=e38] [cursor=pointer]:
                            - /url: /deals?category=gaming
                            - img [ref=e39]
                            - text: Gaming
                        - link "Laptops" [ref=e41] [cursor=pointer]:
                            - /url: /deals?category=laptops
                            - img [ref=e42]
                            - text: Laptops
                        - link "Smartphones" [ref=e44] [cursor=pointer]:
                            - /url: /deals?category=smartphones
                            - img [ref=e45]
                            - text: Smartphones
                - link "Blog" [ref=e47] [cursor=pointer]:
                    - /url: /blog
                    - img [ref=e48]
                    - text: Blog
                - link "Quiz Answers" [ref=e50] [cursor=pointer]:
                    - /url: /quiz-answers
                    - img [ref=e51]
                    - text: Quiz Answers
            - generic [ref=e54]:
                - button "Search" [ref=e55]:
                    - img [ref=e56]
                    - generic [ref=e59]: ⌘K
                - link "Wishlist" [ref=e60] [cursor=pointer]:
                    - /url: /wishlist
                    - img [ref=e61]
                - button "Toggle menu" [ref=e63]:
                    - img [ref=e64]
    - main
    - contentinfo [ref=e65]:
        - generic [ref=e66]:
            - generic [ref=e67]:
                - heading "SNSmartNivad." [level=3] [ref=e68]
                - paragraph [ref=e69]:
                    - text: Discover AI-powered tech deals.
                    - text: We analyse thousands of products daily
                    - text: to help you buy smarter.
            - generic [ref=e70]:
                - link "📸 Instagram" [ref=e71] [cursor=pointer]:
                    - /url: https://www.instagram.com/smartnivad?igsh=MW1ldnFwNXVlczh0OQ==
                - link "✈️ Telegram" [ref=e72] [cursor=pointer]:
                    - /url: https://t.me/SmartNivad
            - generic [ref=e73]:
                - generic [ref=e74]:
                    - heading "Deals" [level=4] [ref=e75]
                    - generic [ref=e76]:
                        - link "All Deals" [ref=e77] [cursor=pointer]:
                            - /url: /deals
                        - link "Hot Deals" [ref=e78] [cursor=pointer]:
                            - /url: /deals?type=HOT
                        - link "Coupons" [ref=e79] [cursor=pointer]:
                            - /url: /coupons
                        - link "Compare" [ref=e80] [cursor=pointer]:
                            - /url: /compare
                - generic [ref=e81]:
                    - heading "Content" [level=4] [ref=e82]
                    - generic [ref=e83]:
                        - link "Blog" [ref=e84] [cursor=pointer]:
                            - /url: /blog
                        - link "Quiz" [ref=e85] [cursor=pointer]:
                            - /url: /quiz-answers
                        - link "Stores" [ref=e86] [cursor=pointer]:
                            - /url: /store
                        - link "Brands" [ref=e87] [cursor=pointer]:
                            - /url: /brand
                - generic [ref=e88]:
                    - heading "Legal" [level=4] [ref=e89]
                    - generic [ref=e90]:
                        - link "About" [ref=e91] [cursor=pointer]:
                            - /url: /about
                        - link "Contact" [ref=e92] [cursor=pointer]:
                            - /url: /contact
                        - link "Privacy" [ref=e93] [cursor=pointer]:
                            - /url: /privacy
                        - link "Terms" [ref=e94] [cursor=pointer]:
                            - /url: /terms
                        - link "Disclaimer" [ref=e95] [cursor=pointer]:
                            - /url: /disclaimer
            - generic [ref=e96]:
                - paragraph [ref=e97]: As an Amazon Associate and affiliate partner, we earn from qualifying purchases.
                - paragraph [ref=e98]: © 2026 SmartNivad. All rights reserved.
    - navigation [ref=e99]:
        - img
        - generic [ref=e100]:
            - link "Home" [ref=e101] [cursor=pointer]:
                - /url: /
                - img [ref=e103]
                - text: Home
            - link "Deals" [ref=e106] [cursor=pointer]:
                - /url: /deals
                - img [ref=e108]
                - text: Deals
            - link "Wishlist" [ref=e111] [cursor=pointer]:
                - /url: /wishlist
                - img [ref=e113]
                - text: Wishlist
            - link "Coupons" [ref=e115] [cursor=pointer]:
                - /url: /coupons
                - img [ref=e117]
                - text: Coupons
            - link "Compare" [ref=e121] [cursor=pointer]:
                - /url: /compare
                - img [ref=e123]
                - text: Compare
    - button "Open AI Assistant" [ref=e126]:
        - img [ref=e127]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | import { expectNoHorizontalOverflow } from "../helpers/responsive";
  3  |
  4  | const routes = ["/", "/deals", "/compare"];
  5  |
  6  | for (const route of routes) {
  7  |   test(`does not horizontally overflow on ${route}`, async ({ page }) => {
> 8  |     await page.goto(route);
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  9  |     await expect(page.locator("body")).toBeVisible();
  10 |     await expectNoHorizontalOverflow(page);
  11 |   });
  12 | }
  13 |
```
