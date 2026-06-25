# Postmortem Template

**Date of Incident:** YYYY-MM-DD
**Authors:** [Names]
**Status:** [Draft / Under Review / Complete]

## Summary

Provide a high-level summary of what happened, the impact, and the resolution. Keep it concise (1 paragraph).

## Root Cause

What was the fundamental technical or process failure that caused the incident? (e.g., "A missing database index caused a CPU spike which cascaded into 502 gateway timeouts.")

## Timeline

Provide a chronological timeline of events (in UTC).

- **10:00 AM** - Deployment X was merged to main.
- **10:05 AM** - Sentry alerts began firing for 500 errors.
- **10:15 AM** - On-call engineer acknowledged the alert.
- **10:20 AM** - Rollback initiated.
- **10:25 AM** - Service fully restored.

## Customer Impact

- What percentage of users were affected?
- Were any core flows (login, checkout, search) completely broken?
- How long did the impact last? (e.g., 20 minutes)

## Mitigation

What steps were taken to immediately stop the bleeding? (e.g., Rollback, increased database connections, disabled feature flag).

## Action Items (Prevention)

What specific tasks must be done to ensure this _never_ happens again? Create GitHub issues for each.

- [ ] Add missing index to `Product` table (Issue #123)
- [ ] Update k6 load test to assert latency under heavy read load (Issue #124)
- [ ] Add Playwright test to verify search results actually render (Issue #125)
