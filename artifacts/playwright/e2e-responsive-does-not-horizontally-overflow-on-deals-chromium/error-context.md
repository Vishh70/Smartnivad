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
Tearing down "context" exceeded the test timeout of 30000ms.
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
    - main [ref=e47]
    - contentinfo [ref=e213]:
        - generic [ref=e214]:
            - generic [ref=e215]:
                - heading "SN SmartNivad ." [level=3] [ref=e216]:
                    - generic [ref=e217]: SN
                    - text: SmartNivad
                    - generic [ref=e218]: .
                - paragraph [ref=e219]:
                    - text: Discover AI-powered tech deals.
                    - text: We analyse thousands of products daily
                    - text: to help you buy smarter.
            - generic [ref=e220]:
                - link "📸 Instagram" [ref=e221] [cursor=pointer]:
                    - /url: https://www.instagram.com/smartnivad?igsh=MW1ldnFwNXVlczh0OQ==
                - link "✈️ Telegram" [ref=e222] [cursor=pointer]:
                    - /url: https://t.me/SmartNivad
            - generic [ref=e224]:
                - generic [ref=e225]:
                    - heading "Deals" [level=4] [ref=e226]
                    - generic [ref=e227]:
                        - link "All Deals" [ref=e228] [cursor=pointer]:
                            - /url: /deals
                        - link "Hot Deals" [ref=e229] [cursor=pointer]:
                            - /url: /deals?type=HOT
                        - link "Coupons" [ref=e230] [cursor=pointer]:
                            - /url: /coupons
                        - link "Compare" [ref=e231] [cursor=pointer]:
                            - /url: /compare
                - generic [ref=e232]:
                    - heading "Content" [level=4] [ref=e233]
                    - generic [ref=e234]:
                        - link "Blog" [ref=e235] [cursor=pointer]:
                            - /url: /blog
                        - link "Quiz" [ref=e236] [cursor=pointer]:
                            - /url: /quiz-answers
                        - link "Stores" [ref=e237] [cursor=pointer]:
                            - /url: /store
                        - link "Brands" [ref=e238] [cursor=pointer]:
                            - /url: /brand
                - generic [ref=e239]:
                    - heading "Legal" [level=4] [ref=e240]
                    - generic [ref=e241]:
                        - link "About" [ref=e242] [cursor=pointer]:
                            - /url: /about
                        - link "Contact" [ref=e243] [cursor=pointer]:
                            - /url: /contact
                        - link "Privacy" [ref=e244] [cursor=pointer]:
                            - /url: /privacy
                        - link "Terms" [ref=e245] [cursor=pointer]:
                            - /url: /terms
                        - link "Disclaimer" [ref=e246] [cursor=pointer]:
                            - /url: /disclaimer
            - generic [ref=e248]:
                - paragraph [ref=e249]: As an Amazon Associate and affiliate partner, we earn from qualifying purchases.
                - paragraph [ref=e250]: © 2026 SmartNivad. All rights reserved.
    - button "Open AI Assistant" [ref=e251]:
        - img [ref=e252]
```
