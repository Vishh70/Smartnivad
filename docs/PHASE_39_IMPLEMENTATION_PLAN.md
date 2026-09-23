# Phase 39: Affiliate Content Engine

## Goal Description

Implement the new Affiliate Content Engine that generates long-form SEO content (e.g., reviews, comparisons, listicles) driven by factual product data from the database. This engine is semi-automated: AI generates the draft based on DB facts and a brief, which is strictly validated using Zod schemas, but _must_ undergo human review and approval before publishing. No automatic publishing is permitted.

## User Review Required

> [!IMPORTANT]
> The database schema changes for `Content` and `ContentProduct` are foundational. Please review the proposed models to ensure they capture all your requirements for the human-review workflow.

## Open Questions

> [!NOTE]
>
> 1. Do you want the AI to output raw HTML, or a structured JSON format (e.g. sections with headings and paragraphs) that the frontend renders dynamically?
> 2. For the human review step, do you want a full WYSIWYG editor in the Admin panel, or just a simple text area / JSON editor for the first version?

## Proposed Changes

### 1. Database Schema

#### [MODIFY] [schema.prisma](file:///C:/my%20new%20project/prisma/schema.prisma)

Add the following models:

- `Content`: Represents an article (Review, Guide, Listicle). Fields: `id`, `slug`, `title`, `type`, `brief`, `aiJson` (for Zod validation), `finalContent` (HTML/Markdown for render), `status` (DRAFT, IN_REVIEW, APPROVED, PUBLISHED), timestamps.
- `ContentProduct`: A many-to-many join table between `Content` and `Deal` (or `Store`/`Brand`).
- `ContentStatus`: Enum for the lifecycle (DRAFT, IN_REVIEW, APPROVED, PUBLISHED).

### 2. AI Generation Pipeline

#### [NEW] [src/lib/content/generator.ts](file:///C:/my%20new%20project/src/lib/content/generator.ts)

- `generateContentDraft(brief, dealIds)`: Fetches facts for the provided deals from the DB, constructs an AI prompt, and calls Gemini using `generateWithFallback`.
- Parses the AI response as Structured JSON.

#### [NEW] [src/lib/content/schema.ts](file:///C:/my%20new%20project/src/lib/content/schema.ts)

- Zod schemas for the expected AI JSON output (e.g., `ContentArticleSchema` containing arrays of sections, pros/cons, FAQs).

### 3. Admin UI (Human Review)

#### [NEW] [src/app/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content/page.tsx](file:///C:/my%20new%20project/src/app/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content/page.tsx)

- Content dashboard listing all articles and their `ContentStatus`.
- Actions to transition status: `Submit for QA` -> `Approve` -> `Publish`.

#### [NEW] [src/app/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content/new/page.tsx](file:///C:/my%20new%20project/src/app/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content/new/page.tsx)

- Content creation form: provide a Brief, select Products (Deals).
- Button to trigger "Generate Draft via AI".

#### [NEW] [src/app/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content/[id]/review/page.tsx](file:///C:/my%20new%20project/src/app/secure-management-zone-8f3a9b2e7c1d4f6a5b8c9d0e2f1a4b7c6d9e8f3a2b1c4d7e6f9a8b5c2d1e4f3a/content/[id]/review/page.tsx)

- Human Review screen: View AI-generated structured JSON / text, compare against DB facts, and manually approve/reject.

## Verification Plan

### Automated Tests

- Run Prisma migrations (`npx prisma migrate dev`).
- Ensure `npx tsx scripts/verify-database-migration.ts` finally passes completely with the new tables.
- Add E2E tests for the Admin Content creation and review pipeline.

### Manual Verification

- Test generating an article draft using DB facts.
- Validate that the AI response matches the Zod schema.
- Confirm the article status is saved as `DRAFT` and requires explicit human clicking to transition to `PUBLISHED`.
