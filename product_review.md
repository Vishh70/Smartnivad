# Smartnivad v1.0.0 Product Review

**Role:** Product Lead
**Objective:** Identify UX friction points, missing flows, and empty states in the current v1.0.0 release.

---

## 1. Missing User Flows (High Priority)

- **Wishlist / Save for Later:** Users currently have no way to "save" a deal if they are browsing on mobile and want to buy on desktop later. This drastically reduces conversion rates for impulse discovery.
- **User Authentication (Public):** While the admin dashboard is locked down via Next-Auth, there is no public user profile page.
- **Price Drop Subscriptions:** Deals expire or drop in price frequently, but users cannot click "Notify me when price drops to X."

## 2. Empty States & Error Feedback (Medium Priority)

- **Search Results (Zero-State):** If a user searches for a brand or product that doesn't exist, the UI just shows a blank list. It should instead show: _"No deals found for X. Here are some trending deals you might like!"_
- **Expired Deals:** When a deal expires, it shouldn't just vanish from the UI or 404. It should remain accessible for SEO, but clearly tagged as **"EXPIRED"** with alternative similar deals listed below it.

## 3. Confusing Navigation (Low Priority)

- **Category Deep-Linking:** It takes 3 taps on mobile to drill down into specific subcategories (e.g., Electronics -> Laptops -> Apple). A unified mega-menu or quick-filter chip row on the homepage would speed this up.

## Recommendation Summary

For v1.1.0, the primary focus must be on **Retention & Re-engagement** (Wishlists, Profiles, Alerts).
