<div align="center">

<img src="https://smartnivad.vercel.app/apple-icon.png" width="120" alt="Smartnivad Logo"/>

# 🍽️ Smartnivad

**AI-Assisted Full-Stack Food Tech Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Playwright](https://img.shields.io/badge/Tested_with-Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Live](https://img.shields.io/badge/Live-Deployment-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://smartnivad.vercel.app)

Smartnivad is a production-ready, highly optimized food technology platform. It combines a robust Next.js server-rendered architecture with Gemini AI integration, automated quality assurance, and edge-deployed infrastructure.

[View Live Project](https://smartnivad.vercel.app) · [Report Bug](https://github.com/Vishh70/Smartnivad/issues) · [Request Feature](https://github.com/Vishh70/Smartnivad/issues)

</div>

---

## 🎯 The Vision

Smartnivad was engineered to demonstrate a modern, scalable, and resilient approach to full-stack web development. Moving beyond simple CRUD operations, the platform integrates AI for content assistance, leverages edge caching for performance, and strictly enforces quality through end-to-end testing and Lighthouse CI.

## ✨ Core Features

- **🤖 AI Integration**: Contextual content generation and assistance powered by `@google/generative-ai`.
- **🔐 Secure Authentication**: Multi-provider authentication, session management, and role-based access control via `NextAuth.js`.
- **🗄️ Relational Data Modeling**: Type-safe database queries and migrations handled by `Prisma ORM` with PostgreSQL.
- **🖼️ Optimized Media**: Cloud media management, transformations, and caching via `Cloudinary`.
- **📱 Progressive Web App (PWA)**: Offline support and caching strategies implemented with `Serwist`.
- **📊 Real-time Telemetry**: Application performance monitoring, error tracking, and analytics via `Sentry` and Vercel Analytics.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **Icons**: Lucide React

### Backend & Database
- **API**: Next.js Route Handlers
- **Database**: PostgreSQL
- **ORM**: Prisma Client + `@prisma/adapter-pg`
- **Auth**: NextAuth.js (`@next-auth/prisma-adapter`)
- **Storage**: Cloudinary

### AI & Integrations
- **AI Engine**: Google Gemini Pro API
- **Analytics**: Vercel Speed Insights, Vercel Analytics
- **Error Tracking**: Sentry

### DevOps & QA
- **E2E Testing**: Playwright
- **Unit Testing**: Vitest + React Testing Library
- **Accessibility**: Axe-Core Playwright
- **Performance**: Lighthouse CI (`@lhci/cli`)
- **Linting & Formatting**: ESLint, Prettier, Husky

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v20+ recommended)
- PostgreSQL database
- Cloudinary account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vishh70/Smartnivad.git
   cd Smartnivad
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/smartnivad"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
   GEMINI_API_KEY="your_gemini_api_key"
   SENTRY_DSN="your_sentry_dsn"
   ```

4. **Database Migration**
   ```bash
   npx prisma generate
   npx prisma db push
   # Optional: Seed the database
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   *Visit `http://localhost:3000` to view the application.*

---

## 🧪 Testing & Validation

Quality assurance is a first-class citizen in Smartnivad, enforced through automated CI pipelines.

```bash
# Run unit and component tests
npm run test

# Run end-to-end tests (requires Playwright browsers to be installed)
npm run test:e2e

# Run accessibility audits
npm run test:a11y

# Run Lighthouse performance audit
npm run lhci
```

## 📈 Performance & SEO

Smartnivad is built for speed and discoverability:
- **Lighthouse CI**: Enforces performance budgets on every PR.
- **Dynamic OG Images**: Automatically generated social cards using `@vercel/og`.
- **Edge Caching**: Extensive use of Next.js caching strategies and route segment configs.
- **Asset Optimization**: Strict image optimization pipelines and bundle analysis (`@next/bundle-analyzer`).

---

<div align="center">

Designed & Engineered by [Vishnu Aware](https://github.com/Vishh70)

</div>
