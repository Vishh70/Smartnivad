# SmartNivad Mobile UX Audit Report

**Branch:** `feature/mobile-ux-production`  
**Date:** 2026-07-15  
**Scope:** Mobile-only UX, accessibility, and performance improvements  
**Target Devices:** iPhone SE (375px), iPhone 14/15 (390px), Pixel 7 (412px), Samsung Galaxy S23 (360px+)

---

## Summary

| Category      | Issues Found | Issues Fixed | Status   |
| ------------- | ------------ | ------------ | -------- |
| Layout & CLS  | 1            | 1            | ✅ Fixed |
| Navigation    | 3            | 3            | ✅ Fixed |
| Touch Targets | 4            | 4            | ✅ Fixed |
| iOS Zoom      | 3            | 3            | ✅ Fixed |
| WCAG Contrast | 12           | 12           | ✅ Fixed |
| Admin Mobile  | 1            | 1            | ✅ Fixed |
| TypeScript    | 1            | 1            | ✅ Fixed |

---

## Phase 1 — Global Foundation

### `globals.css`

- **Added** theme variable mappings: `--color-glass-border`, `--color-glass-bg`, `--color-glass-surface`
- **Protected** `.gradient-btn` hover scaling under `@media (hover: hover) and (pointer: fine)` — prevents accidental scale flicker on touch
- **Added** `active:scale-98` tap feedback for touch users

---

## Phase 2 — Navigation

### `BottomNav.tsx`

- **Fixed** active tab label contrast: replaced gradient text (cyan/blue) with solid `text-blue-600` on mobile for WCAG AA compliance
- **Deduplicated** SVG gradient `<defs>` that was declared once per tab (5× unnecessary DOM nodes)

### `Navbar.tsx`

- **Fixed** search overlay positioning: changed `top-16` to `top-[calc(4rem+env(safe-area-inset-top))]` — prevents overlay being hidden behind iOS notch/Dynamic Island
- **Added** "Sign In" button visible when user is unauthenticated — previously no mobile CTA existed for sign-in

---

## Phase 3 — Product Cards

### `ProductCard.tsx`

- **Expanded** wishlist heart button from `w-8 h-8` (32px) to `w-11 h-11` (44px) on mobile — satisfies WCAG 2.2 minimum touch target
- **Expanded** "View Deal" CTA button from `h-9` (36px) to `h-11` (44px) on mobile — satisfies WCAG 2.2 minimum touch target
- **Guarded** hover scale effects under `@media (hover: hover)` — removes sticky hover states on touch devices

---

## Phase 4 — Public Pages

### `page.tsx` (Homepage)

- **Fixed** Layout Shift (CLS): replaced raw `<img>` with `<SafeImage fill sizes="..." priority>` on the featured deal-of-the-day hero card — eliminates unmeasured LCP image causing layout shift

### `DealsClient.tsx`

- **Fixed** iOS zoom on focus: changed search input from `text-sm` (14px) to `text-base lg:text-sm` (16px on mobile) — iOS Safari zooms the viewport when focused inputs are < 16px
- **Fixed** WCAG contrast on active filter buttons: Deal Type and Category quick-filter chips now use `text-white` instead of `text-gray-900` when `bg-[var(--color-primary)]` (#2563eb) is active — contrast ratio 4.5:1+ vs prior ~2.8:1

### `CouponsClient.tsx`

- **Fixed** WCAG contrast on all active filter buttons: Store and Category filter tabs now use `text-white` when active blue background applied (6 buttons)
- **Fixed** WCAG contrast on affiliate link button: `text-gray-900` on `bg-[var(--color-primary)]` changed to `text-white`

### `profile/page.tsx`

- **Fixed** WCAG contrast on "Explore Deals" CTA: changed from `text-black` to `text-white` on blue primary background

---

## Phase 5 — Authentication

### `login/page.tsx`

- **Added** password visibility toggle (`Eye` / `EyeOff` icon button) — improves UX on mobile where password typing errors are common
- **Fixed** iOS zoom: both email and password inputs updated to `text-base` (16px) — prevents iOS Safari auto-zoom on focus
- **Fixed** touch target on Google sign-in button: added `min-h-[44px]` to meet WCAG minimum

---

## Phase 6 — Admin Dashboard

### `AdminLayoutWrapper.tsx` (NEW)

- **Created** thin responsive client shell around admin sidebar
- Renders static sidebar on `md+` screens (unchanged desktop experience)
- Renders slide-in drawer on mobile, triggered by hamburger button
- Includes mobile sticky header with `Menu` hamburger + brand name
- Includes desktop topbar with search and bell notification
- Properly handles drawer backdrop tap-to-close

### `AdminSidebar.tsx`

- **Added** optional `onClose` prop — when provided (mobile drawer context), renders an `×` close button in the sidebar header
- **Removed** `hidden md:flex` — sidebar now always renders as `flex`; visibility is controlled by the wrapper (`hidden md:block` for desktop static, `translate-x` for mobile drawer)

### `layout.tsx`

- **Simplified** to just fetch admin session and delegate all layout rendering to `AdminLayoutWrapper`

---

## Phase 7 — TypeScript

### `src/app/api/newsletter/route.ts`

- **Fixed** TypeScript type error: `ZodError.errors` does not exist — changed to `error.issues[0]?.message` (correct Zod v3 API with optional chaining for safety)

---

## Remaining Items (Out of Scope / Future)

- `product/[slug]/page.tsx` — sticky bottom CTA safe-area offset (low priority, not a blocking issue)
- Admin `DealsTableFilter` and `DealForm` inputs — `text-base` on mobile (inline admin pages, low real-world mobile traffic)
