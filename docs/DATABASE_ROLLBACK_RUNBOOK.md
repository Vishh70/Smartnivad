# Emergency Rollback Runbook

This document defines the standard procedure for safely recovering from application or database migration failures in the SmartNivad production environment, specifically adhering to the Mandatory Migration Safety & Rollback Policy.

**CRITICAL**: Never put passwords, secret values, or `.env` credentials in this document.

## 1. Application Rollback

If the new application deployment fails (e.g., runtime crashes, 500 errors) but the database migration is strictly additive and harmless:

1. **Do NOT immediately reverse the database migration.** Prefer running the **OLD APPLICATION + NEW BACKWARD-COMPATIBLE DATABASE** over risking data loss.
2. Log into the Vercel dashboard:
   - Navigate to **Deployments**.
   - Locate the previous known-good deployment.
   - Click **Promote to Production** (or "Instant Rollback").
3. Verify the application has recovered (see Post-Rollback Verification).

## 2. Database Assessment

If the application rollback does not resolve the issue, determine if the migration caused the issue:

1. Review the application logs in Vercel to identify SQL or Prisma query errors.
2. Check if the error maps to newly altered tables, missing columns, or dropped data.
3. Review the `AutomationLog` or standard application logs for any drift or connection errors.

## 3. Migration Status

Before attempting any recovery, inspect the current Prisma migration state:

```bash
# Verify the active database URL in your local .env matches the intended target (PREVIEW/PRODUCTION)
# NEVER PRINT THE DATABASE_URL
npx prisma migrate status
```

This will confirm which migrations have been applied and whether any drift is detected.

## 4. Safe Recovery

Recover without using destructive commands:

1. **Empty Additive Tables**: If a new additive table (e.g., `Content`, `ContentProduct`) is empty or contains harmless data, leave it intact.
2. **Do NOT use `prisma migrate reset` or `prisma db push --force-reset` on production.**
3. If an explicit backward migration is required, it must be performed through an explicitly reviewed and tested Prisma migration (e.g., an `EXPAND → MIGRATE → CONTRACT` cleanup cycle later).

## 5. Backup Recovery

If destructive database changes occurred unexpectedly and data is lost:

1. Do not manually `DROP` production tables as an emergency shortcut.
2. Use the **approved Supabase recovery mechanism**:
   - Access the Supabase Dashboard.
   - Navigate to Database → Backups.
   - Locate the most recent backup timestamp created _prior_ to the failed migration.
   - Follow Supabase's Point-in-Time Recovery (PITR) or Snapshot restore instructions.

## 6. Post-Rollback Verification

After any rollback (Application or Database), manually verify the following critical paths:

- [ ] **Homepage**: Loads successfully without 500 errors.
- [ ] **Database Connection**: Application can read/write data (e.g., load deals).
- [ ] **Authentication**: Users can log in.
- [ ] **Admin**: Admin dashboard is accessible to authorized users.
- [ ] **Affiliate Redirects**: Links via `/go/[slug]` correctly resolve and track.
- [ ] **Click Tracking**: Clicks are recorded in the database without crashing.
- [ ] **Cron**: Scheduled tasks (like price updates) execute successfully.
- [ ] **Content Pages**: (If applicable) Content pages fallback safely (404) if data is missing.
