# Smartnivad UX Improvements

**Role:** UX Designer

## Visual & Interaction Enhancements (Without changing core identity)

### 1. Homepage & Deal Discovery

- **Sticky Filters:** On mobile, when users scroll down the long list of deals, the category filters disappear. Pin a horizontal scrolling chip-list of categories to the top beneath the header on scroll.
- **Micro-interactions:** Add subtle scale-up (`scale-105`) hover states to the Deal Cards to make them feel more tactile.
- **Skeleton Loaders:** Instead of a generic spinner or blank page during dynamic fetching, implement skeleton UI cards that match the shape of the deals.

### 2. Product Pages (`/product/[slug]`)

- **Price History Chart:** Currently, price history exists in the DB but is difficult to visualize. Add a simple, lightweight SVG line chart showing the 30-day price trend to prove to users they are getting a good deal.
- **Sticky "Buy Now" Bar (Mobile):** On mobile, long descriptions push the "Buy" button off-screen. Introduce a sticky bottom bar with the current price and a "Get Deal" button that appears when scrolling past the main hero button.

### 3. Search Experience

- **Instant Search (Debounced):** Implement an `onChange` search dropdown that fetches deals without requiring a full page redirect.
- **Search History:** Save the last 3 search terms in local storage and display them when the search bar is focused.

### 4. Admin Dashboard

- **Bulk Actions:** Allow admins to select multiple deals via checkboxes and click "Mark as Expired" or "Delete" to speed up daily maintenance.
