# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\synthetic.spec.ts >> Synthetic Production Smoke Test >> Core user journey is functional
- Location: tests\e2e\synthetic.spec.ts:4:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.goto: Test timeout of 60000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/deals", waiting until "networkidle"

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
            - generic [ref=e52]:
                - generic [ref=e53]:
                    - heading "Find the Best Deals. Save More." [level=1] [ref=e54]:
                        - generic [ref=e55]: Find the Best Deals.
                        - generic [ref=e56]: Save More.
                    - paragraph [ref=e58]: AI-powered product discovery, price tracking, and deal recommendations.
                    - generic [ref=e60]:
                        - link "Explore Deals" [ref=e61] [cursor=pointer]:
                            - /url: /deals
                            - button "Explore Deals" [ref=e62]:
                                - generic [ref=e63]:
                                    - text: Explore Deals
                                    - img [ref=e64]
                        - link "Compare Products" [ref=e66] [cursor=pointer]:
                            - /url: /compare
                            - button "Compare Products" [ref=e67]:
                                - generic [ref=e68]: Compare Products
                    - generic [ref=e70]:
                        - generic [ref=e71]:
                            - img [ref=e72]
                            - generic [ref=e75]: 0+
                            - text: Monthly Users
                        - generic [ref=e76]:
                            - img [ref=e77]
                            - text: Verified Deals
                        - generic [ref=e80]:
                            - img [ref=e81]
                            - text: Amazon & Flipkart Partners
                        - generic [ref=e84]:
                            - img [ref=e85]
                            - text: AI Powered
                - generic [ref=e91]:
                    - generic [ref=e92]:
                        - img "Nothing Phone 2a clean Android midrange deal" [ref=e93]
                        - generic [ref=e94]:
                            - img [ref=e95]
                            - text: 21% OFF
                        - 'generic "AI Score: 73/100 — Good" [ref=e100]':
                            - generic [ref=e101]:
                                - img [ref=e102]
                                - generic [ref=e105]: "0"
                            - generic [ref=e106]: Good
                    - heading "Nothing Phone 2a clean Android midrange deal" [level=3] [ref=e107]
                    - generic [ref=e108]:
                        - generic [ref=e109]: ₹21999
                        - generic [ref=e110]: ₹27999
                    - link "View AI Analysis" [ref=e111] [cursor=pointer]:
                        - /url: /product/nothing-phone-2a-clean-android-midrange-deal
                        - button "View AI Analysis" [ref=e112]:
                            - generic [ref=e113]: View AI Analysis
            - generic [ref=e114]:
                - generic [ref=e116]:
                    - generic [ref=e117]:
                        - heading "Trending Deals" [level=2] [ref=e118]
                        - paragraph [ref=e119]: Real-time verified discounts across top stores.
                    - generic [ref=e122]:
                        - generic [ref=e124]:
                            - button "🟢 Live Deals (4)" [ref=e125]:
                                - text: 🟢 Live Deals
                                - generic [ref=e126]: (4)
                            - button "🔥 Hot Deals (2)" [ref=e127]:
                                - text: 🔥 Hot Deals
                                - generic [ref=e128]: (2)
                            - button "📈 Trending (4)" [ref=e129]:
                                - text: 📈 Trending
                                - generic [ref=e130]: (4)
                        - generic [ref=e131]:
                            - generic [ref=e134]:
                                - generic [ref=e135]: "-21%"
                                - button "Save to wishlist" [ref=e137]:
                                    - img [ref=e138]
                                - link "Nothing Phone 2a clean Android midrange deal 0 Good Nothing Phone 2a clean Android midrange deal 4.4 ₹21,999 ₹27,999 Flipkart 22 d ago" [ref=e140] [cursor=pointer]:
                                    - /url: /product/nothing-phone-2a-clean-android-midrange-deal
                                    - generic [ref=e141]:
                                        - img "Nothing Phone 2a clean Android midrange deal" [ref=e142]
                                        - 'generic "AI Score: 73/100 — Good" [ref=e144]':
                                            - generic [ref=e145]:
                                                - img [ref=e146]
                                                - generic [ref=e149]: "0"
                                            - generic [ref=e150]: Good
                                    - heading "Nothing Phone 2a clean Android midrange deal" [level=3] [ref=e151]
                                    - generic [ref=e152]:
                                        - img [ref=e153]
                                        - img [ref=e155]
                                        - img [ref=e157]
                                        - img [ref=e159]
                                        - img [ref=e161]
                                        - generic [ref=e163]: "4.4"
                                    - generic [ref=e164]:
                                        - generic [ref=e165]: ₹21,999
                                        - generic [ref=e166]: ₹27,999
                                    - generic [ref=e167]:
                                        - generic [ref=e168]: Flipkart
                                        - generic [ref=e169]:
                                            - img [ref=e170]
                                            - generic [ref=e173]: 22 d ago
                                - generic [ref=e175]: Unavailable
                            - generic [ref=e178]:
                                - generic [ref=e179]: "-27%"
                                - button "Save to wishlist" [ref=e181]:
                                    - img [ref=e182]
                                - link "Logitech MX Master 3S productivity mouse deal 0 Very Good Logitech MX Master 3S productivity mouse deal 4.7 ₹7,995 ₹10,995 Amazon 22 d ago" [ref=e184] [cursor=pointer]:
                                    - /url: /product/logitech-mx-master-3s-productivity-mouse-deal
                                    - generic [ref=e185]:
                                        - img "Logitech MX Master 3S productivity mouse deal" [ref=e186]
                                        - 'generic "AI Score: 78/100 — Very Good" [ref=e188]':
                                            - generic [ref=e189]:
                                                - img [ref=e190]
                                                - generic [ref=e193]: "0"
                                            - generic [ref=e194]: Very Good
                                    - heading "Logitech MX Master 3S productivity mouse deal" [level=3] [ref=e195]
                                    - generic [ref=e196]:
                                        - img [ref=e197]
                                        - img [ref=e199]
                                        - img [ref=e201]
                                        - img [ref=e203]
                                        - img [ref=e205]
                                        - generic [ref=e207]: "4.7"
                                    - generic [ref=e208]:
                                        - generic [ref=e209]: ₹7,995
                                        - generic [ref=e210]: ₹10,995
                                    - generic [ref=e211]:
                                        - generic [ref=e212]: Amazon
                                        - generic [ref=e213]:
                                            - img [ref=e214]
                                            - generic [ref=e217]: 22 d ago
                                - generic [ref=e219]: Unavailable
                            - generic [ref=e222]:
                                - generic [ref=e223]: "-18%"
                                - button "Save to wishlist" [ref=e225]:
                                    - img [ref=e226]
                                - link "ASUS ROG Zephyrus G14 creator gaming deal 0 Good ASUS ROG Zephyrus G14 creator gaming deal 4.5 ₹1,39,990 ₹1,69,990 Amazon 22 d ago" [ref=e228] [cursor=pointer]:
                                    - /url: /product/asus-rog-zephyrus-g14-creator-gaming-deal
                                    - generic [ref=e229]:
                                        - img "ASUS ROG Zephyrus G14 creator gaming deal" [ref=e230]
                                        - 'generic "AI Score: 71/100 — Good" [ref=e232]':
                                            - generic [ref=e233]:
                                                - img [ref=e234]
                                                - generic [ref=e237]: "0"
                                            - generic [ref=e238]: Good
                                    - heading "ASUS ROG Zephyrus G14 creator gaming deal" [level=3] [ref=e239]
                                    - generic [ref=e240]:
                                        - img [ref=e241]
                                        - img [ref=e243]
                                        - img [ref=e245]
                                        - img [ref=e247]
                                        - img [ref=e249]
                                        - generic [ref=e251]: "4.5"
                                    - generic [ref=e252]:
                                        - generic [ref=e253]: ₹1,39,990
                                        - generic [ref=e254]: ₹1,69,990
                                    - generic [ref=e255]:
                                        - generic [ref=e256]: Amazon
                                        - generic [ref=e257]:
                                            - img [ref=e258]
                                            - generic [ref=e261]: 22 d ago
                                - generic [ref=e263]: Unavailable
                            - generic [ref=e266]:
                                - generic [ref=e267]: "-29%"
                                - button "Save to wishlist" [ref=e269]:
                                    - img [ref=e270]
                                - link "Sony WH-1000XM5 work and travel headphone deal 0 Very Good Sony WH-1000XM5 work and travel headphone deal 4.8 ₹24,990 ₹34,990 Croma 22 d ago" [ref=e272] [cursor=pointer]:
                                    - /url: /product/sony-wh-1000xm5-work-travel-audio-deal
                                    - generic [ref=e273]:
                                        - img "Sony WH-1000XM5 work and travel headphone deal" [ref=e274]
                                        - 'generic "AI Score: 79/100 — Very Good" [ref=e276]':
                                            - generic [ref=e277]:
                                                - img [ref=e278]
                                                - generic [ref=e281]: "0"
                                            - generic [ref=e282]: Very Good
                                    - heading "Sony WH-1000XM5 work and travel headphone deal" [level=3] [ref=e283]
                                    - generic [ref=e284]:
                                        - img [ref=e285]
                                        - img [ref=e287]
                                        - img [ref=e289]
                                        - img [ref=e291]
                                        - img [ref=e293]
                                        - generic [ref=e295]: "4.8"
                                    - generic [ref=e296]:
                                        - generic [ref=e297]: ₹24,990
                                        - generic [ref=e298]: ₹34,990
                                    - generic [ref=e299]:
                                        - generic [ref=e300]: Croma
                                        - generic [ref=e301]:
                                            - img [ref=e302]
                                            - generic [ref=e305]: 22 d ago
                                - generic [ref=e307]: Unavailable
                    - link "View All Deals" [ref=e309] [cursor=pointer]:
                        - /url: /deals
                        - button "View All Deals" [ref=e310]:
                            - generic [ref=e311]: View All Deals
                - generic [ref=e313]:
                    - generic [ref=e314]:
                        - heading "AI Recommendations" [level=2] [ref=e315]
                        - paragraph [ref=e316]: Top picks selected by our AI based on value, quality, and trust.
                    - generic [ref=e318]:
                        - generic [ref=e322]:
                            - generic [ref=e323]: "-21%"
                            - button "Save to wishlist" [ref=e325]:
                                - img [ref=e326]
                            - link "Nothing Phone 2a clean Android midrange deal 0 Good Nothing Phone 2a clean Android midrange deal 4.4 ₹21,999 ₹27,999 Flipkart 22 d ago" [ref=e328] [cursor=pointer]:
                                - /url: /product/nothing-phone-2a-clean-android-midrange-deal
                                - generic [ref=e329]:
                                    - img "Nothing Phone 2a clean Android midrange deal" [ref=e330]
                                    - 'generic "AI Score: 73/100 — Good" [ref=e332]':
                                        - generic [ref=e333]:
                                            - img [ref=e334]
                                            - generic [ref=e337]: "0"
                                        - generic [ref=e338]: Good
                                - heading "Nothing Phone 2a clean Android midrange deal" [level=3] [ref=e339]
                                - generic [ref=e340]:
                                    - img [ref=e341]
                                    - img [ref=e343]
                                    - img [ref=e345]
                                    - img [ref=e347]
                                    - img [ref=e349]
                                    - generic [ref=e351]: "4.4"
                                - generic [ref=e352]:
                                    - generic [ref=e353]: ₹21,999
                                    - generic [ref=e354]: ₹27,999
                                - generic [ref=e355]:
                                    - generic [ref=e356]: Flipkart
                                    - generic [ref=e357]:
                                        - img [ref=e358]
                                        - generic [ref=e361]: 22 d ago
                            - generic [ref=e363]: Unavailable
                        - generic [ref=e367]:
                            - generic [ref=e368]: "-29%"
                            - button "Save to wishlist" [ref=e370]:
                                - img [ref=e371]
                            - link "Sony WH-1000XM5 work and travel headphone deal 0 Very Good Sony WH-1000XM5 work and travel headphone deal 4.8 ₹24,990 ₹34,990 Croma 22 d ago" [ref=e373] [cursor=pointer]:
                                - /url: /product/sony-wh-1000xm5-work-travel-audio-deal
                                - generic [ref=e374]:
                                    - img "Sony WH-1000XM5 work and travel headphone deal" [ref=e375]
                                    - 'generic "AI Score: 79/100 — Very Good" [ref=e377]':
                                        - generic [ref=e378]:
                                            - img [ref=e379]
                                            - generic [ref=e382]: "0"
                                        - generic [ref=e383]: Very Good
                                - heading "Sony WH-1000XM5 work and travel headphone deal" [level=3] [ref=e384]
                                - generic [ref=e385]:
                                    - img [ref=e386]
                                    - img [ref=e388]
                                    - img [ref=e390]
                                    - img [ref=e392]
                                    - img [ref=e394]
                                    - generic [ref=e396]: "4.8"
                                - generic [ref=e397]:
                                    - generic [ref=e398]: ₹24,990
                                    - generic [ref=e399]: ₹34,990
                                - generic [ref=e400]:
                                    - generic [ref=e401]: Croma
                                    - generic [ref=e402]:
                                        - img [ref=e403]
                                        - generic [ref=e406]: 22 d ago
                            - generic [ref=e408]: Unavailable
                        - generic [ref=e412]:
                            - generic [ref=e413]: "-11%"
                            - button "Save to wishlist" [ref=e415]:
                                - img [ref=e416]
                            - link "Samsung Galaxy S24 Ultra camera flagship offer 0 Good Samsung Galaxy S24 Ultra camera flagship offer 4.7 ₹1,19,999 ₹1,34,999 Flipkart 22 d ago" [ref=e418] [cursor=pointer]:
                                - /url: /product/samsung-galaxy-s24-ultra-camera-deal
                                - generic [ref=e419]:
                                    - img "Samsung Galaxy S24 Ultra camera flagship offer" [ref=e420]
                                    - 'generic "AI Score: 68/100 — Good" [ref=e422]':
                                        - generic [ref=e423]:
                                            - img [ref=e424]
                                            - generic [ref=e427]: "0"
                                        - generic [ref=e428]: Good
                                - heading "Samsung Galaxy S24 Ultra camera flagship offer" [level=3] [ref=e429]
                                - generic [ref=e430]:
                                    - img [ref=e431]
                                    - img [ref=e433]
                                    - img [ref=e435]
                                    - img [ref=e437]
                                    - img [ref=e439]
                                    - generic [ref=e441]: "4.7"
                                - generic [ref=e442]:
                                    - generic [ref=e443]: ₹1,19,999
                                    - generic [ref=e444]: ₹1,34,999
                                - generic [ref=e445]:
                                    - generic [ref=e446]: Flipkart
                                    - generic [ref=e447]:
                                        - img [ref=e448]
                                        - generic [ref=e451]: 22 d ago
                            - generic [ref=e453]: Unavailable
                        - generic [ref=e457]:
                            - generic [ref=e458]: "-12%"
                            - button "Save to wishlist" [ref=e460]:
                                - img [ref=e461]
                            - link "MacBook Air M3 16GB for students and creators 0 Good MacBook Air M3 16GB for students and creators 4.8 ₹1,09,900 ₹1,24,900 Amazon 22 d ago" [ref=e463] [cursor=pointer]:
                                - /url: /product/macbook-air-m3-16gb-student-creator-deal
                                - generic [ref=e464]:
                                    - img "MacBook Air M3 16GB for students and creators" [ref=e465]
                                    - 'generic "AI Score: 69/100 — Good" [ref=e467]':
                                        - generic [ref=e468]:
                                            - img [ref=e469]
                                            - generic [ref=e472]: "0"
                                        - generic [ref=e473]: Good
                                - heading "MacBook Air M3 16GB for students and creators" [level=3] [ref=e474]
                                - generic [ref=e475]:
                                    - img [ref=e476]
                                    - img [ref=e478]
                                    - img [ref=e480]
                                    - img [ref=e482]
                                    - img [ref=e484]
                                    - generic [ref=e486]: "4.8"
                                - generic [ref=e487]:
                                    - generic [ref=e488]: ₹1,09,900
                                    - generic [ref=e489]: ₹1,24,900
                                - generic [ref=e490]:
                                    - generic [ref=e491]: Amazon
                                    - generic [ref=e492]:
                                        - img [ref=e493]
                                        - generic [ref=e496]: 22 d ago
                            - generic [ref=e498]: Unavailable
                - generic [ref=e500]:
                    - generic [ref=e501]:
                        - heading "Top Categories" [level=2] [ref=e502]
                        - paragraph [ref=e503]: Browse deals by your favorite tech categories.
                    - generic [ref=e505]:
                        - link "Audio Explore deals" [ref=e507] [cursor=pointer]:
                            - /url: /deals?category=audio
                            - generic [ref=e509]:
                                - img [ref=e513]
                                - generic [ref=e516]:
                                    - heading "Audio" [level=3] [ref=e517]
                                    - paragraph [ref=e518]:
                                        - text: Explore deals
                                        - img [ref=e519]
                        - link "Gaming Explore deals" [ref=e522] [cursor=pointer]:
                            - /url: /deals?category=gaming
                            - generic [ref=e524]:
                                - img [ref=e528]
                                - generic [ref=e531]:
                                    - heading "Gaming" [level=3] [ref=e532]
                                    - paragraph [ref=e533]:
                                        - text: Explore deals
                                        - img [ref=e534]
                        - link "Laptops Explore deals" [ref=e537] [cursor=pointer]:
                            - /url: /deals?category=laptops
                            - generic [ref=e539]:
                                - img [ref=e543]
                                - generic [ref=e546]:
                                    - heading "Laptops" [level=3] [ref=e547]
                                    - paragraph [ref=e548]:
                                        - text: Explore deals
                                        - img [ref=e549]
                        - link "Smartphones Explore deals" [ref=e552] [cursor=pointer]:
                            - /url: /deals?category=smartphones
                            - generic [ref=e554]:
                                - img [ref=e558]
                                - generic [ref=e561]:
                                    - heading "Smartphones" [level=3] [ref=e562]
                                    - paragraph [ref=e563]:
                                        - text: Explore deals
                                        - img [ref=e564]
                - generic [ref=e571]:
                    - generic [ref=e572]: 📬
                    - heading "Never Miss a Price Drop" [level=2] [ref=e573]
                    - paragraph [ref=e574]:
                        - text: Join
                        - generic [ref=e575]: 0+
                        - text: tech enthusiasts. Get the best AI-verified deals and tech buying guides delivered weekly.
                    - generic [ref=e576]:
                        - textbox "Email address" [ref=e577]:
                            - /placeholder: your@email.com
                        - button "Subscribe" [ref=e578]
    - contentinfo [ref=e579]:
        - generic [ref=e580]:
            - generic [ref=e581]:
                - heading "SN SmartNivad ." [level=3] [ref=e582]:
                    - generic [ref=e583]: SN
                    - text: SmartNivad
                    - generic [ref=e584]: .
                - paragraph [ref=e585]:
                    - text: Discover AI-powered tech deals.
                    - text: We analyse thousands of products daily
                    - text: to help you buy smarter.
            - generic [ref=e586]:
                - link "📸 Instagram" [ref=e587] [cursor=pointer]:
                    - /url: https://www.instagram.com/smartnivad?igsh=MW1ldnFwNXVlczh0OQ==
                - link "✈️ Telegram" [ref=e588] [cursor=pointer]:
                    - /url: https://t.me/SmartNivad
            - generic [ref=e590]:
                - generic [ref=e591]:
                    - heading "Deals" [level=4] [ref=e592]
                    - generic [ref=e593]:
                        - link "All Deals" [ref=e594] [cursor=pointer]:
                            - /url: /deals
                        - link "Hot Deals" [ref=e595] [cursor=pointer]:
                            - /url: /deals?type=HOT
                        - link "Coupons" [ref=e596] [cursor=pointer]:
                            - /url: /coupons
                        - link "Compare" [ref=e597] [cursor=pointer]:
                            - /url: /compare
                - generic [ref=e598]:
                    - heading "Content" [level=4] [ref=e599]
                    - generic [ref=e600]:
                        - link "Blog" [ref=e601] [cursor=pointer]:
                            - /url: /blog
                        - link "Quiz" [ref=e602] [cursor=pointer]:
                            - /url: /quiz-answers
                        - link "Stores" [ref=e603] [cursor=pointer]:
                            - /url: /store
                        - link "Brands" [ref=e604] [cursor=pointer]:
                            - /url: /brand
                - generic [ref=e605]:
                    - heading "Legal" [level=4] [ref=e606]
                    - generic [ref=e607]:
                        - link "About" [ref=e608] [cursor=pointer]:
                            - /url: /about
                        - link "Contact" [ref=e609] [cursor=pointer]:
                            - /url: /contact
                        - link "Privacy" [ref=e610] [cursor=pointer]:
                            - /url: /privacy
                        - link "Terms" [ref=e611] [cursor=pointer]:
                            - /url: /terms
                        - link "Disclaimer" [ref=e612] [cursor=pointer]:
                            - /url: /disclaimer
            - generic [ref=e614]:
                - paragraph [ref=e615]: As an Amazon Associate and affiliate partner, we earn from qualifying purchases.
                - paragraph [ref=e616]: © 2026 SmartNivad. All rights reserved.
    - button "Open AI Assistant" [ref=e617]:
        - img [ref=e618]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  |
  3  | test.describe("Synthetic Production Smoke Test", () => {
  4  |   test("Core user journey is functional", async ({ page }) => {
  5  |     // Increase test timeout for CI environments
  6  |     test.setTimeout(60_000);
  7  |
  8  |     // 1. Open Homepage (baseURL is configured in playwright.config.ts or env)
  9  |     const response = await page.goto("/", { waitUntil: "networkidle" });
  10 |     expect(response?.status()).toBeGreaterThan(0);
  11 |
  12 |     // 2. Verify Hero renders
  13 |     await expect(page.locator("h1").first()).toBeVisible({ timeout: 15_000 });
  14 |
  15 |     // Optional: dismiss cookie/banner overlays that may block interactions
  16 |     const cookieClose = page
  17 |       .locator(
  18 |         '[data-testid="cookie-close"], button:has-text("Accept"), button:has-text("Dismiss")',
  19 |       )
  20 |       .first();
  21 |     if (await cookieClose.count()) {
  22 |       await cookieClose.click().catch(() => {});
  23 |     }
  24 |
  25 |     // 3. Navigate to Deals page directly
  26 |     //    (The "All Deals" link lives inside a hover-dropdown behind the hero section,
  27 |     //     which causes pointer-event interception failures in headless browsers.)
> 28 |     await page.goto("/deals", { waitUntil: "networkidle" });
     |                ^ Error: page.goto: Test timeout of 60000ms exceeded.
  29 |     await expect(page).toHaveURL(/.*\/deals/, { timeout: 15_000 });
  30 |
  31 |     // 4. Verify product cards render
  32 |     await expect(page.locator(".product-card").first()).toBeVisible({
  33 |       timeout: 15_000,
  34 |     });
  35 |   });
  36 | });
  37 |
```
