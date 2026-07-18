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
                - generic [ref=e24]:
                    - heading "Deal Finder" [level=1] [ref=e25]
                    - paragraph [ref=e26]: Filter thousands of AI-curated deals in real time.
                - generic [ref=e28]:
                    - button "Audio" [ref=e29]:
                        - img [ref=e30]
                        - text: Audio
                    - button "Gaming" [ref=e32]:
                        - img [ref=e33]
                        - text: Gaming
                    - button "Laptops" [ref=e35]:
                        - img [ref=e36]
                        - text: Laptops
                    - button "Smartphones" [ref=e38]:
                        - img [ref=e39]
                        - text: Smartphones
            - generic [ref=e41]:
                - button "Filters" [ref=e42]:
                    - img [ref=e43]
                    - text: Filters
                - generic [ref=e44]:
                    - combobox "Sort deals" [ref=e45]:
                        - option "Most Popular" [selected]
                        - option "Newest First"
                        - option "Biggest Discount"
                        - 'option "Price: Low → High"'
                        - 'option "Price: High → Low"'
                        - option "Top Rated"
                    - img
            - generic [ref=e48]:
                - generic [ref=e51]:
                    - generic [ref=e52]: "-29%"
                    - button "Save to wishlist" [ref=e54]:
                        - img [ref=e55]
                    - link "Sony WH-1000XM5 work and travel headphone deal 0 Very Good Sony WH-1000XM5 work and travel headphone deal 4.8 ₹24,990 ₹34,990 Croma 22 d ago" [ref=e57] [cursor=pointer]:
                        - /url: /product/sony-wh-1000xm5-work-travel-audio-deal
                        - generic [ref=e58]:
                            - img "Sony WH-1000XM5 work and travel headphone deal" [ref=e59]
                            - 'generic "AI Score: 79/100 — Very Good" [ref=e61]':
                                - generic [ref=e62]:
                                    - img [ref=e63]
                                    - generic [ref=e66]: "0"
                                - generic [ref=e67]: Very Good
                        - heading "Sony WH-1000XM5 work and travel headphone deal" [level=3] [ref=e68]
                        - generic [ref=e69]:
                            - img [ref=e70]
                            - img [ref=e72]
                            - img [ref=e74]
                            - img [ref=e76]
                            - img [ref=e78]
                            - generic [ref=e80]: "4.8"
                        - generic [ref=e81]:
                            - generic [ref=e82]: ₹24,990
                            - generic [ref=e83]: ₹34,990
                        - generic [ref=e84]:
                            - generic [ref=e85]: Croma
                            - generic [ref=e86]:
                                - img [ref=e87]
                                - generic [ref=e90]: 22 d ago
                    - generic [ref=e92]: Unavailable
                - generic [ref=e95]:
                    - generic [ref=e96]: "-12%"
                    - button "Save to wishlist" [ref=e98]:
                        - img [ref=e99]
                    - link "MacBook Air M3 16GB for students and creators 0 Good MacBook Air M3 16GB for students and creators 4.8 ₹1,09,900 ₹1,24,900 Amazon 22 d ago" [ref=e101] [cursor=pointer]:
                        - /url: /product/macbook-air-m3-16gb-student-creator-deal
                        - generic [ref=e102]:
                            - img "MacBook Air M3 16GB for students and creators" [ref=e103]
                            - 'generic "AI Score: 69/100 — Good" [ref=e105]':
                                - generic [ref=e106]:
                                    - img [ref=e107]
                                    - generic [ref=e110]: "0"
                                - generic [ref=e111]: Good
                        - heading "MacBook Air M3 16GB for students and creators" [level=3] [ref=e112]
                        - generic [ref=e113]:
                            - img [ref=e114]
                            - img [ref=e116]
                            - img [ref=e118]
                            - img [ref=e120]
                            - img [ref=e122]
                            - generic [ref=e124]: "4.8"
                        - generic [ref=e125]:
                            - generic [ref=e126]: ₹1,09,900
                            - generic [ref=e127]: ₹1,24,900
                        - generic [ref=e128]:
                            - generic [ref=e129]: Amazon
                            - generic [ref=e130]:
                                - img [ref=e131]
                                - generic [ref=e134]: 22 d ago
                    - generic [ref=e136]: Unavailable
                - generic [ref=e139]:
                    - generic [ref=e140]: "-11%"
                    - button "Save to wishlist" [ref=e142]:
                        - img [ref=e143]
                    - link "Samsung Galaxy S24 Ultra camera flagship offer 0 Good Samsung Galaxy S24 Ultra camera flagship offer 4.7 ₹1,19,999 ₹1,34,999 Flipkart 22 d ago" [ref=e145] [cursor=pointer]:
                        - /url: /product/samsung-galaxy-s24-ultra-camera-deal
                        - generic [ref=e146]:
                            - img "Samsung Galaxy S24 Ultra camera flagship offer" [ref=e147]
                            - 'generic "AI Score: 68/100 — Good" [ref=e149]':
                                - generic [ref=e150]:
                                    - img [ref=e151]
                                    - generic [ref=e154]: "0"
                                - generic [ref=e155]: Good
                        - heading "Samsung Galaxy S24 Ultra camera flagship offer" [level=3] [ref=e156]
                        - generic [ref=e157]:
                            - img [ref=e158]
                            - img [ref=e160]
                            - img [ref=e162]
                            - img [ref=e164]
                            - img [ref=e166]
                            - generic [ref=e168]: "4.7"
                        - generic [ref=e169]:
                            - generic [ref=e170]: ₹1,19,999
                            - generic [ref=e171]: ₹1,34,999
                        - generic [ref=e172]:
                            - generic [ref=e173]: Flipkart
                            - generic [ref=e174]:
                                - img [ref=e175]
                                - generic [ref=e178]: 22 d ago
                    - generic [ref=e180]: Unavailable
                - generic [ref=e183]:
                    - generic [ref=e184]: "-18%"
                    - button "Save to wishlist" [ref=e186]:
                        - img [ref=e187]
                    - link "ASUS ROG Zephyrus G14 creator gaming deal 0 Good ASUS ROG Zephyrus G14 creator gaming deal 4.5 ₹1,39,990 ₹1,69,990 Amazon 22 d ago" [ref=e189] [cursor=pointer]:
                        - /url: /product/asus-rog-zephyrus-g14-creator-gaming-deal
                        - generic [ref=e190]:
                            - img "ASUS ROG Zephyrus G14 creator gaming deal" [ref=e191]
                            - 'generic "AI Score: 71/100 — Good" [ref=e193]':
                                - generic [ref=e194]:
                                    - img [ref=e195]
                                    - generic [ref=e198]: "0"
                                - generic [ref=e199]: Good
                        - heading "ASUS ROG Zephyrus G14 creator gaming deal" [level=3] [ref=e200]
                        - generic [ref=e201]:
                            - img [ref=e202]
                            - img [ref=e204]
                            - img [ref=e206]
                            - img [ref=e208]
                            - img [ref=e210]
                            - generic [ref=e212]: "4.5"
                        - generic [ref=e213]:
                            - generic [ref=e214]: ₹1,39,990
                            - generic [ref=e215]: ₹1,69,990
                        - generic [ref=e216]:
                            - generic [ref=e217]: Amazon
                            - generic [ref=e218]:
                                - img [ref=e219]
                                - generic [ref=e222]: 22 d ago
                    - generic [ref=e224]: Unavailable
                - generic [ref=e227]:
                    - generic [ref=e228]: "-21%"
                    - button "Save to wishlist" [ref=e230]:
                        - img [ref=e231]
                    - link "Nothing Phone 2a clean Android midrange deal 0 Good Nothing Phone 2a clean Android midrange deal 4.4 ₹21,999 ₹27,999 Flipkart 22 d ago" [ref=e233] [cursor=pointer]:
                        - /url: /product/nothing-phone-2a-clean-android-midrange-deal
                        - generic [ref=e234]:
                            - img "Nothing Phone 2a clean Android midrange deal" [ref=e235]
                            - 'generic "AI Score: 73/100 — Good" [ref=e237]':
                                - generic [ref=e238]:
                                    - img [ref=e239]
                                    - generic [ref=e242]: "0"
                                - generic [ref=e243]: Good
                        - heading "Nothing Phone 2a clean Android midrange deal" [level=3] [ref=e244]
                        - generic [ref=e245]:
                            - img [ref=e246]
                            - img [ref=e248]
                            - img [ref=e250]
                            - img [ref=e252]
                            - img [ref=e254]
                            - generic [ref=e256]: "4.4"
                        - generic [ref=e257]:
                            - generic [ref=e258]: ₹21,999
                            - generic [ref=e259]: ₹27,999
                        - generic [ref=e260]:
                            - generic [ref=e261]: Flipkart
                            - generic [ref=e262]:
                                - img [ref=e263]
                                - generic [ref=e266]: 22 d ago
                    - generic [ref=e268]: Unavailable
                - generic [ref=e271]:
                    - generic [ref=e272]: "-27%"
                    - button "Save to wishlist" [ref=e274]:
                        - img [ref=e275]
                    - link "Logitech MX Master 3S productivity mouse deal 0 Very Good Logitech MX Master 3S productivity mouse deal 4.7 ₹7,995 ₹10,995 Amazon 22 d ago" [ref=e277] [cursor=pointer]:
                        - /url: /product/logitech-mx-master-3s-productivity-mouse-deal
                        - generic [ref=e278]:
                            - img "Logitech MX Master 3S productivity mouse deal" [ref=e279]
                            - 'generic "AI Score: 78/100 — Very Good" [ref=e281]':
                                - generic [ref=e282]:
                                    - img [ref=e283]
                                    - generic [ref=e286]: "0"
                                - generic [ref=e287]: Very Good
                        - heading "Logitech MX Master 3S productivity mouse deal" [level=3] [ref=e288]
                        - generic [ref=e289]:
                            - img [ref=e290]
                            - img [ref=e292]
                            - img [ref=e294]
                            - img [ref=e296]
                            - img [ref=e298]
                            - generic [ref=e300]: "4.7"
                        - generic [ref=e301]:
                            - generic [ref=e302]: ₹7,995
                            - generic [ref=e303]: ₹10,995
                        - generic [ref=e304]:
                            - generic [ref=e305]: Amazon
                            - generic [ref=e306]:
                                - img [ref=e307]
                                - generic [ref=e310]: 22 d ago
                    - generic [ref=e312]: Unavailable
            - generic [ref=e313]:
                - generic [ref=e314]:
                    - heading "Browse by Store" [level=2] [ref=e315]
                    - paragraph [ref=e316]: Find deals from your favourite retailers.
                - generic [ref=e318]:
                    - link "🏪 Amazon" [ref=e319] [cursor=pointer]:
                        - /url: /store/amazon
                        - generic [ref=e320]: 🏪
                        - generic [ref=e321]: Amazon
                    - link "🏪 Croma" [ref=e322] [cursor=pointer]:
                        - /url: /store/croma
                        - generic [ref=e323]: 🏪
                        - generic [ref=e324]: Croma
                    - link "🏪 Flipkart" [ref=e325] [cursor=pointer]:
                        - /url: /store/flipkart
                        - generic [ref=e326]: 🏪
                        - generic [ref=e327]: Flipkart
    - contentinfo [ref=e328]:
        - generic [ref=e329]:
            - generic [ref=e330]:
                - heading "SN SmartNivad ." [level=3] [ref=e331]:
                    - generic [ref=e332]: SN
                    - text: SmartNivad
                    - generic [ref=e333]: .
                - paragraph [ref=e334]:
                    - text: Discover AI-powered tech deals.
                    - text: We analyse thousands of products daily
                    - text: to help you buy smarter.
            - generic [ref=e335]:
                - link "📸 Instagram" [ref=e336] [cursor=pointer]:
                    - /url: https://www.instagram.com/smartnivad?igsh=MW1ldnFwNXVlczh0OQ==
                - link "✈️ Telegram" [ref=e337] [cursor=pointer]:
                    - /url: https://t.me/SmartNivad
            - generic [ref=e339]:
                - generic [ref=e340]:
                    - heading "Deals" [level=4] [ref=e341]
                    - generic [ref=e342]:
                        - link "All Deals" [ref=e343] [cursor=pointer]:
                            - /url: /deals
                        - link "Hot Deals" [ref=e344] [cursor=pointer]:
                            - /url: /deals?type=HOT
                        - link "Coupons" [ref=e345] [cursor=pointer]:
                            - /url: /coupons
                        - link "Compare" [ref=e346] [cursor=pointer]:
                            - /url: /compare
                - generic [ref=e347]:
                    - heading "Content" [level=4] [ref=e348]
                    - generic [ref=e349]:
                        - link "Blog" [ref=e350] [cursor=pointer]:
                            - /url: /blog
                        - link "Quiz" [ref=e351] [cursor=pointer]:
                            - /url: /quiz-answers
                        - link "Stores" [ref=e352] [cursor=pointer]:
                            - /url: /store
                        - link "Brands" [ref=e353] [cursor=pointer]:
                            - /url: /brand
                - generic [ref=e354]:
                    - heading "Legal" [level=4] [ref=e355]
                    - generic [ref=e356]:
                        - link "About" [ref=e357] [cursor=pointer]:
                            - /url: /about
                        - link "Contact" [ref=e358] [cursor=pointer]:
                            - /url: /contact
                        - link "Privacy" [ref=e359] [cursor=pointer]:
                            - /url: /privacy
                        - link "Terms" [ref=e360] [cursor=pointer]:
                            - /url: /terms
                        - link "Disclaimer" [ref=e361] [cursor=pointer]:
                            - /url: /disclaimer
            - generic [ref=e363]:
                - paragraph [ref=e364]: As an Amazon Associate and affiliate partner, we earn from qualifying purchases.
                - paragraph [ref=e365]: © 2026 SmartNivad. All rights reserved.
    - navigation [ref=e366]:
        - img
        - generic [ref=e367]:
            - link "Home" [ref=e368] [cursor=pointer]:
                - /url: /
                - img [ref=e370]
                - generic [ref=e373]: Home
            - link "Deals" [ref=e374] [cursor=pointer]:
                - /url: /deals
                - img [ref=e376]
                - generic [ref=e379]: Deals
            - link "Wishlist" [ref=e380] [cursor=pointer]:
                - /url: /wishlist
                - img [ref=e382]
                - generic [ref=e384]: Wishlist
            - link "Coupons" [ref=e385] [cursor=pointer]:
                - /url: /coupons
                - img [ref=e387]
                - generic [ref=e391]: Coupons
            - link "Compare" [ref=e392] [cursor=pointer]:
                - /url: /compare
                - img [ref=e394]
                - generic [ref=e397]: Compare
    - button "Open AI Assistant" [ref=e398]:
        - img [ref=e399]
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
