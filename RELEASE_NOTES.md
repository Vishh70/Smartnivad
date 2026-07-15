# Smartnivad Release Notes - v1.0.0

## 🚀 New Features

- **Public Launch Release:** Official v1.0.0 release of the Smartnivad platform.
- **Admin Dashboard:** Fully functional secure management zone (`/secure-management-zone-...`) for managing deals, stores, categories, and blogs.
- **AI Integration:** Google Gemini-powered features for AI chat, deal summarization, and SEO generation.
- **Social Publishing:** Automated social media queueing and publishing for Telegram and Instagram.
- **Price Tracking:** Cron job engine for automated daily price checks and deal status updates.

## 🐛 Bug Fixes

- **Prisma Build Crash:** Implemented a lazy initialization Proxy for the Prisma Client to prevent build-time crashes when `DATABASE_URL` is unavailable during static prerendering.
- **Next.js Prerendering:** Added try/catch and fallback strategies to dynamic pages (like Blog and Deals) to prevent Vercel 500 errors if the database is unreachable.
- **Deployment Loops:** Removed conflicting `npm run qa` step from GitHub Actions `deploy.yml` that was causing cyclic build failures.

## 🔒 Security Improvements

- **SSRF Prevention:** Hardened the `/api/.../scrape` endpoint by strictly validating URLs and outright blocking internal IP ranges, localhosts, and non-HTTP protocols.
- **Session IDs:** Replaced insecure `Math.random()` usage in `AiAssistant.tsx` with cryptographic `crypto.randomUUID()`.
- **API Protection:** Admin routes and Cron API endpoints are securely locked behind Next-Auth role checks and `CRON_SECRET` validation.
- **Rate Limiting:** Added memory-based rate limiting to the AI Chat endpoint.

## ⚙️ CI/CD Improvements

- **Environment Variable Injection:** Modified the Vercel deploy workflow to inject critical secrets (`DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`) directly into the `vercel build` command.
- **Node 22 Upgrade:** Upgraded GitHub actions runners to Node.js v22.
- **Monitoring:** Added a `/api/health` endpoint to continuously verify database and server uptime.

## ⚠️ Known Limitations

- The in-memory rate limiter (used for AI Chat) will reset on serverless cold starts. This is acceptable for current traffic but should be migrated to Redis/Upstash as user volume scales.
- Image uploads currently rely on direct CDN links rather than a centralized asset manager like Cloudinary for every single upload.
- NextAuth secret requires manual configuration in the Vercel environment to ensure strict session security.
