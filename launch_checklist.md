# Smartnivad Public Launch Checklist

## ✅ Completed Pre-Launch Verification

- [x] Database synchronized and migrations applied.
- [x] Prisma Build configuration stabilized (Proxy pattern).
- [x] SSRF protections tested and enabled.
- [x] Node v22 upgrade on CI/CD completed.
- [x] GitHub Actions Workflows (Build, Typecheck, ESLint, Deploy) succeeding.
- [x] Code Quality Audit passing 100%.

## 🚀 Day-Of Launch Checklist

- [ ] **Verify `NEXTAUTH_SECRET`:** Ensure a strong 64-char hex string is set in Vercel settings.
- [ ] **Manual Smoke Test (Live URL):** Click through Home, Deals, and Admin panel on the live domain.
- [ ] **Configure Custom Domain:** Verify DNS settings are fully propagated if changing the Vercel URL.
- [ ] **Check Uptime Monitor:** Ensure the UptimeRobot/Datadog ping to `/api/health` is active.
- [ ] **Verify OAuth Logins:** Perform a live test of Google/Email sign in.
- [ ] **Enable Cloudinary/Images:** Verify that production images are loading from your image hosting service (and whitelist the domain in `next.config.ts`).
- [ ] **Check Admin Access:** Confirm the Admin route denies access to standard users and unauthenticated sessions.

## 📊 Post-Launch Monitoring (First 48 Hours)

- [ ] Monitor Vercel Runtime Logs for 500 errors.
- [ ] Check Supabase Dashboard for query bottlenecks.
- [ ] Monitor Vercel Analytics for user bounce rates and Core Web Vitals.
- [ ] Test that Cron Jobs (Prices and Social Publishing) are executing on their scheduled intervals.
