# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-15

### Added

- **Public Launch Release:** Official v1.0.0 release of the Smartnivad platform.
- **Admin Dashboard:** Secured management zone for administrating deals, brands, and categories.
- **AI Integration:** Google Gemini integration for summaries and SEO text generation.
- **Social Automation:** Automatic publishing pipeline for Telegram and Instagram.
- **Health Checks:** Uptime monitoring endpoint at `/api/health`.
- **Documentation:** `ARCHITECTURE.md`, `RELEASE_NOTES.md`, and `VERSION.md`.

### Changed

- Rebranded entire codebase from `TechDeals-AI` to `Smartnivad`.
- Modified Vercel deployment pipeline to safely inject environment variables during the build phase.
- Upgraded GitHub Actions runners to Node v22.

### Fixed

- Fixed Prisma client crash during static generation when `DATABASE_URL` is missing (using a lazy Proxy).
- Fixed cyclic deployment loops caused by redundant build scripts.
- Fixed SSRF vulnerability in the `/api/.../scrape` scraper endpoint.
- Fixed insecure session ID generation in `AiAssistant.tsx` by migrating to `crypto.randomUUID()`.
- Fixed multiple TypeScript `any` casts and ESLint unused-variable warnings.
