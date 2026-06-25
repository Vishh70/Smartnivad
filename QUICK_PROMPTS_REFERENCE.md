# TechDeals AI: Quick Prompts Reference
## Copy-Paste Antigravity (GitHub Copilot) + Codex (Claude API) Prompts

Use these prompts in order as you progress through each phase. Antigravity instructions work in VS Code with GitHub Copilot; Codex instructions work in this conversation (or with Claude API).

---

## PHASE 0: FOUNDATION (Days 0–1)

### Quick Checklist
```
☐ GitHub account + repo created
☐ Vercel account connected
☐ Supabase project created (2 connection strings saved)
☐ Cloudinary API credentials saved
☐ Google OAuth credentials (Client ID + Secret)
☐ Resend API key created
☐ Node.js 20+, VS Code, GitHub Copilot installed
☐ .env.local file created with all secrets
```

---

## PHASE 1: PROJECT ARCHITECTURE (Days 1–2)

### Antigravity Prompt 1: Create Project & Install Dependencies
```bash
# Run these commands in terminal
npx create-next-app@latest techdeals-ai \
  --typescript --tailwind --app --src-dir --eslint

cd techdeals-ai

npm install @prisma/client prisma next-auth@beta @auth/prisma-adapter \
  cloudinary @tanstack/react-query zustand lucide-react framer-motion \
  @anthropic-ai/sdk resend

npm install -D @types/node prettier eslint-config-prettier
```

### Antigravity Prompt 2: Create Folder Structure
```bash
# In VS Code terminal, run:
mkdir -p src/components/{ui,admin,public}
mkdir -p src/lib src/types
mkdir -p src/app/api/{auth,products,categories,upload,ai,track,newsletter}
mkdir -p src/app/{products,admin,login}
mkdir -p prisma
```

### Codex Prompt 1: Generate tailwind.config.ts
**In VS Code:** Open `tailwind.config.ts` and type below, then press **Tab** for Copilot suggestions:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark premium background
        bg: {
          DEFAULT: '#050816',
          secondary: '#0a0a1f',
        },
        // Neon cyan primary
        primary: {
          DEFAULT: '#00E5FF',
          light: '#33ecff',
          dark: '#00b8cc',
        },
        // Vibrant purple secondary
        secondary: {
          DEFAULT: '#7C3AED',
          light: '#9f5ef8',
        },
        // Glass effect colors
        glass: {
          card: 'rgba(255,255,255,0.08)',
          border: 'rgba(255,255,255,0.12)',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0,229,255,0.4)',
        'glow-purple': '0 0 20px rgba(124,58,237,0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,229,255,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(0,229,255,0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

### Codex Prompt 2: Generate globals.css
**Use this Claude API prompt in this conversation:**

```
Generate src/app/globals.css with:
- @tailwind base/components/utilities
- CSS variables: --primary #00E5FF, --secondary #7C3AED, --bg #050816
- Glass effect variables
- Dark scrollbar styling
- Selection color cyan with transparency
- Body background and text color
- .glass-card utility class (backdrop blur, bg with opacity, border)
- .gradient-text utility (gradient background, bg-clip-text, transparent text)
- .neon-border utility (cyan border with glow shadow)

Use CSS only, no Tailwind directives except @tailwind. Include @keyframes for float, glow-pulse, shimmer animations.
```

**Claude will generate the complete CSS file** — copy and save as `src/app/globals.css`

### Codex Prompt 3: Generate TypeScript Types
```
Generate src/types/index.ts with these TypeScript interfaces:

1. Product: id (string), slug (unique), title, description, image, affiliateLink, categoryId, category (optional), price (number), originalPrice (optional), discount (optional), rating (number), featured (boolean), clicks (number), seoTitle, seoDesc, pros (string array), cons (string array), tags (string array), createdAt (Date), updatedAt (Date)

2. Category: id, name, slug (unique), icon (optional), description (optional), products array, createdAt

3. ApiResponse<T>: data (generic), success (boolean), error (optional string)

4. PaginationMeta: total, page, perPage, totalPages

Export all interfaces as named exports. Use TypeScript syntax only.
```

---

## PHASE 2: DATABASE & PRISMA (Days 3–4)

### Antigravity Prompt: Initialize Prisma
```bash
npx prisma init --datasource-provider postgresql
```

### Codex Prompt 1: Generate Complete Prisma Schema
```
Generate prisma/schema.prisma with:

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

Models:
1. Product: cuid @id, slug @unique, title (String), description (String @db.Text), image, affiliateLink, categoryId, category (Category @relation), price (Float), originalPrice (Float?), discount (Int?), rating (Float @default(0)), featured (Boolean @default(false)), clicks (Int @default(0)), seoTitle (String?), seoDesc (String? @db.Text), pros (String[]), cons (String[]), tags (String[]), createdAt (@default(now())), updatedAt (@updatedAt). Add @@index([slug]), @@index([categoryId]), @@index([featured]), @@index([createdAt]).

2. Category: cuid @id, slug @unique, name (String), icon (String?), description (String? @db.Text), products (Product[] relation), createdAt (@default(now())). Add @@index([slug]).

3. Admin: cuid @id, email @unique, name (String?), image (String?), createdAt (@default(now())).

4. NewsletterSubscriber: cuid @id, email @unique, subscribedAt (@default(now())).

Output valid Prisma schema with all syntax correct.
```

### Antigravity Prompt: Run Migration
```bash
# In terminal
npx prisma migrate dev --name init
# Answer "yes" to "Create a new migration?"
```

### Codex Prompt 2: Generate Prisma Client Singleton
```
Generate src/lib/prisma.ts that:
1. Creates a global Prisma client instance (singleton pattern)
2. Uses globalThis to store singleton between hot reloads
3. Prevents multiple Prisma instances in development
4. Includes TypeScript declaration for globalThis
5. Exports const prisma

Must handle Next.js hot reload properly with conditional assignment to globalForPrisma.
```

### Codex Prompt 3: Generate prisma/seed.ts
```
Generate prisma/seed.ts with:

5 Categories:
- Smartphones (slug: smartphones)
- Laptops (slug: laptops)
- Audio (slug: audio)
- Cameras (slug: cameras)
- Accessories (slug: accessories)

12 Products with real Indian tech brands:
1. Samsung Galaxy S24 - ₹79999 - Smartphones
2. OnePlus 12 - ₹64999 - Smartphones
3. MacBook Air M3 - ₹134999 - Laptops
4. Dell XPS 15 - ₹149999 - Laptops
5. Sony WH-1000XM5 - ₹29999 - Audio
6. JBL Charge 5 - ₹16999 - Audio
7. Sony Alpha ZV-E10 - ₹65999 - Cameras
8. Canon EOS M50 - ₹54999 - Cameras
9. Apple Watch SE - ₹24999 - Accessories
10. Mi Band 8 - ₹4999 - Accessories
11. Samsung Galaxy Buds2 - ₹11999 - Accessories
12. Logitech MX Keys - ₹19999 - Accessories

For each product: description (80-100 words), rating (4.3-4.9), pros (5 items), cons (3 items), tags (6-8 keywords), featured (mark 3 as true), affiliateLink (https://amzn.to/[slug]).

Use prisma.upsert with slug as key. Include try/catch/finally with $disconnect().
```

### Antigravity Prompt: Run Seed
```bash
npx tsx prisma/seed.ts
# Or add to package.json: "seed": "tsx prisma/seed.ts"
# Then: npm run seed
```

### Antigravity Prompt: View Data
```bash
npx prisma studio
# Opens at http://localhost:5555
```

---

## PHASE 3: AUTHENTICATION (Days 5–6)

### Codex Prompt 1: Generate src/auth.ts
```
Generate src/auth.ts for NextAuth v5 with:

1. Google OAuth provider (using GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET env vars)
2. Prisma adapter for database session storage
3. JWT session strategy
4. Custom login page at /login
5. Authorized callback: only allow users where email === ADMIN_EMAIL env var
6. signIn event: log when user signs in
7. Export: handlers, auth, signIn, signOut

Use TypeScript, import from next-auth and next-auth/providers/google, include all callbacks and pages objects.
```

### Antigravity Prompt: Create Auth Route
```typescript
// In src/app/api/auth/[...nextauth]/route.ts
// Type these 2 lines:
import { handlers } from '@/auth'
export const { GET, POST } = handlers
```

### Codex Prompt 2: Generate middleware.ts
```
Generate middleware.ts (at project root, NOT in src/) that:
1. Imports auth from '@/auth'
2. Exports middleware function that calls auth()
3. Exports config with matcher: ['/admin/:path*']
4. TypeScript syntax

This protects all /admin/* routes with NextAuth.
```

### Codex Prompt 3: Generate src/app/login/page.tsx
```
Generate src/app/login/page.tsx (client component) with:

1. "use client" directive
2. Dark glassmorphism design (dark bg, glass card center)
3. "TechDeals AI Admin" heading
4. "Admin Login" subheading
5. "Sign in with Google" button (primary color, cyan)
6. Import signIn from 'next-auth/react'
7. handleGoogleSignIn async function
8. Loading state while signing in
9. Redirect to /admin on success
10. Responsive, mobile-first Tailwind CSS
11. Use neon-border and glass-card classes

Include error handling if sign-in fails.
```

### Antigravity Prompt: Create SessionProvider
```typescript
// In src/components/ui/SessionProvider.tsx
// Type and let Copilot suggest:
'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
// Copilot will suggest the component structure
```

### Antigravity Prompt: Update Layout
```typescript
// In src/app/layout.tsx
// Replace the export default function to wrap children with SessionProvider
// Copilot will suggest the proper structure when you start typing
```

---

## PHASE 4: PUBLIC HOMEPAGE (Days 7–9)

### Codex Prompt 1: Generate HeroSection Component
```
Generate src/components/public/HeroSection.tsx with:

1. 'use client' directive
2. Dark premium hero section (min-h-screen, centered)
3. Animated background with 2 glowing orbs (primary + secondary color)
4. Main content: h1 "TechDeals AI", p "Discover best tech products powered by AI", p "Compare, review, and buy smarter"
5. CTA button "Explore Deals" (primary color, neon-border)
6. Use Framer Motion for animations:
   - Orbs float up/down infinitely
   - Content fades in on mount
   - Button scales on hover
7. Tailwind CSS only
8. gradient-text utility for heading

Include initial, animate, transition props for smooth effects.
```

### Codex Prompt 2: Generate ProductCard Component
```
Generate src/components/public/ProductCard.tsx with:

1. Receives Product prop
2. Displays: image, discount% badge (red), title, price, originalPrice (strikethrough), rating with ⭐
3. Image zoom on hover
4. Glass card styling
5. "View Deal" button that links to /products/[slug]
6. Show ₹ prices in Indian format
7. h-full for grid consistency
8. Use Next.js Image component with fill + object-cover

Card should be responsive and work in grid layouts.
```

### Codex Prompt 3: Generate CategoriesGrid Component
```
Generate src/components/public/CategoriesGrid.tsx (async server component) with:

1. Fetches categories (hardcoded for now: Smartphones, Laptops, Audio, Cameras, Accessories, Accessories)
2. Displays 6-column grid on desktop, 2-column on mobile
3. Each category: glass card, emoji icon, category name
4. Hover effect: neon-border
5. Float animation on hover
6. Links to /category/[slug]

Use TailwindCSS grid, icons can be emoji for now.
```

### Codex Prompt 4: Generate NewsletterForm Component
```
Generate src/components/public/NewsletterForm.tsx (client component) with:

1. Glass card centered in section
2. Heading: "Get the Best Deals First"
3. Subheading: "Subscribe to newsletter..."
4. Email input + Subscribe button (flex layout)
5. POST to /api/newsletter/subscribe with email
6. Show "Check your email!" message on success
7. Loading state on button
8. Form reset after success
9. Error handling console.log

Use React hooks (useState), Tailwind CSS, dark glassmorphism design.
```

### Antigravity Prompt: Update src/app/page.tsx
```typescript
// In src/app/page.tsx
// Type these imports and let Copilot complete:
import { HeroSection } from '@/components/public/HeroSection'
import { CategoriesGrid } from '@/components/public/CategoriesGrid'
import { NewsletterForm } from '@/components/public/NewsletterForm'

// Copilot will suggest the export default function structure
```

---

## PHASE 5: PRODUCT PAGES (Days 10–12)

### Codex Prompt 1: Generate Product Detail Page
```
Generate src/app/products/[slug]/page.tsx with:

1. Type Props with params: { slug: string }
2. generateMetadata function: fetch product, return Metadata with title, description, openGraph image
3. generateStaticParams: fetch all products, return array of {slug} objects (SSG)
4. Default component: fetch product by slug, handle 404 with notFound()
5. Display: large image (left), title, price, originalPrice, discount%, rating
6. Show pros and cons as lists
7. "Buy on Amazon" and "Buy on Flipkart" buttons (2 columns)
8. Affiliate disclaimer at bottom
9. Include related products (3 from same category)
10. Use Prisma, Next.js Image, Link
11. Responsive grid layout

Use TypeScript, handle errors, calculate discount % dynamically.
```

### Codex Prompt 2: Generate Product API Route
```
Generate src/app/api/products/[slug]/route.ts that:

1. GET endpoint
2. Extract slug from params
3. Fetch product from Prisma by slug
4. Include category relation
5. Return JSON if found
6. Return 404 JSON if not found
7. Return 500 JSON on error
8. Use NextResponse

Keep it simple, just fetch and return.
```

---

## PHASE 6: SEARCH & FILTERS (Days 13–15)

### Codex Prompt 1: Generate Products List API
```
Generate src/app/api/products/route.ts that:

1. GET endpoint with query parameters:
   - search (text, searches title + description)
   - category (slug)
   - minPrice, maxPrice
   - sortBy: 'newest' | 'price' | 'rating'
   - page (pagination, 12 per page)

2. Build Prisma where clause with AND conditions:
   - price >= minPrice AND price <= maxPrice
   - If search: title OR description contains search (case-insensitive)
   - If category: fetch category by slug, filter by categoryId

3. Sort by: createdAt desc (newest), price asc, rating desc

4. Skip/take for pagination

5. Return JSON:
   {
     products: Product[],
     total: number,
     page: number,
     pageSize: 12,
     totalPages: number
   }

6. Error handling (return 500 JSON)

Use Prisma aggregations for count, proper TypeScript typing.
```

### Codex Prompt 2: Generate SearchFilters Component
```
Generate src/components/public/SearchFilters.tsx (client component) with:

1. useSearchParams + useRouter for URL state
2. Search input: updates search param on change, debounced
3. Category dropdown: fetches from /api/categories, updates category param
4. Price range slider: min 0, max 500000, step 10000, updates maxPrice param
5. Sort dropdown: newest | price | rating, updates sortBy param
6. All filters update URL and router.push()
7. Glass card styling
8. All filter changes reset page to 1

Use Next.js routing, keep state minimal with URL as source of truth.
```

### Codex Prompt 3: Generate Deals Listing Page
```
Generate src/app/deals/page.tsx that:

1. Has SearchFilters component on left (lg:col-span-1)
2. Has ProductsList async component on right (lg:col-span-3)
3. ProductsList fetches from /api/products?[searchParams]
4. Maps through products and renders ProductCard for each
5. Grid layout: 1 column mobile, 2 md:, 3 lg:
6. Title: "All Deals"
7. Handle Suspense with loading fallback

Use grid layout, Suspense boundary, proper async/await for data fetching.
```

---

## PHASE 7: ADMIN DASHBOARD (Days 16–20)

### Codex Prompt 1: Generate Admin Layout
```
Generate src/app/admin/layout.tsx that:

1. Call auth() to get session
2. If no session, redirect to /login
3. Wrap children with glass card layout
4. Top bar: title "Admin Dashboard", user email, Sign Out link
5. Main content area with children
6. Protected route (only authenticated users)
7. Show email in top right

Use TypeScript, next/navigation, auth from '@/auth'.
```

### Codex Prompt 2: Generate Admin Dashboard Home
```
Generate src/app/admin/page.tsx (async server component) that:

1. Fetch metrics from Prisma:
   - totalProducts: prisma.product.count()
   - totalClicks: prisma.product.aggregate({ _sum: { clicks } })
   - totalCategories: prisma.category.count()
   - totalSubscribers: prisma.newsletterSubscriber.count()

2. Fetch recentProducts: last 5 products (orderBy createdAt desc)

3. Display in grid:
   - 4 metric cards (dark glass bg, label + number)
   - 4 quick action buttons: Add Product, Manage Products, Manage Categories, View Analytics
   - Recent products table: title, price, rating, edit link

4. Use glass-card styling, responsive grid
5. Table with borders, striped rows

Use Prisma, TypeScript, async components.
```

### Codex Prompt 3: Generate Product Form Component
```
Generate src/components/admin/ProductForm.tsx (client component) with:

1. Receives optional product (for edit mode)
2. Form fields: title, description, image (file upload), price, originalPrice, category (dropdown), featured (checkbox), rating
3. Image upload to Cloudinary (show preview)
4. Add/remove pros and cons fields (array inputs)
5. Add/remove tags fields (array inputs)
6. "Generate with AI" buttons:
   - AI Summarize: calls /api/ai/summarize, fills description/pros/cons/tags
   - AI SEO: calls /api/ai/seo, fills seoTitle/seoDesc
7. Submit button: POST /api/admin/products for new, PATCH for edit
8. Loading state while submitting
9. Success/error messages
10. Form validation (required fields)

Use React hooks, Tailwind CSS, error handling.
```

---

## PHASE 8: AI FEATURES (Days 21–26)

### Codex Prompt 1: Generate /api/ai/summarize
```
Generate src/app/api/ai/summarize/route.ts that:

1. POST endpoint
2. Request body: { productTitle: string, productDescription?: string }
3. Use Anthropic Claude API (@anthropic-ai/sdk)
4. Prompt Claude to return JSON:
   {
     "summary": "100-word product summary",
     "pros": ["pro 1", ..., "pro 5"],
     "cons": ["con 1", "con 2", "con 3"],
     "tags": ["tag1", ..., "tag8"]
   }
5. Parse response JSON
6. Return JSON result
7. Error handling (return 500 JSON)

Use claude-opus-4-6 model, max_tokens: 500. Return JSON only, no markdown.
```

### Codex Prompt 2: Generate /api/ai/seo
```
Generate src/app/api/ai/seo/route.ts that:

1. POST endpoint
2. Request body: { productTitle: string, description?: string, price: number }
3. Use Claude API
4. Prompt Claude to return JSON:
   {
     "seoTitle": "compelling title <60 chars",
     "seoDescription": "description <160 chars",
     "keywords": ["keyword1", ..., "keyword5"]
   }
5. Parse response JSON
6. Return JSON
7. Error handling

Use claude-opus-4-6, max_tokens: 300. JSON only output.
```

### Codex Prompt 3: Generate /api/ai/compare
```
Generate src/app/api/ai/compare/route.ts that:

1. POST endpoint
2. Request body: { products: { title: string, price: number, features: string[] }[] }
3. Use Claude API
4. Prompt to compare products, return JSON:
   {
     "winner": "product title",
     "reasoning": "why this is best",
     "pros": { "product1": ["pro1", "pro2"], "product2": [...] },
     "cons": { "product1": ["con1"], "product2": [...] }
   }
5. Return JSON

Use claude-opus-4-6, max_tokens: 800.
```

---

## PHASE 9: SEO & PERFORMANCE (Days 27–32)

### Codex Prompt 1: Generate Sitemap
```
Generate src/app/sitemap.ts that:

1. Fetches all products: select { slug, updatedAt }
2. Fetches all categories: select { slug }
3. Returns MetadataRoute.Sitemap array with:
   - Base URL with priority 1, daily frequency
   - /deals with priority 0.8, daily
   - All /products/[slug] with priority 0.7, product.updatedAt
   - All /category/[slug] with priority 0.6, weekly

4. Use process.env.NEXT_PUBLIC_SITE_URL as base

Use Prisma, TypeScript, proper types.
```

### Codex Prompt 2: Generate Robots.txt
```
Generate src/app/robots.ts that:

1. Exports robots(): MetadataRoute.Robots
2. Allows all routes EXCEPT: /admin, /api
3. Disallow: ['/admin', '/api']
4. Sitemap: ${baseUrl}/sitemap.xml

TypeScript, proper exports.
```

### Antigravity Prompt: Update Layout with Metadata
```typescript
// In src/app/layout.tsx
// Replace exports with:
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://techdeals-ai.vercel.app'),
  title: {
    default: 'TechDeals AI - Best Tech Deals & Reviews',
    template: '%s | TechDeals AI',
  },
  description: 'Discover best tech deals powered by AI. Compare products, read reviews, and save money on smartphones, laptops, audio, cameras & more.',
  // Copilot will suggest the rest of the metadata object
}
```

---

## PHASE 10: DEPLOYMENT & LAUNCH (Days 33–40)

### Antigravity Prompt: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Follow prompts
```

### Antigravity Prompt: Create GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Antigravity Prompt: Run Production Migrations
```bash
npx prisma migrate deploy
```

### Antigravity Prompt: Add Google Analytics
```typescript
// In src/app/layout.tsx, in <head>:
import Script from 'next/script'

// Add to head:
<Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_ID" />
<Script id="ga" strategy="afterInteractive" dangerouslySetInnerHTML={{
  __html: `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-YOUR_ID');
  `
}} />
```

---

## 🎯 QUICK START TODAY

1. **Start Phase 0 RIGHT NOW:**
   ```bash
   # Create GitHub repo
   # Create Vercel account
   # Create Supabase project
   # ... follow Phase 0 checklist
   ```

2. **Use Antigravity Immediately:**
   - Open VS Code
   - Type `import` in any file
   - GitHub Copilot suggests completions
   - Press Tab to accept

3. **Use Codex for Complex Logic:**
   - Copy a prompt from above starting with "Codex Prompt"
   - Paste into this Claude conversation
   - Claude generates the complete code
   - Copy output to your file

4. **Track Progress:**
   - Check off items in the phase checklists
   - Move to next phase when ✅ all items done
   - Should take ~5-7 days per phase

---

## 📚 FILE QUICK REFERENCE

| Phase | Key Files Created |
|-------|------------------|
| 0 | `.env.local` |
| 1 | `tailwind.config.ts`, `globals.css`, `types/index.ts` |
| 2 | `prisma/schema.prisma`, `lib/prisma.ts`, `prisma/seed.ts` |
| 3 | `auth.ts`, `api/auth/[...nextauth]/route.ts`, `middleware.ts`, `login/page.tsx` |
| 4 | `components/public/HeroSection.tsx`, `ProductCard.tsx`, `CategoriesGrid.tsx`, `NewsletterForm.tsx` |
| 5 | `app/products/[slug]/page.tsx`, `api/products/[slug]/route.ts` |
| 6 | `api/products/route.ts`, `components/public/SearchFilters.tsx`, `deals/page.tsx` |
| 7 | `admin/layout.tsx`, `admin/page.tsx`, `components/admin/ProductForm.tsx` |
| 8 | `api/ai/summarize/route.ts`, `api/ai/seo/route.ts`, `api/ai/compare/route.ts` |
| 9 | `sitemap.ts`, `robots.ts`, Updated `layout.tsx` with metadata |
| 10 | Deploy to Vercel, GitHub Actions workflow, GA tracking |

---

## ✅ COMPLETION CHECKLIST

- [x] Phase 0: Foundation (all 6 accounts + tools)
- [x] Phase 1: Architecture (Next.js running)
- [x] Phase 2: Database (12 products seeded)
- [x] Phase 3: Auth (login working)
- [x] Phase 4: Homepage (hero + categories + newsletter)
- [x] Phase 5: Product pages (dynamic routes)
- [x] Phase 6: Search & filters (working)
- [x] Phase 7: Admin dashboard (CRUD working)
- [x] Phase 8: AI features (Claude integration)
- [x] Phase 9: SEO (sitemap + metadata)
- [x] Phase 10: Deployment (live on Vercel)

**Total Time: 40 days to launch** 🚀

---

Good luck! Use these prompts in order, and you'll have a live affiliate marketing website in 40 days.
