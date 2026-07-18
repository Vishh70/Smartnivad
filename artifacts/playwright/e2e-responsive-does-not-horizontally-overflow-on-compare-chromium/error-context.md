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
                - generic [ref=e9]:
                    - button "Deals" [ref=e10]:
                        - img [ref=e11]
                        - text: Deals
                        - img [ref=e14]
                    - generic:
                        - generic:
                            - link "All Deals":
                                - /url: /deals
                            - link "Hot Deals":
                                - /url: /deals?type=HOT
                            - link "Coupons":
                                - /url: /coupons
                - link "Stores" [ref=e16] [cursor=pointer]:
                    - /url: /store
                    - img [ref=e17]
                    - text: Stores
                - generic [ref=e21]:
                    - button "Hardware" [ref=e22]:
                        - img [ref=e23]
                        - text: Hardware
                        - img [ref=e26]
                    - generic:
                        - generic:
                            - link "Audio":
                                - /url: /deals?category=audio
                                - img
                                - text: Audio
                            - link "Gaming":
                                - /url: /deals?category=gaming
                                - img
                                - text: Gaming
                            - link "Laptops":
                                - /url: /deals?category=laptops
                                - img
                                - text: Laptops
                            - link "Smartphones":
                                - /url: /deals?category=smartphones
                                - img
                                - text: Smartphones
                - link "Blog" [ref=e28] [cursor=pointer]:
                    - /url: /blog
                    - img [ref=e29]
                    - text: Blog
                - link "Quiz Answers" [ref=e31] [cursor=pointer]:
                    - /url: /quiz-answers
                    - img [ref=e32]
                    - text: Quiz Answers
            - generic [ref=e35]:
                - button "Search" [ref=e36]:
                    - img [ref=e37]
                    - generic [ref=e40]:
                        - generic [ref=e41]: ⌘
                        - text: K
                - link "Wishlist" [ref=e42] [cursor=pointer]:
                    - /url: /wishlist
                    - img [ref=e43]
    - main [ref=e47]:
        - generic [ref=e49]:
            - generic [ref=e50]:
                - heading "Product Comparison" [level=2] [ref=e51]
                - paragraph [ref=e52]: Select up to 3 products and compare them side-by-side.
            - generic [ref=e54]:
                - paragraph [ref=e55]: Choose products to compare below.
                - generic [ref=e56]:
                    - button "Nothing Phone 2a clean Android midrange deal Nothing Phone 2a clean Android midrange deal ₹21999" [ref=e57]:
                        - img [ref=e59]
                        - img "Nothing Phone 2a clean Android midrange deal" [ref=e61]
                        - generic [ref=e62]: Nothing Phone 2a clean Android midrange deal
                        - generic [ref=e63]: ₹21999
                    - button "Logitech MX Master 3S productivity mouse deal Logitech MX Master 3S productivity mouse deal ₹7995" [ref=e64]:
                        - img [ref=e66]
                        - img "Logitech MX Master 3S productivity mouse deal" [ref=e68]
                        - generic [ref=e69]: Logitech MX Master 3S productivity mouse deal
                        - generic [ref=e70]: ₹7995
                    - button "ASUS ROG Zephyrus G14 creator gaming deal ASUS ROG Zephyrus G14 creator gaming deal ₹139990" [ref=e71]:
                        - img [ref=e73]
                        - img "ASUS ROG Zephyrus G14 creator gaming deal" [ref=e75]
                        - generic [ref=e76]: ASUS ROG Zephyrus G14 creator gaming deal
                        - generic [ref=e77]: ₹139990
                    - button "Sony WH-1000XM5 work and travel headphone deal Sony WH-1000XM5 work and travel headphone deal ₹24990" [ref=e78]:
                        - img [ref=e80]
                        - img "Sony WH-1000XM5 work and travel headphone deal" [ref=e82]
                        - generic [ref=e83]: Sony WH-1000XM5 work and travel headphone deal
                        - generic [ref=e84]: ₹24990
                    - button "Samsung Galaxy S24 Ultra camera flagship offer Samsung Galaxy S24 Ultra camera flagship offer ₹119999" [ref=e85]:
                        - img [ref=e87]
                        - img "Samsung Galaxy S24 Ultra camera flagship offer" [ref=e89]
                        - generic [ref=e90]: Samsung Galaxy S24 Ultra camera flagship offer
                        - generic [ref=e91]: ₹119999
                    - button "MacBook Air M3 16GB for students and creators MacBook Air M3 16GB for students and creators ₹109900" [ref=e92]:
                        - img [ref=e94]
                        - img "MacBook Air M3 16GB for students and creators" [ref=e96]
                        - generic [ref=e97]: MacBook Air M3 16GB for students and creators
                        - generic [ref=e98]: ₹109900
            - generic [ref=e99]:
                - generic [ref=e100]: ⚖️
                - heading "Select at least 2 products to compare" [level=3] [ref=e101]
                - paragraph [ref=e102]: Choose from the grid above to start your side-by-side comparison.
                - link "Browse All Deals" [ref=e103] [cursor=pointer]:
                    - /url: /deals
                    - button "Browse All Deals" [ref=e104]
    - contentinfo [ref=e105]:
        - generic [ref=e106]:
            - generic [ref=e107]:
                - heading "SN SmartNivad ." [level=3] [ref=e108]:
                    - generic [ref=e109]: SN
                    - text: SmartNivad
                    - generic [ref=e110]: .
                - paragraph [ref=e111]:
                    - text: Discover AI-powered tech deals.
                    - text: We analyse thousands of products daily
                    - text: to help you buy smarter.
            - generic [ref=e112]:
                - link "📸 Instagram" [ref=e113] [cursor=pointer]:
                    - /url: https://www.instagram.com/smartnivad?igsh=MW1ldnFwNXVlczh0OQ==
                - link "✈️ Telegram" [ref=e114] [cursor=pointer]:
                    - /url: https://t.me/SmartNivad
            - generic [ref=e116]:
                - generic [ref=e117]:
                    - heading "Deals" [level=4] [ref=e118]
                    - generic [ref=e119]:
                        - link "All Deals" [ref=e120] [cursor=pointer]:
                            - /url: /deals
                        - link "Hot Deals" [ref=e121] [cursor=pointer]:
                            - /url: /deals?type=HOT
                        - link "Coupons" [ref=e122] [cursor=pointer]:
                            - /url: /coupons
                        - link "Compare" [ref=e123] [cursor=pointer]:
                            - /url: /compare
                - generic [ref=e124]:
                    - heading "Content" [level=4] [ref=e125]
                    - generic [ref=e126]:
                        - link "Blog" [ref=e127] [cursor=pointer]:
                            - /url: /blog
                        - link "Quiz" [ref=e128] [cursor=pointer]:
                            - /url: /quiz-answers
                        - link "Stores" [ref=e129] [cursor=pointer]:
                            - /url: /store
                        - link "Brands" [ref=e130] [cursor=pointer]:
                            - /url: /brand
                - generic [ref=e131]:
                    - heading "Legal" [level=4] [ref=e132]
                    - generic [ref=e133]:
                        - link "About" [ref=e134] [cursor=pointer]:
                            - /url: /about
                        - link "Contact" [ref=e135] [cursor=pointer]:
                            - /url: /contact
                        - link "Privacy" [ref=e136] [cursor=pointer]:
                            - /url: /privacy
                        - link "Terms" [ref=e137] [cursor=pointer]:
                            - /url: /terms
                        - link "Disclaimer" [ref=e138] [cursor=pointer]:
                            - /url: /disclaimer
            - generic [ref=e140]:
                - paragraph [ref=e141]: As an Amazon Associate and affiliate partner, we earn from qualifying purchases.
                - paragraph [ref=e142]: © 2026 SmartNivad. All rights reserved.
    - button "Open AI Assistant" [ref=e143]:
        - img [ref=e144]
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
