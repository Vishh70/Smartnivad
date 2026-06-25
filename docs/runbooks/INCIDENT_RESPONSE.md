# SmartNivad Incident Response Runbooks

## 1. 500 Internal Server Errors

- **Detection**: Sentry alerts, Datadog 5xx spike, Vercel logs.
- **Impact**: Users cannot load pages or complete checkout.
- **Diagnosis**: Check Sentry stack traces. Check Vercel build logs.
- **Immediate mitigation**: Revert to the last known good deployment via Vercel dashboard.
- **Permanent resolution**: Fix code locally, merge fix, verify in preview, deploy to production.
- **Verification**: Monitor Sentry for 15 minutes post-deploy.

## 2. Database Failure (Connection Refused / Timeout)

- **Detection**: Prisma timeout errors in Sentry, Synthetic monitoring fails.
- **Impact**: All dynamic routes fail.
- **Diagnosis**: Check Postgres provider dashboard (e.g., Supabase, Neon, AWS) for connection limits or outages.
- **Immediate mitigation**: Scale connection pool (PgBouncer) or upgrade database tier. Enable maintenance mode.
- **Permanent resolution**: Optimize heavy queries, add Redis caching layer.
- **Verification**: Run `k6` stress test to ensure new connection limits hold.

## 3. Authentication Failure

- **Detection**: High rate of 401/403s on `/api/auth`, user reports.
- **Impact**: Users cannot log in or manage wishlists.
- **Diagnosis**: Check NextAuth secret expiry, OAuth provider (Google/GitHub) status pages.
- **Immediate mitigation**: Rotate `NEXTAUTH_SECRET` if compromised, or disable failing OAuth provider via Feature Flags.
- **Permanent resolution**: Implement fallback authentication (e.g., Email Magic Links).
- **Verification**: Manually test login flow in production.

## 4. Third-party API Failure (Scraping/AI)

- **Detection**: Synthetic tests fail on Deal pages.
- **Impact**: Stale prices or missing product descriptions.
- **Diagnosis**: Check OpenAI or Amazon/Flipkart scraper logs.
- **Immediate mitigation**: Enable `use-cached-deals-only` Feature Flag to hide real-time fetching.
- **Permanent resolution**: Implement exponential backoff and circuit breakers for external APIs.
- **Verification**: Check cache hit ratio metrics.

## 5. Vercel Outage

- **Detection**: Vercel Status page, DNS resolution failures.
- **Impact**: Complete site outage.
- **Diagnosis**: Confirm via DownDetector or Twitter.
- **Immediate mitigation**: Update DNS to point to a static fallback page on S3/Cloudflare if prolonged.
- **Permanent resolution**: N/A (Wait for vendor resolution).
- **Verification**: Monitor Vercel Status.

## 6. Deployment Rollback

- **Detection**: Post-deployment smoke test fails in CI.
- **Impact**: Bad code reaches production.
- **Diagnosis**: Review failed CI step.
- **Immediate mitigation**: Use Vercel CLI `vercel rollback` or press "Promote to Production" on the previous working deployment in Vercel.
- **Permanent resolution**: Add missing test case to Playwright.
- **Verification**: Confirm Vercel alias updated.

## 7. Performance Degradation

- **Detection**: Speed Insights shows LCP > 2.5s, API p95 > 500ms.
- **Impact**: Poor user experience, potential SEO penalty.
- **Diagnosis**: Check Bundle Analyzer reports, check Prisma slow queries.
- **Immediate mitigation**: Rollback if tied to a specific release. Increase cache TTLs.
- **Permanent resolution**: Implement pagination, optimize images, or index database columns.
- **Verification**: Monitor Speed Insights for 24 hours.

## 8. High Error Rate

- **Detection**: Sentry error rate > 0.5%.
- **Impact**: Widespread silent failures.
- **Diagnosis**: Filter Sentry by Release tag.
- **Immediate mitigation**: Rollback deployment.
- **Permanent resolution**: Fix root cause.
- **Verification**: Error rate returns to baseline.

## 9. Security Incident

- **Detection**: Dependabot critical alert, CodeQL injection alert, or user report.
- **Impact**: Potential data breach.
- **Diagnosis**: Audit logs and database access history.
- **Immediate mitigation**: Force logout all users, rotate all secrets (DB, Auth, APIs).
- **Permanent resolution**: Patch vulnerability, push hotfix.
- **Verification**: Penetration testing of the specific vector.
- **Postmortem**: Required.

## 10. Data Recovery

- **Detection**: Accidental DROP TABLE or corrupt data.
- **Impact**: Severe data loss.
- **Diagnosis**: Verify extent of corruption.
- **Immediate mitigation**: Take the site offline (Maintenance Mode).
- **Permanent resolution**: Restore from latest Point-in-Time Recovery (PITR) backup.
- **Verification**: Run database integrity scripts.
