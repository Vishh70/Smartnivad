# Smartnivad v1.1.0 Feature Roadmap

**Role:** Senior Full-Stack Engineer

## Ranking Methodology

Features are ranked by an aggregate score of:

1. **User Value (High/Med/Low)**
2. **Dev Effort (High/Med/Low)**
3. **Maintenance Cost (Free Tier Safe?)**

---

## Top 5 Recommended Features

### 1. Wishlist (Favorites)

- **User Value:** High (Encourages return visits)
- **Dev Effort:** Low
- **Free Tier Safety:** Yes. We can store this in `localStorage` for guest users, and in Supabase for authenticated users.
- **Priority:** #1

### 2. Recently Viewed Deals

- **User Value:** Medium (Convenience)
- **Dev Effort:** Very Low
- **Free Tier Safety:** Yes. Store an array of 10 recent IDs in `localStorage`. Zero database queries required.
- **Priority:** #2

### 3. Price Drop Alerts

- **User Value:** Very High
- **Dev Effort:** Medium
- **Free Tier Safety:** Yes, _if_ we use Resend (free tier) for emails, and run it as part of our existing `update-prices` cron job.
- **Priority:** #3

### 4. Advanced Filters & Sorting

- **User Value:** High
- **Dev Effort:** Medium (Requires updating Prisma queries and URL search params)
- **Free Tier Safety:** Yes. It's just optimized SQL querying.
- **Priority:** #4

### 5. Personalized "For You" Recommendations

- **User Value:** High
- **Dev Effort:** High
- **Free Tier Safety:** Borderline. True ML recommendations require heavy compute. _Alternative:_ Simple category-affinity tracking via `localStorage` (e.g., user clicks 3 laptop deals -> prioritize "Laptops" category on homepage). This uses 0 compute and stays 100% free.
- **Priority:** #5
