# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\navigation.spec.ts >> Navigation & Core Flows >> mobile hamburger menu opens correctly
- Location: tests\e2e\navigation.spec.ts:21:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /Log In \/ Sign Up/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /Log In \/ Sign Up/i })

```

```yaml
- navigation:
    - link "SmartNivad Logo SmartNivad":
        - /url: /
        - img "SmartNivad Logo"
        - text: SmartNivad
    - button "Search"
    - link "Wishlist":
        - /url: /wishlist
    - button "Toggle menu"
- heading "Browse" [level=3]
- link "All Deals":
    - /url: /deals
- link "Hot Deals":
    - /url: /deals?type=HOT
- link "Stores":
    - /url: /store
- heading "Categories" [level=3]
- link "Audio":
    - /url: /deals?category=audio
- link "Gaming":
    - /url: /deals?category=gaming
- heading "More" [level=3]
- link "Blog":
    - /url: /blog
- link "Quiz Answers":
    - /url: /quiz-answers
- main:
    - heading "Find the Best Deals. Save More." [level=1]
    - paragraph: AI-powered product discovery, price tracking, and deal recommendations.
    - link "Explore Deals":
        - /url: /deals
        - button "Explore Deals"
    - link "Compare Products":
        - /url: /compare
        - button "Compare Products"
    - text: 50,000+ Monthly Users Verified Deals Amazon & Flipkart Partners AI Powered
    - img "Nothing Phone 2a clean Android midrange deal"
    - text: 21% OFF
    - img
    - text: 73 Good
    - heading "Nothing Phone 2a clean Android midrange deal" [level=3]
    - text: ₹21999 ₹27999
    - link "View AI Analysis":
        - /url: /product/nothing-phone-2a-clean-android-midrange-deal
        - button "View AI Analysis"
    - heading "Trending Deals" [level=2]
    - paragraph: Real-time verified discounts across top stores.
    - button "🟢 Live Deals (4)"
    - button "🔥 Hot Deals (2)"
    - button "📈 Trending (4)"
    - text: "-21%"
    - button "Save to wishlist"
    - link "Nothing Phone 2a clean Android midrange deal 0 Good Nothing Phone 2a clean Android midrange deal 4.4 ₹21,999 ₹27,999 Flipkart 22 d ago":
        - /url: /product/nothing-phone-2a-clean-android-midrange-deal
        - img "Nothing Phone 2a clean Android midrange deal"
        - img
        - text: 0 Good
        - heading "Nothing Phone 2a clean Android midrange deal" [level=3]
        - text: 4.4 ₹21,999 ₹27,999 Flipkart 22 d ago
    - text: Unavailable -27%
    - button "Save to wishlist"
    - link "Logitech MX Master 3S productivity mouse deal 0 Very Good Logitech MX Master 3S productivity mouse deal 4.7 ₹7,995 ₹10,995 Amazon 22 d ago":
        - /url: /product/logitech-mx-master-3s-productivity-mouse-deal
        - img "Logitech MX Master 3S productivity mouse deal"
        - img
        - text: 0 Very Good
        - heading "Logitech MX Master 3S productivity mouse deal" [level=3]
        - text: 4.7 ₹7,995 ₹10,995 Amazon 22 d ago
    - text: Unavailable -18%
    - button "Save to wishlist"
    - link "ASUS ROG Zephyrus G14 creator gaming deal 0 Good ASUS ROG Zephyrus G14 creator gaming deal 4.5 ₹1,39,990 ₹1,69,990 Amazon 22 d ago":
        - /url: /product/asus-rog-zephyrus-g14-creator-gaming-deal
        - img "ASUS ROG Zephyrus G14 creator gaming deal"
        - img
        - text: 0 Good
        - heading "ASUS ROG Zephyrus G14 creator gaming deal" [level=3]
        - text: 4.5 ₹1,39,990 ₹1,69,990 Amazon 22 d ago
    - text: Unavailable -29%
    - button "Save to wishlist"
    - link "Sony WH-1000XM5 work and travel headphone deal 0 Very Good Sony WH-1000XM5 work and travel headphone deal 4.8 ₹24,990 ₹34,990 Croma 22 d ago":
        - /url: /product/sony-wh-1000xm5-work-travel-audio-deal
        - img "Sony WH-1000XM5 work and travel headphone deal"
        - img
        - text: 0 Very Good
        - heading "Sony WH-1000XM5 work and travel headphone deal" [level=3]
        - text: 4.8 ₹24,990 ₹34,990 Croma 22 d ago
    - text: Unavailable
    - link "View All Deals":
        - /url: /deals
        - button "View All Deals"
    - heading "AI Recommendations" [level=2]
    - paragraph: Top picks selected by our AI based on value, quality, and trust.
    - text: "-21%"
    - button "Save to wishlist"
    - link "Nothing Phone 2a clean Android midrange deal 0 Good Nothing Phone 2a clean Android midrange deal 4.4 ₹21,999 ₹27,999 Flipkart 22 d ago":
        - /url: /product/nothing-phone-2a-clean-android-midrange-deal
        - img "Nothing Phone 2a clean Android midrange deal"
        - img
        - text: 0 Good
        - heading "Nothing Phone 2a clean Android midrange deal" [level=3]
        - text: 4.4 ₹21,999 ₹27,999 Flipkart 22 d ago
    - text: Unavailable -29%
    - button "Save to wishlist"
    - link "Sony WH-1000XM5 work and travel headphone deal 0 Very Good Sony WH-1000XM5 work and travel headphone deal 4.8 ₹24,990 ₹34,990 Croma 22 d ago":
        - /url: /product/sony-wh-1000xm5-work-travel-audio-deal
        - img "Sony WH-1000XM5 work and travel headphone deal"
        - img
        - text: 0 Very Good
        - heading "Sony WH-1000XM5 work and travel headphone deal" [level=3]
        - text: 4.8 ₹24,990 ₹34,990 Croma 22 d ago
    - text: Unavailable -11%
    - button "Save to wishlist"
    - link "Samsung Galaxy S24 Ultra camera flagship offer 0 Good Samsung Galaxy S24 Ultra camera flagship offer 4.7 ₹1,19,999 ₹1,34,999 Flipkart 22 d ago":
        - /url: /product/samsung-galaxy-s24-ultra-camera-deal
        - img "Samsung Galaxy S24 Ultra camera flagship offer"
        - img
        - text: 0 Good
        - heading "Samsung Galaxy S24 Ultra camera flagship offer" [level=3]
        - text: 4.7 ₹1,19,999 ₹1,34,999 Flipkart 22 d ago
    - text: Unavailable -12%
    - button "Save to wishlist"
    - link "MacBook Air M3 16GB for students and creators 0 Good MacBook Air M3 16GB for students and creators 4.8 ₹1,09,900 ₹1,24,900 Amazon 22 d ago":
        - /url: /product/macbook-air-m3-16gb-student-creator-deal
        - img "MacBook Air M3 16GB for students and creators"
        - img
        - text: 0 Good
        - heading "MacBook Air M3 16GB for students and creators" [level=3]
        - text: 4.8 ₹1,09,900 ₹1,24,900 Amazon 22 d ago
    - text: Unavailable
    - heading "Top Categories" [level=2]
    - paragraph: Browse deals by your favorite tech categories.
    - link "Audio Explore deals":
        - /url: /deals?category=audio
        - heading "Audio" [level=3]
        - paragraph: Explore deals
    - link "Gaming Explore deals":
        - /url: /deals?category=gaming
        - heading "Gaming" [level=3]
        - paragraph: Explore deals
    - link "Laptops Explore deals":
        - /url: /deals?category=laptops
        - heading "Laptops" [level=3]
        - paragraph: Explore deals
    - link "Smartphones Explore deals":
        - /url: /deals?category=smartphones
        - heading "Smartphones" [level=3]
        - paragraph: Explore deals
    - text: 📬
    - heading "Never Miss a Price Drop" [level=2]
    - paragraph: Join 0+ tech enthusiasts. Get the best AI-verified deals and tech buying guides delivered weekly.
    - textbox "Email address":
        - /placeholder: your@email.com
    - button "Subscribe"
- contentinfo:
    - heading "SN SmartNivad ." [level=3]
    - paragraph: Discover AI-powered tech deals. We analyse thousands of products daily to help you buy smarter.
    - link "📸 Instagram":
        - /url: https://www.instagram.com/smartnivad?igsh=MW1ldnFwNXVlczh0OQ==
    - link "✈️ Telegram":
        - /url: https://t.me/SmartNivad
    - heading "Deals" [level=4]
    - link "All Deals":
        - /url: /deals
    - link "Hot Deals":
        - /url: /deals?type=HOT
    - link "Coupons":
        - /url: /coupons
    - link "Compare":
        - /url: /compare
    - heading "Content" [level=4]
    - link "Blog":
        - /url: /blog
    - link "Quiz":
        - /url: /quiz-answers
    - link "Stores":
        - /url: /store
    - link "Brands":
        - /url: /brand
    - heading "Legal" [level=4]
    - link "About":
        - /url: /about
    - link "Contact":
        - /url: /contact
    - link "Privacy":
        - /url: /privacy
    - link "Terms":
        - /url: /terms
    - link "Disclaimer":
        - /url: /disclaimer
    - paragraph: As an Amazon Associate and affiliate partner, we earn from qualifying purchases.
    - paragraph: © 2026 SmartNivad. All rights reserved.
- navigation:
    - img
    - link "Home":
        - /url: /
    - link "Deals":
        - /url: /deals
    - link "Wishlist":
        - /url: /wishlist
    - link "Coupons":
        - /url: /coupons
    - link "Compare":
        - /url: /compare
- button "Open AI Assistant"
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  |
  3  | test.describe("Navigation & Core Flows", () => {
  4  |   test("homepage has correct title and hero elements", async ({ page }) => {
  5  |     await page.goto("/");
  6  |
  7  |     // Check title
  8  |     await expect(page).toHaveTitle(/SmartNivad/);
  9  |
  10 |     // Check Hero text
  11 |     const heading = page.locator("h1");
  12 |     await expect(heading).toContainText("Find the Best Deals. Save More.");
  13 |
  14 |     // Check CTA buttons
  15 |     const exploreBtn = page.getByRole("button", { name: /Explore Deals/i });
  16 |     const compareBtn = page.getByRole("button", { name: /Compare Products/i });
  17 |     await expect(exploreBtn).toBeVisible();
  18 |     await expect(compareBtn).toBeVisible();
  19 |   });
  20 |
  21 |   test("mobile hamburger menu opens correctly", async ({ page, isMobile }) => {
  22 |     if (!isMobile) return; // Skip if desktop
  23 |
  24 |     await page.goto("/");
  25 |
  26 |     // Click the hamburger menu
  27 |     const menuBtn = page.getByLabel("Toggle menu");
  28 |     await expect(menuBtn).toBeVisible();
  29 |     await menuBtn.click();
  30 |
  31 |     // Verify mobile menu overlay appears
  32 |     const loginBtn = page.getByRole("button", { name: /Log In \/ Sign Up/i });
> 33 |     await expect(loginBtn).toBeVisible();
     |                            ^ Error: expect(locator).toBeVisible() failed
  34 |   });
  35 | });
  36 |
```
