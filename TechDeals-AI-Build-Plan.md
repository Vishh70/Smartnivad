# TechDeals AI — Complete End-to-End Build Plan
### Using Google Antigravity + OpenAI Codex CLI (2026 Stack)

This is a full, phase-by-phase plan to build your free affiliate website. It is written slowly and simply so you can follow it even if you are not an expert coder yet. Every phase tells you **what** to build, **why** it matters, **exactly what to type into Antigravity**, and **exactly what to type into Codex CLI**, so you always know which tool to use and when.

---

## 0. First, understand your two tools (read this before starting)

You have two AI coding agents available. They are not competitors here — you will use them **together**, like two different workers with different strengths.

### Google Antigravity — your main builder
- A free, full agentic IDE from Google (built on a VS Code fork), powered by Gemini 3.
- Has a visual **Editor view** (normal coding) and a **Manager view** (a "mission control" where you watch agents work, see screenshots, browser previews, and task plans).
- It can control a real browser, take screenshots, click around your website, and verify it actually works — not just that the code compiles.
- Best for: scaffolding the whole project, building UI screen by screen, visually checking your glassmorphism design actually looks right, and big multi-file features.
- You can run it in three modes: **Manual** (approve every step — use this for auth/payments), **Checkpoint** (agent pauses at key moments — use this for most of the build), or **Autonomous** (agent runs the whole task alone — use this for repetitive boilerplate).

### OpenAI Codex CLI — your terminal specialist
- A free, open-source terminal agent (runs with `codex` command), now powered by GPT‑5.5.
- Lives in your terminal, not a visual window. Great at fast, precise, repetitive engineering work: writing Prisma schemas, fixing bugs across many files, writing tests, running builds, configuring deployment files.
- Can run multiple agents in parallel on different tasks (e.g., one agent writes the SEO system while another writes the admin dashboard).
- Best for: backend/database work, scripting, deployment configuration, security hardening, and any task you want to "fire and forget" in the background while you do something else.

### The simple rule for this whole project
> **Use Antigravity for anything you need to *see* (UI, design, pages, animations).**
> **Use Codex CLI for anything that's purely *logic and structure* (schema, APIs, SEO scripts, security, deployment configs).**

Both tools work on the same project folder on your computer, so they never conflict — they just take turns.

---

## 1. The full phase map (overview before we go deep)

| Phase | What you build | Main tool | Time estimate |
|---|---|---|---|
| 0 | Accounts & planning | You (no AI) | 1–2 hours |
| 1 | Project scaffolding | Antigravity | 1–2 hours |
| 2 | Database design (Supabase + Prisma) | Codex CLI | 2–3 hours |
| 3 | Authentication (Google login) | Antigravity (checkpoint mode) | 2–3 hours |
| 4 | Design system (glassmorphism theme) | Antigravity | 3–4 hours |
| 5 | Homepage + public pages | Antigravity | 4–6 hours |
| 6 | Admin dashboard (CRUD) | Antigravity + Codex CLI | 5–7 hours |
| 7 | Image uploads (Cloudinary) | Codex CLI | 1–2 hours |
| 8 | SEO automation system | Codex CLI | 3–4 hours |
| 9 | AI content generation features | Codex CLI | 2–3 hours |
| 10 | Security hardening | Codex CLI | 2 hours |
| 11 | Performance optimization | Antigravity + Codex CLI | 2–3 hours |
| 12 | Deployment (Vercel/Supabase/Cloudinary) | Codex CLI | 1–2 hours |
| 13 | Post-launch monitoring & scaling | Codex CLI | ongoing |

Total realistic first build: roughly **2–3 weekends** if you go slowly and check each phase before moving to the next. Do not rush — verify each phase actually works before starting the next one. This is the single most important habit for working with AI agents: **small steps, verify, then continue.**

---

## 2. Phase 0 — Accounts & Planning (do this yourself first)

Before touching any AI tool, create these free accounts. Keep all your login emails the same (use one Gmail) so everything connects easily later.

1. **GitHub** account — your code will live here.
2. **Vercel** account — sign up using "Continue with GitHub" (this is your free hosting).
3. **Supabase** account — sign up using GitHub (this is your free database).
4. **Cloudinary** account — free tier for image storage.
5. **Resend** account — free tier for sending newsletter/contact emails.
6. **Google Cloud Console** project — needed later for "Login with Google" (OAuth credentials).
7. Install on your computer:
   - **Node.js** (LTS version)
   - **Git**
   - **Google Antigravity** (download from Google's official site, free)
   - **Codex CLI** — install with: `npm install -g @openai/codex` (or via the official installer script — check OpenAI's docs for the current command since this updates often)
   - Sign in to Codex CLI with your ChatGPT account (Plus tier gives you Codex usage at no extra API cost).

**Deliverable for Phase 0:** all 6 accounts created, Node/Git/Antigravity/Codex installed, you can run `node -v`, `git --version`, and `codex --version` successfully in your terminal.

---

## 3. Phase 1 — Project Scaffolding

**Goal:** create the base Next.js project with the correct folder structure, TypeScript, and Tailwind already wired up.

### Step-by-step
1. Create an empty GitHub repository called `techdeals-ai`. Clone it to your computer.
2. Open the folder in **Antigravity**.
3. Switch Antigravity to **Checkpoint mode** (so it pauses and shows you what it's about to do before each big step).

### Exact prompt to give Antigravity
```
Scaffold a new Next.js 15 project inside this folder using TypeScript,
TailwindCSS, App Router, and ESLint. Use the following folder structure:

/app
  /(public)         -> homepage, product pages, category pages
  /(admin)          -> protected admin dashboard routes
  /api               -> route handlers
/components
  /ui                -> reusable glass cards, buttons, etc.
  /sections           -> homepage sections (Hero, Trending, Categories, etc.)
/lib                  -> helper functions (db client, seo helpers, ai helpers)
/prisma               -> schema.prisma
/public               -> static assets
/styles               -> globals.css

After scaffolding, install these dependencies:
@prisma/client, prisma, @supabase/supabase-js, next-auth, cloudinary,
resend, framer-motion, lucide-react, zod, react-hook-form

Do not start writing feature code yet — just confirm the project builds
and runs with `npm run dev`, and show me a screenshot of the default page.
```

4. Watch the Manager view. When Antigravity pauses to show you the plan, approve it.
5. When it's done, it should show you a browser screenshot of a working blank Next.js app. Confirm it looks right before moving on.

**Deliverable for Phase 1:** project runs locally with `npm run dev`, folder structure exists, all dependencies installed, first commit pushed to GitHub.

---

## 4. Phase 2 — Database Design (Supabase + Prisma)

**Goal:** design and create your database tables. This is precise, structural work — perfect for **Codex CLI**.

### Step-by-step
1. In Supabase, create a new project (free tier). Copy your database connection string and API keys into a `.env.local` file (Antigravity or Codex can help you create this file — never commit it to GitHub).
2. Open a terminal in your project folder and start Codex: `codex`

### Exact prompt to give Codex CLI
```
Write a complete prisma/schema.prisma file for an affiliate website with
PostgreSQL as the provider (connecting to Supabase). Include these models:

Product:
  id (uuid, primary key)
  title (string)
  slug (string, unique)
  description (text)
  shortSummary (text, nullable) -- for AI-generated summaries
  image (string) -- Cloudinary URL
  category (relation to Category)
  categoryId (string, foreign key)
  affiliateLink (string)
  affiliateNetwork (enum: AMAZON, FLIPKART, IMPACT, CJ, CLICKBANK)
  price (decimal)
  rating (float, default 0)
  pros (string array)
  cons (string array)
  specifications (json)
  featured (boolean, default false)
  seoTitle (string, nullable)
  seoDescription (string, nullable)
  seoKeywords (string array)
  views (int, default 0)
  createdAt (datetime, default now)
  updatedAt (datetime, auto-update)

Category:
  id (uuid, primary key)
  name (string)
  slug (string, unique)
  products (relation to Product, one-to-many)

AdminUser:
  id (uuid, primary key)
  email (string, unique)
  name (string)
  image (string, nullable)
  createdAt (datetime, default now)

NewsletterSubscriber:
  id (uuid, primary key)
  email (string, unique)
  subscribedAt (datetime, default now)

Add appropriate indexes on slug fields and categoryId for fast lookups.
After writing the schema, run `npx prisma format` to validate it, then
generate a migration and explain in plain English what each table is for.
```

3. Let Codex run `npx prisma migrate dev` to push the schema to Supabase. It will ask permission before running commands — approve it.
4. Open Supabase's table editor in your browser and confirm the tables now exist.

**Deliverable for Phase 2:** `prisma/schema.prisma` complete, tables visible in Supabase dashboard, `npx prisma studio` opens and shows empty tables.

---

## 5. Phase 3 — Authentication (Google Login for Admin)

**Goal:** only you (the admin) can log in and manage products. Public visitors never see a login screen.

### Step-by-step
1. In Google Cloud Console, create OAuth 2.0 credentials (Client ID + Secret) for a web application. Add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI (you'll add the live Vercel URL later too).
2. Add the keys to `.env.local`.
3. Switch Antigravity to **Manual mode** for this phase specifically — authentication is a sensitive area, so you want to approve every step.

### Exact prompt to give Antigravity
```
Implement authentication using NextAuth.js with the Google provider only.
Requirements:
- Only emails that exist in the AdminUser table (Prisma) may log in
  successfully; everyone else should see an "access denied" page.
- Store the session using JWT strategy.
- Create a middleware that protects every route under /app/(admin)/* —
  redirect unauthenticated users to a clean login page.
- Add a "Sign in with Google" button styled with our future glass design
  (use a simple placeholder style for now, we will theme it in Phase 4).
- Show me each file you create before writing it, and explain in one
  sentence what it does.
```

4. Test by logging in with your own Google account. Manually insert your email into the `AdminUser` table via Prisma Studio first, then confirm login works and a second, random Google account is denied.

**Deliverable for Phase 3:** you can log in with Google, reach `/admin`, and any other Google account is blocked. Logout works.

---

## 6. Phase 4 — Design System (Dark Glassmorphism Theme)

**Goal:** build the actual visual language before building pages, so every page automatically looks premium and consistent.

This phase is **all Antigravity**, because it can take real screenshots and visually verify the glass effect actually renders correctly (Codex cannot see images).

### Exact prompt to give Antigravity
```
Build our core design system in Tailwind + a small set of reusable React
components. Use these exact design tokens:

Background: #050816
Primary accent: #00E5FF
Secondary accent: #7C3AED
Glass surface: rgba(255,255,255,0.08) with backdrop-blur-xl
Border: 1px solid rgba(255,255,255,0.12)
Font: Inter for body, a bold geometric font for headings

Create these reusable components in /components/ui:
- GlassCard: a card with blur, soft border, and a glow on hover (lift +
  scale + subtle box-shadow in primary accent color)
- GlowButton: a pill button with gradient border and glow on hover
- AnimatedBackground: a fixed full-screen background with slow-moving
  blurred gradient blobs in primary/secondary colors, plus a subtle
  particle layer using a lightweight canvas or framer-motion effect
  (must not hurt performance — pause animation when tab is not visible)
- SectionHeading: consistent heading style for each homepage section

Build a single demo page at /design-preview showing all of these
components together so I can see them. Take a screenshot when done and
show it to me directly so I can approve the visual style before we use
it across the real site.
```

5. Look at the screenshot Antigravity shows you. If something looks off (too bright, too much blur, animation too fast), just tell it in plain English — e.g. *"make the glow softer and slow the background animation by half"* — and let it iterate. Do this until you're happy. This step matters most for the "premium" feel, so don't rush it.

**Deliverable for Phase 4:** a `/design-preview` page that visually matches your reference inspiration (Apple/Linear/Stripe-style), approved by you.

---

## 7. Phase 5 — Homepage & Public Pages

**Goal:** build every section of the real homepage plus the product detail page and category pages, using the components from Phase 4.

### Exact prompt to give Antigravity
```
Using the GlassCard, GlowButton, AnimatedBackground and SectionHeading
components from /components/ui, build the real homepage at /app/page.tsx
with these sections in order:

1. Hero — headline "Discover the Best Tech Products Powered by AI",
   subheadline "Compare, Review and Buy Smarter", a GlowButton CTA
   labeled "Explore Deals" that scrolls to Trending, AnimatedBackground
   behind it.
2. Trending Products — fetch the 8 most-viewed products from Prisma,
   show them as GlassCards in a responsive grid (4 columns desktop,
   2 tablet, 1 mobile).
3. Categories — grid of category cards (fetch from Prisma), each links
   to /category/[slug].
4. Top Deals — fetch products marked featured=true.
5. AI Recommendations — for now, just show 4 random products; we will
   make this smarter in Phase 9.
6. Newsletter — email input + submit button that calls a /api/newsletter
   route (build a simple API route that saves to NewsletterSubscriber
   table and validates the email with zod).
7. Footer — links, social icons, affiliate disclaimer text required by
   FTC guidelines: "As an Amazon Associate and affiliate partner, we
   earn from qualifying purchases."

Each GlassCard for a product must show: image, title, price, star
rating, and a "Buy Now" button that opens affiliateLink in a new tab.

Then build:
- /app/(public)/category/[slug]/page.tsx — grid of products in that
  category
- /app/(public)/product/[slug]/page.tsx — large image, description,
  pros/cons list, specifications table, Buy Now button, affiliate
  disclaimer, and related products at the bottom

Make every page fully responsive and verify on mobile width (375px) by
taking a screenshot before and after.
```

This will be the longest single phase — let Antigravity work in checkpoint mode and review each section as it's built rather than waiting for everything at once. Ask it to show a screenshot after each major section.

**Deliverable for Phase 5:** homepage, category page, and product page all working with real (test) data, looking correct on both desktop and mobile screenshots.

---

## 8. Phase 6 — Admin Dashboard (Product Management)

**Goal:** the screens only you will use, to add/edit/delete products and categories.

This phase splits naturally between both tools: **Antigravity builds the UI screens**, **Codex CLI builds the API routes and validation logic** underneath them. You can literally run them at the same time in two windows.

### Prompt for Antigravity (the screens)
```
Build the admin dashboard UI under /app/(admin)/admin/:
- /admin (overview): cards showing total products, total categories,
  newsletter subscriber count, and total product views, styled with
  GlassCard.
- /admin/products: a table of all products with edit/delete buttons and
  an "Add Product" button.
- /admin/products/new and /admin/products/[id]/edit: a form with fields
  Product Name, Image Upload, Description, Affiliate Link, Affiliate
  Network (dropdown), Category (dropdown), Price, Rating. Use
  react-hook-form with zod validation. Leave the image upload as a
  placeholder file input for now — Codex is wiring the real upload logic
  in parallel.
- /admin/categories: simple add/edit/delete list for categories.
Match the same glassmorphism theme used on the public site, but keep the
admin layout simpler and table-focused for fast scanning, with a
collapsible sidebar nav.
```

### Prompt for Codex CLI (the logic, run at the same time in a separate terminal)
```
Build the API layer for product management under /app/api/admin/:
- POST /api/admin/products — create a product, validate all fields with
  zod, require an authenticated admin session, auto-generate a URL-safe
  slug from the title (and ensure uniqueness by appending a number if a
  slug already exists).
- PUT /api/admin/products/[id] — update a product.
- DELETE /api/admin/products/[id] — delete a product (also delete its
  image from Cloudinary — leave a TODO comment, we'll wire Cloudinary in
  Phase 7).
- POST /api/admin/categories, PUT, DELETE — same pattern for categories.

Every route must:
1. Check the NextAuth session and reject with 401 if not an admin.
2. Validate input with zod and return clear error messages.
3. Wrap database writes in try/catch and return proper HTTP status codes.

Write a short test plan (not full automated tests yet, just a list of
curl commands) I can run manually to confirm each route works.
```

Run both prompts, then connect the two: tell Antigravity *"now wire the admin forms to call the API routes Codex just built, and show success/error toasts."*

**Deliverable for Phase 6:** you can add, edit, and delete a product entirely from your browser, and it appears instantly on the public homepage.

---

## 9. Phase 7 — Image Uploads (Cloudinary)

**Goal:** replace the placeholder file input with real image upload to Cloudinary, with proper validation.

### Exact prompt to give Codex CLI
```
Wire up Cloudinary image upload for the product form:
1. Create /app/api/admin/upload/route.ts that accepts a multipart image
   upload, validates it is a real image (check MIME type and re-encode/
   verify, not just trust the file extension), rejects files over 5MB,
   and uploads to Cloudinary using an "techdeals" upload preset.
2. Return the secure_url and store it in the Product.image field.
3. Update the admin product form to show a live preview thumbnail after
   upload and a loading spinner during upload.
4. When a product is deleted, also delete its image from Cloudinary
   using the stored public_id (you'll need to also store cloudinaryId
   on the Product model — add this field and run a migration).
5. Compress/resize images on upload using Cloudinary transformations so
   the site stays fast (max width 1200px, auto format, auto quality).
```

**Deliverable for Phase 7:** uploading an image in the admin form actually stores it on Cloudinary and the product shows the real image everywhere on the site.

---

## 10. Phase 8 — SEO Automation System

**Goal:** every product and category page should automatically be optimized for Google search without you doing manual SEO work each time.

### Exact prompt to give Codex CLI
```
Build a complete SEO system for the site:

1. /lib/seo.ts — a helper that generates Next.js Metadata objects
   (title, description, openGraph, twitter card) for any product or
   category, falling back to auto-generated text from the product data
   if seoTitle/seoDescription are empty.
2. Add generateMetadata() functions to the product page and category
   page using this helper.
3. Add JSON-LD structured data (schema.org Product type, with name,
   image, description, offers.price, aggregateRating) to every product
   page, rendered as a <script type="application/ld+json"> tag.
4. Create /app/sitemap.ts using Next.js's built-in sitemap generation,
   dynamically including every product and category page from Prisma.
5. Create /app/robots.ts allowing all crawlers and pointing to the
   sitemap, but disallowing /admin/*.
6. Add Open Graph image generation using Next.js's ImageResponse API so
   shared links on social media show a nice branded preview card.

After building this, explain in plain English how to verify it works
using Google's Rich Results Test and the sitemap URL.
```

**Deliverable for Phase 8:** view-source on any product page shows proper meta tags and JSON-LD; `/sitemap.xml` and `/robots.txt` load correctly.

---

## 11. Phase 9 — AI Content Generation Features

**Goal:** when you add a new product, AI helps you write the description, pros/cons, and SEO text automatically — this is the "powered by AI" part of your brand.

### Exact prompt to give Codex CLI
```
Add an AI-assist feature to the admin product form:
1. Create /app/api/admin/ai-generate/route.ts that accepts a product
   title and a few keywords, and calls an LLM API to generate:
   - a short product summary (2 sentences)
   - a longer description (1 paragraph)
   - 3 pros and 3 cons as arrays
   - an SEO title (under 60 characters)
   - an SEO meta description (under 155 characters)
   - 5 SEO keywords
   Return this as structured JSON (use a strict JSON schema / structured
   output mode so it never returns broken formatting).
2. Add a "Generate with AI" button next to each of these fields in the
   admin form, which calls this route and fills the fields in — but
   always let me edit the result before saving, never auto-save AI text
   without my review.
3. Add basic rate limiting to this route (max 20 calls per hour per
   admin) so it can't be abused and doesn't run up API costs.
4. Use environment variables for the API key so it's never hardcoded.
```

> Note: this feature calls a paid LLM API per generation (a few cents each at most). Everything else in this stack is free, but this one feature has a tiny ongoing cost — that's normal and unavoidable for "AI-generated content," so budget a few dollars a month for it as you scale.

**Deliverable for Phase 9:** clicking "Generate with AI" in the admin form fills in a draft description, pros/cons, and SEO fields that you can edit before publishing.

---

## 12. Phase 10 — Security Hardening

**Goal:** protect your site from spam, abuse, and basic attacks before it goes live.

### Exact prompt to give Codex CLI
```
Harden this Next.js application for production:
1. Add security headers in next.config.js (Content-Security-Policy,
   X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
   Strict-Transport-Security).
2. Add rate limiting middleware on all /api/* routes using a simple
   in-memory or Upstash-based limiter (free tier), especially the
   newsletter signup and AI generation routes, to prevent spam.
3. Validate and sanitize every form input with zod on both client and
   server side — never trust client-side validation alone.
4. Ensure all admin routes check authentication server-side, not just
   by hiding UI elements.
5. Add CSRF protection guidance for NextAuth (confirm it's already
   enabled, since NextAuth handles this by default).
6. Scan for any place affiliate links or user input is rendered as raw
   HTML and confirm there is no XSS risk (we should never use
   dangerouslySetInnerHTML on user-provided content).
7. Add a .env.example file listing every required environment variable
   WITHOUT real values, so I never accidentally commit real secrets.
8. Confirm .env.local is in .gitignore.
Give me a short security checklist summary at the end.
```

**Deliverable for Phase 10:** a written checklist confirming headers, rate limits, and input validation are all in place, and you've manually confirmed `.env.local` is never committed to GitHub.

---

## 13. Phase 11 — Performance Optimization

**Goal:** hit the Lighthouse 95+ / sub-1-second load targets.

This is a back-and-forth phase: Codex does the technical optimization, Antigravity visually verifies nothing broke.

### Exact prompt to give Codex CLI
```
Optimize this Next.js app for performance:
1. Ensure all images use next/image with proper width/height and
   priority only on above-the-fold images.
2. Add loading.tsx skeleton states for product/category pages.
3. Convert any client components that don't need interactivity back to
   server components.
4. Lazy-load the AnimatedBackground component and any below-the-fold
   sections using dynamic imports.
5. Add caching headers / revalidate intervals to product and category
   pages using Next.js's fetch caching or generateStaticParams where it
   makes sense (most product pages can be statically generated and
   revalidated every hour).
6. Run a production build (`npm run build`) and report the bundle size
   per route, flagging anything unusually large.
```

### Then ask Antigravity
```
Run a Lighthouse audit on the homepage and the product page in the
built/preview version of the site. Show me the scores and a screenshot.
If any score is below 90, tell me the top 3 specific fixes needed.
```

**Deliverable for Phase 11:** Lighthouse performance and SEO scores both above 90 on homepage and a product page, confirmed by screenshot.

---

## 14. Phase 12 — Deployment (Going Live, Free)

**Goal:** push the live site to the internet on free infrastructure.

### Exact prompt to give Codex CLI
```
Prepare this project for production deployment on Vercel:
1. Confirm vercel.json (if needed) and next.config.js are production-
   ready.
2. List every environment variable that needs to be set in the Vercel
   project dashboard (database URL, NextAuth secret/URL, Google OAuth
   client ID/secret, Cloudinary keys, Resend API key, AI API key).
3. Write a DEPLOYMENT.md file with exact step-by-step instructions:
   - connecting the GitHub repo to Vercel
   - adding environment variables
   - running the Prisma migration against the production Supabase
     database
   - updating the Google OAuth redirect URI to the live Vercel URL
   - setting a custom domain (optional, also free if you already own
     one, otherwise the *.vercel.app URL works for free)
4. Confirm the build command and output settings are correct for Next.js
   on Vercel (this is usually automatic, but verify).
```

Then actually do the deployment:
1. Push your final code to GitHub.
2. Import the repo into Vercel.
3. Paste in the environment variables exactly as listed in `DEPLOYMENT.md`.
4. Deploy. Vercel gives you a live `*.vercel.app` URL.
5. Run the Prisma migration against your **production** Supabase database (Codex can give you the exact command).
6. Update your Google OAuth credentials with the new live redirect URI.
7. Visit your live site and test: homepage loads, login works, you can add a product, the new product appears on the live homepage.

**Deliverable for Phase 12:** a real, public URL where anyone can visit your site, and you can log in and manage products from anywhere.

---

## 15. Phase 13 — Post-Launch: Monitoring & Scaling

This is ongoing, not a one-time phase.

1. **Google Analytics** — ask Codex CLI: *"Add Google Analytics 4 tracking to this Next.js app using the official next/third-parties package, respecting cookie consent."*
2. **Google Search Console** — manually submit your `sitemap.xml` so Google starts indexing your pages.
3. **Monitor free-tier limits** — Supabase, Cloudinary, and Vercel all have free-tier usage caps. Check their dashboards monthly. If you're approaching limits, that's actually a good problem (it means traffic is growing) and a sign to consider a small paid tier.
4. **Weekly content additions** — the more real products you add, the more pages Google can index and rank.

### Future feature roadmap (build these one at a time, later, once the core site is stable)
- AI product comparison tool (compare 2–3 products side by side)
- AI price tracking + price-drop alerts
- Telegram/WhatsApp deal alert bot
- Auto-generated blog posts about product categories (great for SEO)
- Multi-vendor affiliate link management dashboard
- AI shopping assistant chatbot widget

For each of these later features, follow the same pattern you used throughout this whole plan: **describe the feature in plain English to Antigravity or Codex, review what it proposes, approve in checkpoints, and verify visually before moving on.**

---

## 16. A few habits that will save you the most time

1. **Never let an agent run fully autonomous on auth, payments, or deployment secrets.** Use Manual or Checkpoint mode for those phases specifically.
2. **Always ask for a screenshot** after any visual change in Antigravity — don't trust "it's done" without seeing it.
3. **Commit to GitHub after every successful phase.** If a later phase breaks something, you can always go back.
4. **Keep `.env.local` out of GitHub, always.** Both tools will respect `.gitignore` if it's set up correctly in Phase 1 — double check it.
5. **One phase at a time.** Resist the urge to paste the entire original mega-prompt into one tool in one go — agents (and you) do much better work in focused, verifiable steps, which is exactly why this plan is broken into 13 phases instead of one giant request.

Good luck — take this one phase at a time, and you'll have a genuinely premium, fully free affiliate site live and indexed within a few weeks of steady, unrushed work.
