# SmartNivad Architecture Guide

## Tech Stack

- **Framework:** Next.js 15 (App Router, React 19)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL) with Prisma ORM
- **Styling:** Tailwind CSS, Framer Motion, Lucide Icons
- **Authentication:** Next-Auth (v4) with JWT strategy
- **Deployment:** Vercel (Frontend + Serverless Functions)
- **CI/CD:** GitHub Actions

## Directory Structure

- `/src/app` - Next.js App Router. Contains `(public)` routes and `secure-management-zone-***` (Admin) routes.
- `/src/components` - Reusable UI components (buttons, cards, forms, sections).
- `/src/lib` - Core utilities (Prisma client, data fetchers, AI integration, social publishing).
- `/prisma` - Database schema and migration files.
- `/tests` - Playwright E2E and visual tests.
- `/.github/workflows` - CI/CD pipeline configuration.

## Key Systems

### Database Connection (Prisma)

Prisma is configured in `src/lib/prisma.ts` as a global singleton to prevent connection exhaustion in development. In production (Vercel), it utilizes Supabase's PgBouncer connection pooling (`?pgbouncer=true` in `DATABASE_URL`).
A lazy initialization proxy pattern is used to allow Next.js static builds to succeed even if the database is temporarily unreachable during the build phase.

### Authentication & Authorization

Uses `next-auth` for session management.

- The admin dashboard is secured via `middleware.ts`, which checks for an active session with `role === "admin"` before allowing access to `/secure-management-zone-***`.
- Unauthenticated users attempting to access admin routes are redirected to `/access-denied`.

### Background Jobs & Social Publishing

Social media auto-publishing and price updates are handled via Vercel Cron Jobs calling `/api/cron/*` endpoints. These endpoints are secured by verifying a `CRON_SECRET` bearer token matching the request headers.

### AI Integration

The application uses the `@google/genai` SDK for features like deal summarization, product comparison, and SEO generation. API calls are rate-limited in memory (suitable for current scale) and fall back gracefully on failure.

### Security Defenses

- **SSRF:** The `/api/.../scrape` endpoint validates URLs and blocks internal IP requests.
- **CSRF / XSS:** Handled natively by Next.js and Next-Auth.
- **SQL Injection:** Mitigated entirely by using Prisma ORM.

## Production Monitoring

- **Health Checks:** A lightweight `/api/health` endpoint exists for uptime monitoring (e.g., UptimeRobot, Datadog).
- **Web Vitals:** Vercel Speed Insights (`@vercel/speed-insights`) is integrated into the root layout.
- **Analytics:** Vercel Analytics (`@vercel/analytics`) tracks page views and audience metrics.
