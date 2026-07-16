# Smartnivad Analytics Plan

**Role:** Growth Engineer

## Current Setup

We are currently utilizing **Vercel Analytics** for high-level traffic monitoring (page views, unique visitors, top referrers). While good for infrastructure, this is insufficient for Product-Led Growth (PLG).

## Recommended Events to Track (PostHog / Umami)

### 1. Conversion Events (Critical)

- `clicked_affiliate_link`: Fires when a user clicks "Get Deal". Attributes to track: `deal_id`, `store_name`, `price`.
- `newsletter_signup`: Fires when user submits email.

### 2. Discovery Events

- `search_performed`: Attributes: `search_term`, `results_count`. Helps identify missing products!
- `category_viewed`: Attributes: `category_slug`. Helps identify which niches we should hunt for more deals.
- `filtered_deals`: Attributes: `filter_type`, `sort_order`.

### 3. Error Tracking

- `api_error`: Capture 500s on the client.
- `ai_rate_limit_hit`: Track how often the Gemini API refuses connections due to our 15 RPM limit to see if we need to upgrade.

## User Journey Funnel

We need to set up a funnel in our analytics tool to measure:

1. Landed on site ->
2. Viewed a deal page ->
3. Clicked outbound affiliate link (Conversion Rate).

Our target for v1.1.0 is to increase the Step 2 -> Step 3 conversion rate by implementing the sticky mobile "Buy" bar and the Price History chart.
