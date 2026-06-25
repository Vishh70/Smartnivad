# SmartNivad QA Automation

This project uses a layered quality gate for every pull request and deployment.

## Local Commands

- `npm run lint` checks ESLint and Next.js rules.
- `npm run type-check` runs strict TypeScript with no emit.
- `npm run test:unit` runs Vitest unit tests.
- `npm run test:coverage` enforces the 95% coverage target.
- `npm run build` verifies the production Next.js build.
- `npm run test:e2e` runs Playwright journeys.
- `npm run test:a11y` runs axe-powered WCAG checks.
- `npm run test:visual` compares Playwright screenshots for visual regressions.
- `npm run lhci` runs Lighthouse CI against the built app.
- `npm run security:audit` fails on high-severity npm audit findings.

## CI Gates

GitHub Actions split the pipeline into focused workflows:

- `ci.yml`: install, lint, type-check, unit coverage, build, E2E, accessibility, visual smoke, and report upload.
- `lighthouse.yml`: build, serve, and enforce Lighthouse performance, accessibility, SEO, and best-practice budgets.
- `security.yml`: dependency review, npm audit, CodeQL, and secret scanning compatibility.

## Visual Baselines

The first visual run creates screenshots under `tests/visual/__snapshots__`. Review and commit intentional baselines. Unexpected UI changes fail future runs.

## Responsive Coverage

Playwright projects cover 320, 360, 375, 390, 414, 430, 768, 820, 1024, 1280, 1440, and 1920 pixel widths, plus representative iPhone, Pixel, Galaxy, iPad, Chromium, Firefox, WebKit, and Edge profiles.

## Security Notes

Security headers are configured in `next.config.ts`. `npm audit --audit-level=high` is intentionally strict; dependency updates should be reviewed rather than forced.

## Production Monitoring

Vercel Analytics and Speed Insights are mounted in `src/app/layout.tsx`. `@sentry/nextjs` is installed; complete Sentry setup by adding the project DSN and generated Sentry config files for the target organization/environment.

## Coverage Expansion

The current enforced 95% coverage gate starts with the unit-tested core utilities in `src/lib/format.ts` and `src/lib/site.ts`. Expand `coverage.include` in `vitest.config.ts` as component, server action, API route, and authentication tests are added.
