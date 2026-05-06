# Prix AI Database Specification (v1.1)

This document contains the complete database schema and descriptions for the Prix AI platform. Use this as a reference for database optimization, migration, or backend service integration.

## 1. Core User Management

### `users`
**Purpose**: Stores primary user account data, subscription status, and project configuration.
- `id` (VARCHAR 50, PK): Internal system ID.
- `github_id` (BIGINT, UNIQUE): The permanent GitHub user ID (Primary link to GitHub API).
- `username` (VARCHAR 100): GitHub username.
- `email` (VARCHAR 255): User email.
- `avatar_url` (TEXT): Link to GitHub profile picture.
- `plan` (VARCHAR 20): Subscription level (`free`, `starter`, `pro`).
- `selected_repos` (JSONB): Array of full repository names (e.g., `["owner/repo1", "owner/repo2"]`) selected for AI auditing.
- `prs_reviewed` (INTEGER): Lifetime total of PRs reviewed by the AI for this user.
- `monthly_prs_reviewed` (INTEGER): Current month's review count (for plan limits).
- `last_reset_month` (INTEGER): The month (1-12) when the monthly counter was last reset.
- `created_at` (TIMESTAMP): Account creation date.
- `updated_at` (TIMESTAMP): Last profile or setting update.

---

## 2. Analytics & Performance

### `daily_aggregates`
**Purpose**: Optimized table for dashboard charts. Stores pre-summarized data to avoid slow expensive queries on raw event logs.
- `id` (SERIAL, PK): Internal ID.
- `date` (DATE): The day the stats apply to.
- `metric_category` (VARCHAR 50): Grouping (e.g., `'visitors'`, `'revenue'`, `'reviews'`).
- `metric_name` (VARCHAR 100): Specific metric (e.g., `'unique_visitors'`, `'mrr'`).
- `total_value` (DECIMAL): The summarized value for that day.
- `count` (INTEGER): Number of events that contributed to this value.
- `metadata` (JSONB): Additional context.
- **Unique Constraint**: `(date, metric_category, metric_name)`

### `dashboard_metrics`
**Purpose**: Flexible storage for system health markers and one-off metric readings.
- `metric_type` (VARCHAR 50): e.g., `'system'`, `'api'`.
- `metric_name` (VARCHAR 100): e.g., `'cpu_usage'`, `'average_latency'`.
- `metric_value` (DECIMAL).

---

## 3. Financial & Revenue

### `revenue_events`
**Purpose**: The source of truth for all financial transactions. Used to calculate MRR and Churn.
- `id` (SERIAL, PK): Transaction log ID.
- `event_type` (VARCHAR 50): e.g., `'subscription'`, `'purchase'`, `'refund'`.
- `amount` (DECIMAL 10,2): Amount in USD (or subunits).
- `customer_id` (VARCHAR 100): Razorpay/Payment provider customer reference.
- `github_id` (BIGINT): Links the payment to a Prix user.
- `subscription_tier` (VARCHAR 20): The tier purchased (`starter`, `pro`).
- `created_at` (TIMESTAMP): Date of transaction.

---

## 4. Affiliate & Referral System

### `affiliate_users`
**Purpose**: Users who are authorized to refer others and earn commission.
- `github_id` (BIGINT, UNIQUE, FK -> users.github_id).
- `affiliate_code` (VARCHAR 50, UNIQUE): The code used in referral URLs (e.g., `PRIX10`).
- `referral_count` (INTEGER): Total clicks/referrals.
- `paid_referral_count` (INTEGER): Number of referrals that converted to paid plans.

### `referrals`
**Purpose**: Maps a new signup to the person who referred them.
- `affiliate_id` (VARCHAR 50, FK -> affiliate_users.id).
- `referred_github_id` (BIGINT, FK -> users.github_id).
- `referred_ip_hash` (VARCHAR 64): Used for fraud detection/uniqueness without storing raw IPs.
- `has_purchased` (BOOLEAN): Tracks if the referral has converted to a paid user.

### `affiliate_events`
**Purpose**: Audit log for individual referral actions.
- `event_type` (VARCHAR 50): `'click'`, `'conversion'`, `'commission_paid'`.
- `commission_amount` (DECIMAL): Amount earned by the affiliate.
- `conversion_status` (VARCHAR 20): `'pending'`, `'paid'`.
