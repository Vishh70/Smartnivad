# TechDeals AI: Complete Implementation Guide
## 40-Day Roadmap with Antigravity (GitHub Copilot) + Codex (Claude API) Prompts

---

## 📊 PROJECT OVERVIEW

**Project Name:** TechDeals AI  
**Vision:** 100% free affiliate marketing website with AI-powered product insights  
**Target:** Launch in 40 days, monetize from Day 1  
**Stack:** Next.js 15 + Supabase + Cloudinary + Claude API + Vercel  
**Business Model:** Multi-channel affiliate (Amazon, Flipkart, Impact, CJ Affiliate)

### Free Tier Limits & Scalability
- **Visitors/Month:** 0 → 100K+ on free tiers
- **Hosting:** Vercel (unlimited serverless functions)
- **Database:** Supabase 500MB free (stores ~5K products)
- **Images:** Cloudinary 25GB free (covers 10K+ products)
- **Email:** Resend 3K/month free
- **Cost at 100K visitors:** ~$20-30/month

---

## 🚀 PHASE 0: FOUNDATION SETUP (Days 0–1)

### Goal
Create all 6 free accounts and install every development tool **before writing a single line of code**.

### Step-by-Step

#### 1. GitHub Account + Repository
```
1. Go to github.com → Sign up
2. Create new repository: techdeals-ai
3. Private visibility (for now)
4. Initialize with README
5. Clone to your machine: git clone https://github.com/[username]/techdeals-ai.git
6. cd techdeals-ai
```

#### 2. Vercel Account
```
1. Go to vercel.com → Sign up with GitHub
2. Connect your GitHub account
3. Save your Vercel dashboard URL
4. Go to Settings → Personal Account → API Tokens → Create token
5. Save this token for later (needed for deployment)
```

#### 3. Supabase Project
```
1. Go to supabase.com → Sign up
2. New Project → Name: techdeals-ai
3. Region: Singapore (Asia-Pacific) — closest to India users
4. Create database
5. Go to Settings → Database → Connection string
6. Copy TWO strings:
   - DATABASE_URL (pooler URL) — for .env
   - DIRECT_URL (connection string) — for .env
7. Keep the database password safe!
```

**⚠️ Critical:** Supabase needs TWO connection strings:
- `DATABASE_URL` = pooling URL (for runtime)
- `DIRECT_URL` = direct connection (for migrations)

#### 4. Cloudinary Account
```
1. Go to cloudinary.com → Sign up (free tier)
2. Dashboard → Settings → API Key
3. Copy and save:
   - Cloud Name: cloudinary.com/[YOUR_CLOUD_NAME]
   - API Key: (copy)
   - API Secret: (copy)
```

#### 5. Google Cloud OAuth
```
1. console.cloud.google.com → Create new project
2. Name: TechDeals AI
3. APIs & Services → Credentials
4. Create OAuth 2.0 Client ID (Web Application)
5. Authorized redirect URIs — add BOTH:
   - http://localhost:3000/api/auth/callback/google
   - https://techdeals-ai.vercel.app/api/auth/callback/google (we'll update this later)
6. Save Client ID and Client Secret
```

#### 6. Resend Email Account
```
1. Go to resend.com → Sign up
2. Create API Key
3. Add sender domain: noreply@techdeals-ai.com (free tier allows subdomain)
4. Copy API Key
```

#### 7. Local Development Setup
```bash
# Install Node.js 20+
node --version  # should show v20.x.x or higher

# Install VS Code (if not already)
# https://code.visualstudio.com

# Install GitHub Copilot extension in VS Code
# Extensions → search "GitHub Copilot" → Install → Sign in with GitHub

# Install Git
git --version

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "you@gmail.com"
```

#### 8. Create .env.local (Keep This Safe!)
```
# In your techdeals-ai folder, create .env.local
# NEVER commit this to GitHub!

# Database (Supabase)
DATABASE_URL="postgresql://postgres.[project]:[password]@pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Authentication
AUTH_SECRET="openssl rand -base64 32"  # Generate this: openssl rand -base64 32
GOOGLE_CLIENT_ID="123456.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxx"
ADMIN_EMAIL="your-exact-email@gmail.com"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="123456"
CLOUDINARY_API_SECRET="xxxxx"

# AI (Claude)
ANTHROPIC_API_KEY="sk-ant-xxxxx"

# Email (Resend)
RESEND_API_KEY="re_xxxxx"

# Site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

#### 9. Verify All Accounts Work
```bash
# Test Supabase connection
psql "postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres"
# Should connect (type \q to exit)

# Test Node.js + npm
npm --version  # should show v10.x or higher
```

### ✅ Phase 0 Deliverables
- [ ] GitHub repo cloned locally
- [ ] Vercel account connected to GitHub
- [ ] Supabase project created (with 2 connection strings)
- [ ] Cloudinary account with API credentials
- [ ] Google OAuth credentials (Client ID + Secret)
- [ ] Resend API key created
- [ ] Node.js 20+, VS Code, GitHub Copilot installed
- [ ] .env.local created and saved locally

---

## 🏗️ PHASE 1: PROJECT ARCHITECTURE (Days 1–2)

### Goal
Initialize Next.js 15 with TypeScript, set up glassmorphism Tailwind theme, create folder structure.

### Step 1: Create Next.js 15 App

```bash
npx create-next-app@latest techdeals-ai \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --eslint

# Answer the prompts:
# ✓ Use TypeScript? → Yes
# ✓ Use Tailwind CSS? → Yes
# ✓ Use App Router? → Yes
# ✓ Use src/ directory? → Yes
# ✓ Use ESLint? → Yes
# ✗ Import alias? → No

cd techdeals-ai
npm run dev
# Should show: Local: http://localhost:3000
```

### Step 2: Install Core Dependencies

```bash
npm install @prisma/client prisma next-auth@beta @auth/prisma-adapter cloudinary @tanstack/react-query zustand lucide-react framer-motion @anthropic-ai/sdk resend
```

**What each package does:**
- `@prisma/client` — Type-safe database queries
- `prisma` — Database migrations & schema management
- `next-auth@beta` — Google OAuth authentication
- `@auth/prisma-adapter` — NextAuth + Prisma integration
- `cloudinary` — Image upload & optimization
- `@tanstack/react-query` — Server state management
- `zustand` — Client state (lightweight)
- `lucide-react` — Icon library (will use Tabler instead in final)
- `framer-motion` — Smooth animations
- `@anthropic-ai/sdk` — Claude API integration
- `resend` — Email service

### Step 3: Install Dev Dependencies

```bash
npm install -D @types/node prettier eslint-config-prettier
```

### Step 4: Create Folder Structure

```bash
# Run this from project root
mkdir -p src/components/{ui,admin,public}
mkdir -p src/lib src/types
mkdir -p src/app/api/{auth,products,categories,upload,ai,track,newsletter}
mkdir -p src/app/{products,admin,login}
mkdir -p prisma
```

**Folder structure explanation:**
```
techdeals-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/    ← Google OAuth routes
│   │   │   ├── products/              ← Product API endpoints
│   │   │   ├── ai/                    ← Claude API endpoints
│   │   │   ├── upload/                ← Cloudinary upload
│   │   │   └── newsletter/            ← Resend email
│   │   ├── login/                     ← Google login page
│   │   ├── admin/                     ← Admin dashboard
│   │   ├── products/[slug]/           ← Dynamic product pages
│   │   ├── page.tsx                   ← Homepage
│   │   └── layout.tsx                 ← Root layout
│   ├── components/
│   │   ├── ui/                        ← Reusable buttons, cards, forms
│   │   ├── admin/                     ← Admin-only components
│   │   └── public/                    ← Public site components
│   ├── lib/
│   │   ├── prisma.ts                  ← Prisma singleton
│   │   ├── utils.ts                   ← Helper functions
│   │   ├── constants.ts               ← Site-wide constants
│   │   └── queries.ts                 ← Database queries
│   ├── types/
│   │   └── index.ts                   ← TypeScript interfaces
│   └── styles/                        ← Global CSS (if needed)
├── prisma/
│   ├── schema.prisma                  ← Database schema
│   └── seed.ts                        ← Sample data
├── .env.local                         ← Secret credentials (not in git)
├── .gitignore
├── package.json
└── tsconfig.json
```

### Step 5: Configure Tailwind Glassmorphism Theme

#### Using Antigravity (GitHub Copilot)

In VS Code:
1. Open `tailwind.config.ts`
2. Type the following, then press **Tab** to let Copilot suggest the rest:

```typescript
// tailwind.config.ts
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

**Important:** After this configuration, you can type CSS utility names like:
- `.bg-bg` (dark background)
- `.bg-primary` (cyan)
- `.bg-glass-card` (with blur effect)
- `.animate-glow-pulse` (pulsing glow effect)

### Step 6: Create Global Styles

**File:** `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS Variables */
:root {
  --primary: #00E5FF;
  --secondary: #7C3AED;
  --bg: #050816;
  --bg-secondary: #0a0a1f;
  --glass-bg: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(255, 255, 255, 0.12);
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg);
}

::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary);
}

/* Selection color */
::selection {
  background: rgba(0, 229, 255, 0.3);
  color: #fff;
}

/* Base styles */
body {
  @apply bg-bg text-white font-sans;
}

html {
  scroll-behavior: smooth;
}

/* Glass card utility */
.glass-card {
  @apply backdrop-blur-lg bg-glass-card border border-glass-border rounded-2xl;
}

.glass-border {
  @apply border border-glass-border;
}

.gradient-text {
  @apply bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent;
}

.neon-border {
  @apply border border-primary shadow-glow-cyan;
}
```

### Step 7: Create TypeScript Types

**File:** `src/types/index.ts`

Using **Antigravity (Copilot)**, type:

```typescript
// src/types/index.ts

// Let Copilot autocomplete these interfaces
export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  affiliateLink: string;
  categoryId: string;
  category?: Category;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  featured: boolean;
  clicks: number;
  seoTitle?: string;
  seoDesc?: string;
  pros: string[];
  cons: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  products?: Product[];
  createdAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
```

### Step 8: Test It Works

```bash
npm run dev
# Visit http://localhost:3000
# Should see default Next.js page
```

**Then press Ctrl+C to stop** — we'll build on this in Phase 2.

### ✅ Phase 1 Deliverables
- [ ] Next.js 15 running at localhost:3000
- [ ] Glassmorphism Tailwind theme configured
- [ ] Folder structure created
- [ ] Global CSS with dark mode styles
- [ ] TypeScript types defined
- [ ] GitHub Copilot working (tested with autocomplete)

---

## 🗄️ PHASE 2: DATABASE & PRISMA (Days 3–4)

### Goal
Set up Supabase PostgreSQL + Prisma ORM. Create 4 database tables. Seed 12 sample products.

### Step 1: Initialize Prisma

```bash
npx prisma init --datasource-provider postgresql
```

This creates:
- `prisma/schema.prisma` — Database schema
- `.env.local` gets updated with `DATABASE_URL`

### Step 2: Configure Supabase Connection

**Edit `prisma/schema.prisma`:**

Replace the datasource block at the top with:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

**The `directUrl` is CRITICAL for Supabase!** It avoids connection pooling conflicts during migrations.

### Step 3: Define Database Schema

**File:** `prisma/schema.prisma`

Using **Codex (Claude API)**, use this prompt:

```
Generate a complete Prisma schema for TechDeals AI with:

Models:
1. Product: id (cuid @id), slug (unique), title, description, image, affiliateLink, categoryId, price (Float), originalPrice (Float?), discount (Int?), rating (Float @default(0)), featured (Boolean @default(false)), clicks (Int @default(0)), seoTitle (String?), seoDesc (String?), pros (String[]), cons (String[]), tags (String[]), createdAt, updatedAt. Add relations to Category. Add indexes on slug, categoryId, featured, createdAt.

2. Category: id (cuid @id), slug (unique), name (String), icon (String?), description (String?), products (Product[] relation), createdAt.

3. Admin: id (cuid @id), email (unique), name (String?), image (String?), createdAt.

4. NewsletterSubscriber: id (cuid @id), email (unique), subscribedAt.

Output valid Prisma schema. Include all necessary lines: model definitions, field types, attributes (@id, @unique, @default, @updatedAt, @relation, @@index).
```

**Copy the output and paste into `prisma/schema.prisma`**

Full example:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Product {
  id            String   @id @default(cuid())
  slug          String   @unique
  title         String
  description   String   @db.Text
  image         String
  affiliateLink String
  categoryId    String
  category      Category @relation(fields: [categoryId], references: [id])
  price         Float
  originalPrice Float?
  discount      Int?
  rating        Float    @default(0)
  featured      Boolean  @default(false)
  clicks        Int      @default(0)
  seoTitle      String?
  seoDesc       String?  @db.Text
  pros          String[]
  cons          String[]
  tags          String[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([slug])
  @@index([categoryId])
  @@index([featured])
  @@index([createdAt])
}

model Category {
  id          String    @id @default(cuid())
  slug        String    @unique
  name        String
  icon        String?
  description String?   @db.Text
  products    Product[]
  createdAt   DateTime  @default(now())

  @@index([slug])
}

model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  createdAt DateTime @default(now())
}

model NewsletterSubscriber {
  id           String   @id @default(cuid())
  email        String   @unique
  subscribedAt DateTime @default(now())
}
```

### Step 4: Run First Migration

```bash
npx prisma migrate dev --name init
```

This will:
1. Create all tables in Supabase PostgreSQL
2. Generate Prisma Client
3. Ask if you want to seed the database (say "no" for now)

**Check it worked:** Go to Supabase dashboard → Table Editor. You should see:
- `Product`
- `Category`
- `Admin`
- `NewsletterSubscriber`

### Step 5: Create Prisma Client Singleton

**File:** `src/lib/prisma.ts`

Using **Antigravity (Copilot)**, type:

```typescript
// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

**Why this matters:** Next.js hot-reloading creates multiple Prisma instances. This singleton prevents connection pooling errors.

### Step 6: Seed Sample Data

**File:** `prisma/seed.ts`

Using **Codex (Claude API)**, use this prompt:

```
Generate a Prisma seed.ts file for TechDeals AI with:

5 categories: Smartphones, Laptops, Audio, Cameras, Accessories
12 products with Indian tech brands:
- Samsung Galaxy S24 (Smartphones, ₹79999, rating 4.8)
- OnePlus 12 (Smartphones, ₹64999, rating 4.7)
- MacBook Air M3 (Laptops, ₹134999, rating 4.9)
- Dell XPS 15 (Laptops, ₹149999, rating 4.8)
- Sony WH-1000XM5 (Audio, ₹29999, rating 4.6)
- JBL Charge 5 (Audio, ₹16999, rating 4.5)
- Sony Alpha ZV-E10 (Cameras, ₹65999, rating 4.7)
- Canon EOS M50 (Cameras, ₹54999, rating 4.5)
- Apple Watch SE (Accessories, ₹24999, rating 4.4)
- Mi Band 8 (Accessories, ₹4999, rating 4.3)
- Samsung Galaxy Buds2 (Accessories, ₹11999, rating 4.4)
- Logitech MX Keys (Accessories, ₹19999, rating 4.6)

For each product:
- description: 80-100 words
- affiliateLink: https://amzn.to/[slug]
- pros: array of 5 items
- cons: array of 3 items
- tags: array of 6-8 keywords
- featured: mark 3 products as true

Use prisma.upsert with slug as unique key. Include async main() with try/catch/$disconnect().
```

**Paste the output into `prisma/seed.ts`**

Example structure (let Claude generate the full details):

```typescript
import { prisma } from '../src/lib/prisma'

async function main() {
  // Create categories
  const categories = [
    { name: 'Smartphones', slug: 'smartphones' },
    { name: 'Laptops', slug: 'laptops' },
    // ... more
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // Create products
  const products = [
    {
      slug: 'samsung-galaxy-s24',
      title: 'Samsung Galaxy S24',
      description: '...',
      // ... more fields
    },
    // ... more products
  ]

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

### Step 7: Run the Seed

```bash
npx tsx prisma/seed.ts
```

Or add to `package.json`:

```json
"scripts": {
  "seed": "tsx prisma/seed.ts"
}
```

Then: `npm run seed`

### Step 8: Verify Data in Prisma Studio

```bash
npx prisma studio
# Opens at http://localhost:5555
```

You should see:
- 5 categories
- 12 products (with images, prices, ratings, etc.)

### ✅ Phase 2 Deliverables
- [ ] Supabase tables created (via Prisma migration)
- [ ] `prisma/schema.prisma` with all 4 models
- [ ] `src/lib/prisma.ts` singleton created
- [ ] `prisma/seed.ts` with 12 sample products
- [ ] Prisma Studio shows all data
- [ ] No migration errors

---

## 🔐 PHASE 3: AUTHENTICATION (Days 5–6)

### Goal
NextAuth v5 with Google OAuth. Only admins can access /admin routes.

### Step 1: Get Google Credentials

From Phase 0, you should have:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Update your `.env.local`:

```
GOOGLE_CLIENT_ID=your-id-here
GOOGLE_CLIENT_SECRET=your-secret-here
ADMIN_EMAIL=your-exact@gmail.com
```

### Step 2: Generate AUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output and add to `.env.local`:

```
AUTH_SECRET=your-generated-secret-here
```

### Step 3: Create NextAuth Config

**File:** `src/auth.ts`

Using **Codex (Claude API)**, use this prompt:

```
Generate a NextAuth v5 configuration for Next.js 15 with:

1. Google OAuth provider (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
2. Prisma adapter
3. Admin authentication: only allow users whose email matches ADMIN_EMAIL
4. Custom pages: login at /login
5. Callbacks: authorized() checks email against ADMIN_EMAIL
6. Session: jwt strategy
7. Events: log signin

Output src/auth.ts with all imports, providers array, callbacks object, pages object, events object. Use TypeScript.
```

**Paste the output and save as `src/auth.ts`**

Example structure:

```typescript
// src/auth.ts
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ request, auth }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
      if (isAdminRoute) {
        return !!auth?.user?.email === process.env.ADMIN_EMAIL
      }
      return true
    },
  },
  events: {
    async signIn({ user }) {
      console.log(`User signed in: ${user.email}`)
    },
  },
})
```

### Step 4: Create Auth API Route

**File:** `src/app/api/auth/[...nextauth]/route.ts`

This is minimal (just 2 lines):

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth'
export const { GET, POST } = handlers
```

### Step 5: Create Middleware (Protect /admin)

**File:** `middleware.ts` (NOT in `src/` — at project root)

Using **Antigravity (Copilot)**, type:

```typescript
// middleware.ts (at project root, NOT src/)
import { auth } from './src/auth'

export const middleware = auth

export const config = {
  matcher: ['/admin/:path*'],
}
```

This protects all `/admin/*` routes.

### Step 6: Create Login Page

**File:** `src/app/login/page.tsx`

Using **Codex (Claude API)**, use this prompt:

```
Generate a glassmorphism login page (src/app/login/page.tsx) for NextAuth with:

1. Dark premium background (#050816)
2. Centered glass card with glassmorphism effect
3. "TechDeals AI Admin" heading
4. "Sign in with Google" button (blue/cyan color)
5. Tailwind CSS only (no inline CSS)
6. Use next-auth signIn() function with 'google' provider
7. Responsive mobile-first design
8. Import signIn from next-auth/react

Include proper TypeScript, error handling for sign-in, and redirect logic.
```

**Paste the output and save**

Example structure:

```typescript
// src/app/login/page.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await signIn('google', { redirect: true, callbackUrl: '/admin' })
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="glass-card max-w-md w-full p-8">
        <h1 className="text-3xl font-bold mb-2 text-center gradient-text">
          TechDeals AI
        </h1>
        <p className="text-center text-gray-400 mb-8">Admin Login</p>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-primary text-bg font-semibold py-3 rounded-lg hover:bg-primary-light transition neon-border"
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  )
}
```

### Step 7: Create Session Provider (for signIn/signOut)

**File:** `src/components/ui/SessionProvider.tsx`

```typescript
// src/components/ui/SessionProvider.tsx
'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
```

### Step 8: Update Root Layout

**File:** `src/app/layout.tsx`

Wrap children with SessionProvider:

```typescript
import { SessionProvider } from '@/components/ui/SessionProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
```

### Step 9: Test Authentication

```bash
npm run dev
```

1. Visit `http://localhost:3000/login`
2. Click "Sign in with Google"
3. You'll be redirected to Google
4. After approval, you'll land on `/admin` (or `/` if email doesn't match ADMIN_EMAIL)

**If email doesn't match**, you'll get a 401 error. This is correct — only your email is allowed.

### ✅ Phase 3 Deliverables
- [ ] NextAuth v5 configured (`src/auth.ts`)
- [ ] Auth API route created
- [ ] Middleware protects `/admin` routes
- [ ] Google OAuth login page working
- [ ] SessionProvider wraps app
- [ ] Login/logout working with email verification

---

## 🏠 PHASE 4: PUBLIC HOMEPAGE (Days 7–9)

### Goal
Build hero section, trending products, categories grid, newsletter signup.

### Step 1: Create Homepage Components

**File:** `src/components/public/HeroSection.tsx`

Using **Antigravity (Copilot)**, let it generate:

```typescript
// src/components/public/HeroSection.tsx
'use client'

import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-bg flex items-center justify-center overflow-hidden">
      {/* Animated background particles (optional) */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-glow-pulse"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-glow-pulse"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <motion.div
        className="relative z-10 text-center max-w-3xl px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
          TechDeals AI
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-4">
          Discover the best tech products powered by AI
        </p>
        <p className="text-lg text-gray-400 mb-8">
          Compare, review, and buy smarter
        </p>

        <motion.a
          href="#deals"
          className="inline-block bg-primary text-bg font-bold py-4 px-8 rounded-lg neon-border hover:bg-primary-light transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Deals
        </motion.a>
      </motion.div>
    </section>
  )
}
```

### Step 2: Create ProductCard Component

**File:** `src/components/public/ProductCard.tsx`

```typescript
// src/components/public/ProductCard.tsx
import { Product } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export function ProductCard({ product }: { product: Product }) {
  const discountPercent = product.discount || 0

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="glass-card group hover:neon-border transition p-0 overflow-hidden h-full cursor-pointer">
        <div className="relative w-full h-48 bg-gray-800">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition"
          />
          {discountPercent > 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full font-bold">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg line-clamp-2 mb-2">{product.title}</h3>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-primary text-xl font-bold">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-sm">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 mb-3">
            <span className="text-yellow-400">★</span>
            <span className="text-sm">{product.rating} ({product.rating * 100})</span>
          </div>

          <button className="w-full bg-primary text-bg font-semibold py-2 rounded-lg hover:bg-primary-light transition">
            View Deal
          </button>
        </div>
      </div>
    </Link>
  )
}
```

### Step 3: Create Categories Grid

**File:** `src/components/public/CategoriesGrid.tsx`

Using **Antigravity (Copilot)**, generate:

```typescript
// src/components/public/CategoriesGrid.tsx
import { Category } from '@/types'
import Link from 'next/link'

export async function CategoriesGrid() {
  // Later: fetch from API
  const categories: Category[] = [
    { id: '1', slug: 'smartphones', name: 'Smartphones' },
    { id: '2', slug: 'laptops', name: 'Laptops' },
    { id: '3', slug: 'audio', name: 'Audio' },
    { id: '4', slug: 'cameras', name: 'Cameras' },
    { id: '5', slug: 'accessories', name: 'Accessories' },
  ]

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-12 gradient-text">Categories</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="glass-card p-6 text-center hover:neon-border transition group"
          >
            <div className="text-4xl mb-3 group-hover:animate-float">📱</div>
            <h3 className="font-bold text-sm">{cat.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

### Step 4: Create Newsletter Signup

**File:** `src/components/public/NewsletterForm.tsx`

```typescript
// src/components/public/NewsletterForm.tsx
'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSuccess(true)
        setEmail('')
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto glass-card p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 gradient-text">
          Get the Best Deals First
        </h2>
        <p className="text-gray-300 mb-8">
          Subscribe to our newsletter and never miss a deal
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg border border-glass-border focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-bg font-bold px-6 py-3 rounded-lg hover:bg-primary-light transition disabled:opacity-50"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {success && (
          <p className="text-green-400 mt-4">✓ Check your email!</p>
        )}
      </div>
    </section>
  )
}
```

### Step 5: Update Homepage

**File:** `src/app/page.tsx`

```typescript
// src/app/page.tsx
import { HeroSection } from '@/components/public/HeroSection'
import { CategoriesGrid } from '@/components/public/CategoriesGrid'
import { NewsletterForm } from '@/components/public/NewsletterForm'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategoriesGrid />
      <NewsletterForm />
    </main>
  )
}
```

### ✅ Phase 4 Deliverables
- [ ] Hero section with animations
- [ ] Trending products carousel (placeholder)
- [ ] Categories grid (6 categories)
- [ ] Newsletter signup form
- [ ] Mobile-first responsive design
- [ ] All components use glassmorphism

---

## 📄 PHASE 5: PRODUCT PAGES (Days 10–12)

### Goal
Dynamic `/products/[slug]` pages with SSG, affiliate links, reviews.

### Step 1: Create Product Detail Page

**File:** `src/app/products/[slug]/page.tsx`

Using **Codex (Claude API)**, use this prompt:

```
Generate a Next.js 15 product detail page (src/app/products/[slug]/page.tsx) with:

1. Dynamic slug parameter
2. Fetch product by slug using Prisma
3. Display: image, title, price, originalPrice, discount%, rating, description
4. Show pros and cons in expandable sections
5. "Buy on Amazon" and "Buy on Flipkart" buttons
6. Affiliate disclaimer at bottom
7. Related products (3 products from same category)
8. Generate SEO metadata (generateMetadata function)
9. Handle 404 if product not found

Use TypeScript, Next.js Image component, and Tailwind CSS.
```

**Example structure:**

```typescript
// src/app/products/[slug]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  })

  if (!product) return {}

  return {
    title: product.seoTitle || product.title,
    description: product.seoDesc,
    openGraph: {
      images: [product.image],
    },
  }
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany()
  return products.map((p) => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  })

  if (!product) notFound()

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="glass-card p-4">
            <Image
              src={product.image}
              alt={product.title}
              width={500}
              height={500}
              className="w-full rounded-lg"
            />
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>

            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-4xl font-bold text-primary">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xl line-through text-gray-400">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {discount > 0 && (
                <span className="bg-red-600 px-3 py-1 rounded-full text-white font-bold">
                  Save {discount}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">★</span>
              <span className="text-xl">{product.rating} / 5</span>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-lg mb-6">{product.description}</p>

            {/* Pros */}
            {product.pros.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">Pros</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {product.pros.map((pro, i) => (
                    <li key={i} className="text-gray-300">
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cons */}
            {product.cons.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">Cons</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {product.cons.map((con, i) => (
                    <li key={i} className="text-gray-300">
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <a
                href={product.affiliateLink}
                target="_blank"
                className="flex-1 bg-primary text-bg font-bold py-4 px-6 rounded-lg hover:bg-primary-light transition text-center"
              >
                Buy on Amazon
              </a>
              <a
                href="#"
                target="_blank"
                className="flex-1 bg-secondary text-white font-bold py-4 px-6 rounded-lg hover:bg-secondary-light transition text-center"
              >
                Buy on Flipkart
              </a>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 mt-6">
              ⓘ We may earn a commission if you click these links. This helps keep TechDeals AI free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Step 2: Create API Endpoint for Product Details

**File:** `src/app/api/products/[slug]/route.ts`

```typescript
// src/app/api/products/[slug]/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { category: true },
    })

    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

### ✅ Phase 5 Deliverables
- [ ] Dynamic `/products/[slug]` pages
- [ ] Product image, price, rating displayed
- [ ] Pros/cons sections
- [ ] "Buy on Amazon/Flipkart" buttons
- [ ] Affiliate disclaimer shown
- [ ] SEO metadata generated (`generateMetadata`)
- [ ] Related products shown
- [ ] 404 handling for missing products

---

## 🔍 PHASE 6: SEARCH & FILTERS (Days 13–15)

### Goal
Full-text search, category filter, price range, sorting.

### Step 1: Create Products API Route

**File:** `src/app/api/products/route.ts`

Using **Codex (Claude API)**, use this prompt:

```
Generate a Next.js 15 API route (src/app/api/products/route.ts) that:

1. GET endpoint to fetch products with filters
2. Query parameters: search (text search), category (slug), minPrice, maxPrice, sortBy (price, rating, newest), page (pagination, 12 per page)
3. Use Prisma to query with filters (where clause with AND conditions)
4. For search: use Prisma fulltext search on title + description
5. Return: { products, total, page, pageSize, totalPages }
6. Add error handling

Use TypeScript, NextResponse, and Prisma syntax.
```

**Example:**

```typescript
// src/app/api/products/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const minPrice = parseInt(searchParams.get('minPrice') || '0')
    const maxPrice = parseInt(searchParams.get('maxPrice') || '999999')
    const sortBy = searchParams.get('sortBy') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = 12

    // Build where clause
    const where: any = {
      AND: [
        { price: { gte: minPrice, lte: maxPrice } },
      ],
    }

    if (search) {
      where.AND.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      })
    }

    if (category) {
      const cat = await prisma.category.findUnique({
        where: { slug: category },
      })
      if (cat) where.AND.push({ categoryId: cat.id })
    }

    // Count total
    const total = await prisma.product.count({ where })

    // Fetch products
    let orderBy: any = { createdAt: 'desc' }
    if (sortBy === 'price') orderBy = { price: 'asc' }
    if (sortBy === 'rating') orderBy = { rating: 'desc' }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: true },
    })

    return NextResponse.json({
      products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

### Step 2: Create Search & Filters Component

**File:** `src/components/public/SearchFilters.tsx`

Using **Antigravity (Copilot)**, let it generate:

```typescript
// src/components/public/SearchFilters.tsx
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const handleSearch = (value: string) => {
    setSearch(value)
    const params = new URLSearchParams(searchParams)
    params.set('search', value)
    params.set('page', '1')
    router.push(`/deals?${params.toString()}`)
  }

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(key, value)
    params.set('page', '1')
    router.push(`/deals?${params.toString()}`)
  }

  return (
    <div className="glass-card p-6 space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-glass-border focus:border-primary outline-none"
      />

      {/* Category Filter */}
      <select
        onChange={(e) => handleFilter('category', e.target.value)}
        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-glass-border focus:border-primary outline-none"
      >
        <option value="">All Categories</option>
        <option value="smartphones">Smartphones</option>
        <option value="laptops">Laptops</option>
        <option value="audio">Audio</option>
      </select>

      {/* Price Range */}
      <div>
        <label className="block text-sm mb-2">Price Range</label>
        <input
          type="range"
          min="0"
          max="500000"
          step="10000"
          onChange={(e) => handleFilter('maxPrice', e.target.value)}
          className="w-full"
        />
      </div>

      {/* Sort */}
      <select
        onChange={(e) => handleFilter('sortBy', e.target.value)}
        className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-glass-border focus:border-primary outline-none"
      >
        <option value="newest">Newest</option>
        <option value="price">Price: Low to High</option>
        <option value="rating">Highest Rated</option>
      </select>
    </div>
  )
}
```

### Step 3: Create Deals Page

**File:** `src/app/deals/page.tsx`

```typescript
// src/app/deals/page.tsx
import { SearchFilters } from '@/components/public/SearchFilters'
import { ProductCard } from '@/components/public/ProductCard'
import { Suspense } from 'react'

async function ProductsList({ searchParams }: any) {
  const params = new URLSearchParams(searchParams)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products?${params.toString()}`,
    { cache: 'no-store' }
  )
  const data = await res.json()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default function DealsPage({ searchParams }: any) {
  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gradient-text">All Deals</h1>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <SearchFilters />
          </div>

          <div className="lg:col-span-3">
            <Suspense fallback={<div>Loading...</div>}>
              <ProductsList searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### ✅ Phase 6 Deliverables
- [ ] `/api/products` endpoint with filters
- [ ] Search by product name/description
- [ ] Category filter
- [ ] Price range slider
- [ ] Sort by: newest, price, rating
- [ ] Pagination (12 products/page)
- [ ] Real-time filter updates
- [ ] Mobile-responsive filters

---

## 👨‍💼 PHASE 7: ADMIN DASHBOARD (Days 16–20)

### Goal
Full CRUD for products. Image upload to Cloudinary. Analytics dashboard.

### Step 1: Create Admin Layout

**File:** `src/app/admin/layout.tsx`

```typescript
// src/app/admin/layout.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Top bar */}
      <div className="glass-card p-4 border-b border-glass-border flex justify-between items-center">
        <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{session.user?.email}</span>
          <a
            href="/api/auth/signout"
            className="text-sm bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Sign Out
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="p-8">{children}</div>
    </div>
  )
}
```

### Step 2: Create Admin Dashboard Home

**File:** `src/app/admin/page.tsx`

Using **Codex (Claude API)**, use this prompt:

```
Generate an admin dashboard home page (src/app/admin/page.tsx) that displays:

1. Overview metrics: Total Products, Total Views, Total Categories, Total Newsletter Subscribers
2. Each metric in a glass card with icon and number
3. Quick links to: Add Product, Manage Products, Manage Categories, View Analytics
4. Recent products table (last 5 products added)
5. Use Prisma to fetch data

Use TypeScript, Tailwind CSS, and async/await for data fetching.
```

**Example:**

```typescript
// src/app/admin/page.tsx
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminPage() {
  const totalProducts = await prisma.product.count()
  const totalCategories = await prisma.category.count()
  const totalSubscribers = await prisma.newsletterSubscriber.count()
  const totalClicks = (
    await prisma.product.aggregate({
      _sum: { clicks: true },
    })
  )._sum.clicks || 0

  const recentProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <MetricCard label="Total Products" value={totalProducts} />
        <MetricCard label="Total Clicks" value={totalClicks} />
        <MetricCard label="Categories" value={totalCategories} />
        <MetricCard label="Subscribers" value={totalSubscribers} />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <ActionButton href="/admin/products/new" label="Add Product" />
        <ActionButton href="/admin/products" label="Manage Products" />
        <ActionButton href="/admin/categories" label="Manage Categories" />
        <ActionButton href="/admin/analytics" label="View Analytics" />
      </div>

      {/* Recent Products */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Recent Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">Rating</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((product) => (
                <tr key={product.id} className="border-b border-glass-border hover:bg-gray-800">
                  <td className="p-2">{product.title}</td>
                  <td className="p-2">₹{product.price}</td>
                  <td className="p-2">{product.rating}</td>
                  <td className="p-2">
                    <Link href={`/admin/products/${product.id}`} className="text-primary hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-card p-6">
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-primary">{value.toLocaleString()}</p>
    </div>
  )
}

function ActionButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="glass-card p-4 text-center hover:neon-border transition font-semibold"
    >
      {label}
    </Link>
  )
}
```

### Step 3: Create Product Form

**File:** `src/app/admin/products/ProductForm.tsx`

Using **Codex (Claude API)**, use this prompt:

```
Generate a React component ProductForm (src/app/admin/products/ProductForm.tsx) that:

1. Form for creating/editing products
2. Fields: title, description, price, originalPrice, discount, rating, category (dropdown), image (file upload), featured (checkbox), pros (array input), cons (array input), tags (array input)
3. Image upload to Cloudinary (show preview)
4. Submit saves to /api/admin/products (POST for new, PATCH for edit)
5. Handle loading/error states
6. Use TypeScript, React hooks, and Tailwind CSS
7. If editing, pre-populate fields with product data

Include proper form validation and error handling.
```

**Step 4: Create Product Management Pages**

Create these pages:
- `/admin/products` — List all products with edit/delete
- `/admin/products/new` — Create new product
- `/admin/products/[id]` — Edit product
- `/admin/categories` — Manage categories

### ✅ Phase 7 Deliverables
- [ ] Admin dashboard with metrics
- [ ] Add product form (with Cloudinary upload)
- [ ] Edit product form
- [ ] Delete product functionality
- [ ] Manage categories page
- [ ] Cloudinary image upload working
- [ ] Form validation + error handling
- [ ] Protected routes (/admin/* requires auth)

---

## 🤖 PHASE 8: AI FEATURES (Days 21–26)

### Goal
Claude API integration. Auto-generate summaries, pros/cons, SEO metadata.

### Step 1: Create Summarize API Endpoint

**File:** `src/app/api/ai/summarize/route.ts`

Using **Codex (Claude API)**, use this prompt:

```
Generate an API endpoint (src/app/api/ai/summarize/route.ts) that:

1. POST endpoint
2. Request body: { productTitle: string, productDescription?: string }
3. Use Anthropic Claude API to generate:
   - Product summary (100 words)
   - 5 pros
   - 3 cons
   - 6-8 relevant tags
4. Return JSON: { summary, pros: [], cons: [], tags: [] }
5. Handle errors + rate limiting

Use @anthropic-ai/sdk, TypeScript, and NextResponse.
```

**Example:**

```typescript
// src/app/api/ai/summarize/route.ts
import { Anthropic } from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { productTitle, productDescription } = await request.json()

    const prompt = `You are a product expert. Analyze this product and provide insights in JSON format only.

Product: ${productTitle}
${productDescription ? `Description: ${productDescription}` : ''}

Return ONLY valid JSON (no markdown, no comments):
{
  "summary": "100-word product summary",
  "pros": ["pro 1", "pro 2", "pro 3", "pro 4", "pro 5"],
  "cons": ["con 1", "con 2", "con 3"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"]
}`

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const result = JSON.parse(content.text)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Claude API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
```

### Step 2: Create SEO Generation Endpoint

**File:** `src/app/api/ai/seo/route.ts`

```typescript
// src/app/api/ai/seo/route.ts
import { Anthropic } from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { productTitle, description, price } = await request.json()

    const prompt = `Generate SEO metadata for this product. Return ONLY valid JSON:

Product: ${productTitle}
Price: ₹${price}
${description ? `Description: ${description}` : ''}

{
  "seoTitle": "compelling title under 60 chars",
  "seoDescription": "engaging description under 160 chars",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    const result = JSON.parse(content.text)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Claude API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate SEO' },
      { status: 500 }
    )
  }
}
```

### Step 3: Add AI Buttons to Admin Form

In the product form, add buttons:

```typescript
// In ProductForm.tsx
const handleAISummarize = async () => {
  const res = await fetch('/api/ai/summarize', {
    method: 'POST',
    body: JSON.stringify({
      productTitle: formData.title,
      productDescription: formData.description,
    }),
  })
  const data = await res.json()
  setFormData({
    ...formData,
    description: data.summary,
    pros: data.pros,
    cons: data.cons,
    tags: data.tags,
  })
}

const handleAISEO = async () => {
  const res = await fetch('/api/ai/seo', {
    method: 'POST',
    body: JSON.stringify({
      productTitle: formData.title,
      description: formData.description,
      price: formData.price,
    }),
  })
  const data = await res.json()
  setFormData({
    ...formData,
    seoTitle: data.seoTitle,
    seoDesc: data.seoDescription,
  })
}
```

### ✅ Phase 8 Deliverables
- [ ] `/api/ai/summarize` endpoint (Claude integration)
- [ ] `/api/ai/seo` endpoint (SEO generation)
- [ ] `/api/ai/compare` endpoint (product comparison)
- [ ] Admin UI buttons: "Generate with AI"
- [ ] One-click summary/pros/cons/SEO generation
- [ ] Error handling for API failures
- [ ] Works with Anthropic free tier

---

## 📈 PHASE 9: SEO & PERFORMANCE (Days 27–32)

### Goal
Auto-generate Open Graph tags, meta tags. Create sitemap, robots.txt. Optimize for Lighthouse 95+.

### Step 1: Create Dynamic SEO Metadata

**File:** `src/lib/seo.ts`

```typescript
// src/lib/seo.ts
export function generateProductMeta(product: any) {
  const title = product.seoTitle || `${product.title} - Best Deal at ₹${product.price}`
  const description = product.seoDesc || `Buy ${product.title} at ₹${product.price}. ${product.description.substring(0, 140)}...`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
    },
  }
}
```

### Step 2: Create Sitemap

**File:** `src/app/sitemap.ts`

```typescript
// src/app/sitemap.ts
import { prisma } from '@/lib/prisma'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    select: { slug: true, updatedAt: true },
  })

  const categories = await prisma.category.findMany({
    select: { slug: true },
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techdeals-ai.vercel.app'

  return [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/deals`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt,
      priority: 0.7,
    })),
    ...categories.map((c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]
}
```

### Step 3: Create Robots.txt

**File:** `src/app/robots.ts`

```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techdeals-ai.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

### Step 4: Optimize Images

Use Cloudinary transformations in Next.js Image:

```typescript
// In ProductCard.tsx
import Image from 'next/image'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Image
      src={product.image}
      alt={product.title}
      width={300}
      height={300}
      quality={75}  // Reduces file size
      loading="lazy"  // Lazy load images
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

### Step 5: Add Performance Optimizations

**File:** `src/app/layout.tsx`

```typescript
// src/app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://techdeals-ai.vercel.app'),
  title: {
    default: 'TechDeals AI - Best Tech Deals & Reviews',
    template: '%s | TechDeals AI',
  },
  description: 'Discover best tech deals powered by AI. Compare products, read reviews, and save money on smartphones, laptops, audio, cameras & more.',
  keywords: ['tech deals', 'product reviews', 'best prices', 'online shopping', 'technology'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://techdeals-ai.vercel.app',
    siteName: 'TechDeals AI',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### ✅ Phase 9 Deliverables
- [ ] Dynamic SEO metadata on all pages
- [ ] Open Graph images on products
- [ ] Twitter cards configured
- [ ] Sitemap generated (`/sitemap.xml`)
- [ ] Robots.txt created (`/robots.txt`)
- [ ] Images optimized (Cloudinary + Next.js Image)
- [ ] Lazy loading enabled
- [ ] Lighthouse score 95+ on desktop
- [ ] Mobile score 95+

---

## 🚀 PHASE 10: DEPLOYMENT & LAUNCH (Days 33–40)

### Goal
Deploy to Vercel. Set up GitHub Actions CI/CD. Launch marketing.

### Step 1: Prepare for Deployment

#### Update Environment Variables

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all `.env.local` variables:
```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
AUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ANTHROPIC_API_KEY=...
RESEND_API_KEY=...
NEXT_PUBLIC_SITE_URL=https://techdeals-ai.vercel.app
ADMIN_EMAIL=your@email.com
```

#### Update Google OAuth

In Google Cloud Console:
1. Go to Credentials
2. Edit OAuth Client ID
3. Add redirect URI: `https://techdeals-ai.vercel.app/api/auth/callback/google`

#### Create GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`

```yaml
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

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Follow the prompts
```

### Step 3: Run Database Migrations

```bash
# On Vercel (or local before deploy)
npx prisma migrate deploy
```

### Step 4: Test in Production

1. Visit `https://techdeals-ai.vercel.app`
2. Test homepage, product pages, search
3. Test admin login at `/admin`
4. Check Lighthouse score: https://pagespeed.web.dev/

### Step 5: Setup Monitoring & Analytics

#### Add Google Analytics

**File:** `src/app/layout.tsx`

```tsx
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX`}
        />
        <Script
          id="ga"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXX');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Step 6: Launch Marketing Plan

**Week 1-2:**
- Post on Reddit: r/IndianFootprint, r/IndianDeals, r/tekindia
- Share on Twitter/X (tech deals thread)
- Add to ProductHunt
- Write initial blog posts (6-8)

**Week 3-4:**
- Reach out to tech influencers
- Guest posts on tech blogs
- Newsletter outreach (partner with existing newsletters)
- Ads: Google Ads ($50-100/week)

**Ongoing:**
- Daily deal updates (social media)
- Weekly newsletter (email)
- Monthly blog posts
- Affiliate partnerships

### ✅ Phase 10 Deliverables
- [ ] Deployed to Vercel (production URL working)
- [ ] All environment variables configured
- [ ] Google OAuth updated for production domain
- [ ] GitHub Actions CI/CD working
- [ ] Database migrations ran successfully
- [ ] Lighthouse scores verified (95+)
- [ ] Google Analytics tracking active
- [ ] Marketing plan executed
- [ ] First 10 organic visitors acquired

---

## 📊 FINAL CHECKLIST

### Technical
- [x] Next.js 15 + TypeScript
- [x] Glassmorphism dark design
- [x] Supabase PostgreSQL + Prisma
- [x] Google OAuth authentication
- [x] Cloudinary image hosting
- [x] Claude API integration (AI features)
- [x] Resend email service
- [x] Vercel hosting
- [x] SEO optimization
- [x] Performance (Lighthouse 95+)

### Business
- [x] 12 seed products
- [x] 5 product categories
- [x] Admin dashboard
- [x] Affiliate links (Amazon, Flipkart)
- [x] Newsletter signup
- [x] Analytics tracking
- [x] Mobile-first responsive
- [x] 100% free tier (no paid services needed)

### Content
- [x] Homepage with hero
- [x] Product detail pages
- [x] Search & filters
- [x] Category pages
- [x] Blog foundation (ready)
- [x] SEO metadata (auto-generated)

### Launch
- [x] Production deployment
- [x] GitHub Actions CI/CD
- [x] Error monitoring (optional)
- [x] Marketing plan ready

---

## 🎯 SUCCESS METRICS (First 90 Days)

| Metric | Target | How to Track |
|--------|--------|--------------|
| Visitors | 5,000+ | Google Analytics |
| Products Listed | 500+ | Admin dashboard |
| Affiliate Clicks | 500+ | Click tracking API |
| Newsletter Subscribers | 1,000+ | Resend dashboard |
| Lighthouse Score | 95+ | pagespeed.web.dev |
| Bounce Rate | <50% | GA |
| Avg Time on Page | >2min | GA |
| Pages/Session | >2.5 | GA |

---

## 💡 Next Steps After Launch

### Phase 11: Growth (Month 2)
- Add 50+ products/week
- AI price tracking
- Product comparison tool
- Blog content (SEO traffic)
- Community (WhatsApp, Telegram)

### Phase 12: Monetization (Month 3)
- Integrate Impact.com
- CJ Affiliate setup
- ClickBank products
- Direct brand partnerships
- Sponsored deals

### Phase 13: Scale (Month 4+)
- Product recommendation engine
- Price drop alerts
- Wishlist feature
- User reviews system
- Mobile app (React Native)

---

## 📞 SUPPORT & TROUBLESHOOTING

### Common Issues

**Database Connection Error**
```bash
# Check Supabase connection
psql "$DATABASE_URL"

# Check .env.local is loaded
npx prisma db push --skip-generate
```

**Google OAuth Not Working**
```
1. Check CLIENT_ID and CLIENT_SECRET are correct
2. Verify redirect URIs in Google Cloud Console
3. Check AUTH_SECRET is set
```

**Images Not Loading**
```
1. Verify Cloudinary API key is correct
2. Check image URL in database
3. Test direct Cloudinary URL: cloudinary.com/[CLOUD_NAME]/image/upload/
```

**Vercel Deployment Fails**
```
1. Check all env vars are set in Vercel dashboard
2. Run migrations: npx prisma migrate deploy
3. Check build logs in Vercel dashboard
```

---

## 🎓 LEARNING RESOURCES

- Next.js 15 Docs: https://nextjs.org
- Prisma Docs: https://prisma.io
- Supabase Docs: https://supabase.com/docs
- NextAuth v5: https://authjs.dev
- Tailwind CSS: https://tailwindcss.com
- Anthropic Claude: https://docs.anthropic.com

---

**TechDeals AI is ready to launch. You now have a complete 40-day roadmap with code examples, prompts, and deployment instructions. Start with Phase 0 today, and you'll have a live, monetized affiliate platform in 40 days.**

**Good luck! 🚀**
