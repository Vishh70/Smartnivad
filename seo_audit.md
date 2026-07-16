# Smartnivad SEO & Discoverability Audit

**Role:** Growth Engineer

## 1. Sitemap & Robots (`src/app/sitemap.ts`)

- **Status:** ✅ EXCELLENT. The dynamic sitemap correctly pulls Deals, Stores, Brands, Categories, and Posts with appropriate priorities and `lastModified` tags.
- **Improvement:** Add an XML image sitemap extension for Deal images to help them rank in Google Image Search.

## 2. Metadata & Open Graph

- **Status:** ✅ GOOD. Basic title tags and descriptions are set.
- **Improvement:** Product pages (`/product/[slug]`) currently share standard OG tags. We should generate dynamic OpenGraph images (using `@vercel/og` which we already have set up at `/api/og`) that overlay the Deal's Discount % and Price onto the image for higher CTR on Twitter/Facebook shares.

## 3. Structured Data (JSON-LD)

- **Status:** ❌ MISSING.
- **Improvement:** Inject `Product` Schema on the `/product` pages. This will allow Google to show "Rich Snippets" in search results (Price, InStock status, Rating).
- **Improvement:** Inject `Article` Schema on `/blog` pages.

## 4. Internal Linking

- **Status:** ⚠️ FAIR.
- **Improvement:** The Blog needs better interlinking. When a blog post mentions "Laptops", it should auto-link to `/category/laptops`.
- **Improvement:** Add "Related Deals" at the bottom of every product page to trap users in a clicking loop and reduce bounce rate (which heavily impacts SEO rankings).
