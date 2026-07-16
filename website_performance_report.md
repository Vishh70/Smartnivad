# Smartnivad Performance Report (v1.1.0 Plan)

## Target Metrics

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## Planned Upgrades (Phase 25)

- **Image Optimization**: Ensure `next/image` is used exclusively. Prioritize WebP/AVIF formats.
- **Component Virtualization**: For long deal lists (e.g., Infinite Scroll), use virtualization so off-screen DOM nodes are unmounted.
- **Code Splitting**: Dynamically import heavy UI libraries (like charts or heavy carousels) using `next/dynamic`.
