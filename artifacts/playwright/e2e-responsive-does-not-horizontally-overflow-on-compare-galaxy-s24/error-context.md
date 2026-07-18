# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\responsive.spec.ts >> does not horizontally overflow on /compare
- Location: tests\e2e\responsive.spec.ts:7:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/compare", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e2]:
    - navigation [ref=e3]:
        - generic [ref=e5]:
            - link "SmartNivad Logo SmartNivad" [ref=e6] [cursor=pointer]:
                - /url: /
                - img "SmartNivad Logo" [ref=e7]
                - text: SmartNivad
            - generic [ref=e8]:
                - button "Search" [ref=e9]:
                    - img [ref=e10]
                - link "Wishlist" [ref=e13] [cursor=pointer]:
                    - /url: /wishlist
                    - img [ref=e14]
                - button "Toggle menu" [ref=e18]:
                    - img [ref=e19]
    - main [ref=e20]:
        - generic [ref=e22]:
            - generic [ref=e23]:
                - heading "Product Comparison" [level=2] [ref=e24]
                - paragraph [ref=e25]: Select up to 3 products and compare them side-by-side.
            - generic [ref=e27]:
                - paragraph [ref=e28]: Choose products to compare below.
                - generic [ref=e29]:
                    - button "Nothing Phone 2a clean Android midrange deal Nothing Phone 2a clean Android midrange deal ₹21999" [ref=e30]:
                        - img [ref=e32]
                        - img "Nothing Phone 2a clean Android midrange deal" [ref=e34]
                        - generic [ref=e35]: Nothing Phone 2a clean Android midrange deal
                        - generic [ref=e36]: ₹21999
                    - button "Logitech MX Master 3S productivity mouse deal Logitech MX Master 3S productivity mouse deal ₹7995" [ref=e37]:
                        - img [ref=e39]
                        - img "Logitech MX Master 3S productivity mouse deal" [ref=e41]
                        - generic [ref=e42]: Logitech MX Master 3S productivity mouse deal
                        - generic [ref=e43]: ₹7995
                    - button "ASUS ROG Zephyrus G14 creator gaming deal ASUS ROG Zephyrus G14 creator gaming deal ₹139990" [ref=e44]:
                        - img [ref=e46]
                        - img "ASUS ROG Zephyrus G14 creator gaming deal" [ref=e48]
                        - generic [ref=e49]: ASUS ROG Zephyrus G14 creator gaming deal
                        - generic [ref=e50]: ₹139990
                    - button "Sony WH-1000XM5 work and travel headphone deal Sony WH-1000XM5 work and travel headphone deal ₹24990" [ref=e51]:
                        - img [ref=e53]
                        - img "Sony WH-1000XM5 work and travel headphone deal" [ref=e55]
                        - generic [ref=e56]: Sony WH-1000XM5 work and travel headphone deal
                        - generic [ref=e57]: ₹24990
                    - button "Samsung Galaxy S24 Ultra camera flagship offer Samsung Galaxy S24 Ultra camera flagship offer ₹119999" [ref=e58]:
                        - img [ref=e60]
                        - img "Samsung Galaxy S24 Ultra camera flagship offer" [ref=e62]
                        - generic [ref=e63]: Samsung Galaxy S24 Ultra camera flagship offer
                        - generic [ref=e64]: ₹119999
                    - button "MacBook Air M3 16GB for students and creators MacBook Air M3 16GB for students and creators ₹109900" [ref=e65]:
                        - img [ref=e67]
                        - img "MacBook Air M3 16GB for students and creators" [ref=e69]
                        - generic [ref=e70]: MacBook Air M3 16GB for students and creators
                        - generic [ref=e71]: ₹109900
            - generic [ref=e72]:
                - generic [ref=e73]: ⚖️
                - heading "Select at least 2 products to compare" [level=3] [ref=e74]
                - paragraph [ref=e75]: Choose from the grid above to start your side-by-side comparison.
                - link "Browse All Deals" [ref=e76] [cursor=pointer]:
                    - /url: /deals
                    - button "Browse All Deals" [ref=e77]
    - contentinfo [ref=e78]:
        - generic [ref=e79]:
            - generic [ref=e80]:
                - heading "SN SmartNivad ." [level=3] [ref=e81]:
                    - generic [ref=e82]: SN
                    - text: SmartNivad
                    - generic [ref=e83]: .
                - paragraph [ref=e84]:
                    - text: Discover AI-powered tech deals.
                    - text: We analyse thousands of products daily
                    - text: to help you buy smarter.
            - generic [ref=e85]:
                - link "📸 Instagram" [ref=e86] [cursor=pointer]:
                    - /url: https://www.instagram.com/smartnivad?igsh=MW1ldnFwNXVlczh0OQ==
                - link "✈️ Telegram" [ref=e87] [cursor=pointer]:
                    - /url: https://t.me/SmartNivad
            - generic [ref=e89]:
                - generic [ref=e90]:
                    - heading "Deals" [level=4] [ref=e91]
                    - generic [ref=e92]:
                        - link "All Deals" [ref=e93] [cursor=pointer]:
                            - /url: /deals
                        - link "Hot Deals" [ref=e94] [cursor=pointer]:
                            - /url: /deals?type=HOT
                        - link "Coupons" [ref=e95] [cursor=pointer]:
                            - /url: /coupons
                        - link "Compare" [ref=e96] [cursor=pointer]:
                            - /url: /compare
                - generic [ref=e97]:
                    - heading "Content" [level=4] [ref=e98]
                    - generic [ref=e99]:
                        - link "Blog" [ref=e100] [cursor=pointer]:
                            - /url: /blog
                        - link "Quiz" [ref=e101] [cursor=pointer]:
                            - /url: /quiz-answers
                        - link "Stores" [ref=e102] [cursor=pointer]:
                            - /url: /store
                        - link "Brands" [ref=e103] [cursor=pointer]:
                            - /url: /brand
                - generic [ref=e104]:
                    - heading "Legal" [level=4] [ref=e105]
                    - generic [ref=e106]:
                        - link "About" [ref=e107] [cursor=pointer]:
                            - /url: /about
                        - link "Contact" [ref=e108] [cursor=pointer]:
                            - /url: /contact
                        - link "Privacy" [ref=e109] [cursor=pointer]:
                            - /url: /privacy
                        - link "Terms" [ref=e110] [cursor=pointer]:
                            - /url: /terms
                        - link "Disclaimer" [ref=e111] [cursor=pointer]:
                            - /url: /disclaimer
            - generic [ref=e113]:
                - paragraph [ref=e114]: As an Amazon Associate and affiliate partner, we earn from qualifying purchases.
                - paragraph [ref=e115]: © 2026 SmartNivad. All rights reserved.
    - navigation [ref=e116]:
        - img
        - generic [ref=e117]:
            - link "Home" [ref=e118] [cursor=pointer]:
                - /url: /
                - img [ref=e120]
                - generic [ref=e123]: Home
            - link "Deals" [ref=e124] [cursor=pointer]:
                - /url: /deals
                - img [ref=e126]
                - generic [ref=e129]: Deals
            - link "Wishlist" [ref=e130] [cursor=pointer]:
                - /url: /wishlist
                - img [ref=e132]
                - generic [ref=e134]: Wishlist
            - link "Coupons" [ref=e135] [cursor=pointer]:
                - /url: /coupons
                - img [ref=e137]
                - generic [ref=e141]: Coupons
            - link "Compare" [ref=e142] [cursor=pointer]:
                - /url: /compare
                - img [ref=e144]
                - generic [ref=e147]: Compare
    - button "Open AI Assistant" [ref=e148]:
        - img [ref=e149]
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
