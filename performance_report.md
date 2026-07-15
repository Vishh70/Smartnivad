# SmartNivad Performance Report (Mobile)

**Branch:** `feature/mobile-ux-production`  
**Date:** 2026-07-15  
**Scope:** Mobile-specific performance improvements

---

## Core Web Vitals Impact

### LCP — Largest Contentful Paint

**Before:**

- The homepage hero deal image was rendered with a raw `<img>` tag — no `width`, `height`, or `sizes` attributes
- The browser had no layout hint, so it allocated 0px × 0px until the image loaded
- This caused a large **Cumulative Layout Shift (CLS)** event on every page load

**After:**

- Replaced with `<SafeImage fill sizes="(max-width: 768px) 100vw, 400px" priority>`
- `priority` flag adds `<link rel="preload">` in `<head>` — browser fetches image before first render
- `fill` + parent `relative h-64` container gives the browser exact space to allocate
- **Expected improvement:** CLS reduction from ~0.15+ to <0.1 (Good); LCP may improve 200–500ms on mobile due to preload

---

## JavaScript & Paint Impact

### Aurora Background Suppression (Pre-existing)

- The codebase already suppresses `.aurora-bg` on mobile via `@media (hover: hover)` — this was preserved

### Hover Animation Guard (Phase 1)

- `.gradient-btn` hover scale is now wrapped inside `@media (hover: hover) and (pointer: fine)`
- On touch devices, this prevents the scale transform from being applied during taps, reducing unnecessary paint calls

### SVG Gradient Deduplication (Phase 2)

- `BottomNav.tsx` previously declared a `<defs>` block with gradient definitions for every nav item rendered (5× repetition)
- Now declared once globally — minor DOM size reduction, eliminates redundant browser gradient processing

---

## Network Impact

### Image Optimization (SafeImage)

- `SafeImage` uses Next.js `<Image>` under the hood with automatic WebP/AVIF conversion and responsive srcset
- `sizes="(max-width: 768px) 100vw, 400px"` ensures mobile devices don't download a desktop-sized image
- Estimated savings: 60–80% reduction in hero image bytes on mobile (400px WebP vs 1200px original)

---

## Bundle Impact

| File                     | Change                                  | Bundle Impact                         |
| ------------------------ | --------------------------------------- | ------------------------------------- |
| `login/page.tsx`         | Added `Eye`, `EyeOff` from lucide-react | +~1.2KB (tree-shaken)                 |
| `AdminLayoutWrapper.tsx` | New file                                | +~1.8KB                               |
| `AdminSidebar.tsx`       | Added `X` import                        | +~0.2KB                               |
| `page.tsx`               | Replaced `img` with `SafeImage`         | ~0 (SafeImage already used elsewhere) |

**Net impact: ~+3.2KB gzipped** — negligible for the UX improvements gained.

---

## Rendering Impact

### AdminLayoutWrapper

- The mobile drawer is **not rendered at all** until `drawerOpen` becomes true
- The backdrop and drawer panel are conditionally mounted — zero paint cost on initial load
- The sidebar inside the drawer shares the same component as the desktop sidebar — no duplicate code path

---

## Recommendations for Future Passes

1. **product/[slug]/page.tsx** — Add `pb-[env(safe-area-inset-bottom)]` to sticky CTA for iPhone gesture bar
2. **HomeFeedTabs** — Consider virtualization (`react-window`) if deal count grows beyond 100+ items
3. **Admin pages** — The admin area is rarely accessed on mobile; `text-base` input fixes for `DealsTableFilter` and `DealForm` can be addressed when admin mobile traffic justifies it
4. **Lighthouse CI** — Integrate mobile Lighthouse CI into the deployment pipeline to catch regressions automatically
