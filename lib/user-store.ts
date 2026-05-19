import { sql } from './db'

export type Plan = 'free' | 'starter' | 'pro'

export interface User {
  id: string
  githubId: number
  username: string
  email: string | null
  avatarUrl: string | null
  plan: Plan
  selectedRepos: string[]
  githubInstallationId: number | null
  installationStatus: string
  prsReviewed: number
  subscriptionId: string | null
  subscriptionProvider: string | null
  planStartedAt: string | null
  planExpiresAt: string | null
  createdAt: string
  updatedAt: string
  billingDay: number
  usageLimitCap: number
}

const PLAN_LIMITS: Record<string, number> = {
  free: 15,
  starter: 450,
  pro: 1000,
}

function getLimitForPlan(plan: string): number {
  return PLAN_LIMITS[plan.toLowerCase()] || 15
}

function rowToUser(row: any): User {
  return {
    id: row.id,
    githubId: row.github_id,
    username: row.username,
    email: row.email,
    avatarUrl: row.avatar_url,
    plan: row.plan,
    selectedRepos: row.selected_repos || [],
    githubInstallationId: row.github_installation_id,
    installationStatus: row.installation_status || 'disconnected',
    prsReviewed: row.prs_reviewed || 0,
    subscriptionId: row.subscription_id || null,
    subscriptionProvider: row.subscription_provider || null,
    planStartedAt: row.plan_started_at ? row.plan_started_at.toISOString() : null,
    planExpiresAt: row.plan_expires_at ? row.plan_expires_at.toISOString() : null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    billingDay: row.billing_day || 1,
    usageLimitCap: row.usage_limit_cap != null ? row.usage_limit_cap : 15,
  }
}

export async function getOrCreateUser(githubId: number, username: string, email?: string, avatarUrl?: string): Promise<User> {
  const id = `user_${Date.now()}_${githubId}_${crypto.randomUUID().split('-')[0]}`

  const result = await sql`
    INSERT INTO users (id, github_id, username, email, avatar_url)
    VALUES (${id}, ${githubId}, ${username.substring(0, 100)}, ${email || null}, ${avatarUrl || null})
    ON CONFLICT (github_id) DO UPDATE SET
      username = EXCLUDED.username,
      email = EXCLUDED.email,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = NOW()
    RETURNING *
  `

  return rowToUser(result[0])
}

export async function getUserByGithubId(githubId: number): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE github_id = ${githubId}
  `

  if (result.length === 0) return null
  return rowToUser(result[0])
}

/**
 * Activate a subscription plan for a user.
 * Sets plan, subscription ID, and calculates expiration 30 days from now.
 */
export async function activateSubscription(
  githubId: number,
  plan: string,
  subscriptionId: string,
  provider: string = 'razorpay'
): Promise<void> {
  await sql`
    UPDATE users
    SET plan = ${plan},
        subscription_id = ${subscriptionId},
        subscription_provider = ${provider},
        plan_started_at = NOW(),
        plan_expires_at = NOW() + INTERVAL '30 days',
        billing_day = EXTRACT(DAY FROM NOW()),
        usage_limit_cap = ${getLimitForPlan(plan)},
        updated_at = NOW()
    WHERE github_id = ${githubId}
  `
}

/**
 * Extend a subscription by 30 days from the current expiration date.
 */
export async function extendSubscription(githubId: number, provider: string = ''): Promise<void> {
  const user = await getUserByGithubId(githubId)
  const cap = user ? getLimitForPlan(user.plan) : 15

  await sql`
    UPDATE users
    SET plan_expires_at = GREATEST(plan_expires_at, NOW()) + INTERVAL '30 days',
        usage_limit_cap = ${cap},
        subscription_provider = CASE WHEN ${provider} != '' THEN ${provider} ELSE subscription_provider END,
        updated_at = NOW()
    WHERE github_id = ${githubId}
  `
}

/**
 * Legacy updateUserPlan — kept for backward compatibility.
 * For new subscriptions, prefer activateSubscription().
 */
export async function updateUserPlan(githubId: number, plan: string): Promise<void> {
  await sql`
    UPDATE users
    SET plan = ${plan},
        plan_started_at = NOW(),
        plan_expires_at = NOW() + INTERVAL '30 days',
        updated_at = NOW()
    WHERE github_id = ${githubId}
  `
}

/**
 * Cancel a user's subscription. Does NOT immediately downgrade.
 * User keeps access until plan_expires_at.
 * subscription_provider is preserved for audit trail.
 */
export async function cancelUserSubscription(githubId: number): Promise<void> {
  await sql`
    UPDATE users
    SET subscription_id = NULL,
        usage_limit_cap = 15,
        updated_at = NOW()
    WHERE github_id = ${githubId}
  `
}

/**
 * Downgrade all users whose plan has expired.
 * Should be called periodically (via cron/webhook) or on user access checks.
 */
export async function expireOverduePlans(): Promise<number> {
  const result = await sql`
    UPDATE users
    SET plan = 'free',
        subscription_id = NULL,
        subscription_provider = NULL,
        plan_started_at = NULL,
        plan_expires_at = NULL,
        usage_limit_cap = 15,
        updated_at = NOW()
    WHERE plan IN ('starter', 'pro')
      AND plan_expires_at IS NOT NULL
      AND plan_expires_at < NOW()
    RETURNING github_id
  `
  if (result.length > 0) {
    console.log(`Expired ${result.length} overdue plans:`, result.map(r => r.github_id))
  }
  return result.length
}

/**
 * Handle a refund or chargeback — immediately downgrades the user.
 * Clears subscription fields since the payment was reversed.
 */
export async function handleRefund(githubId: number, reason: string = 'refunded'): Promise<void> {
  await sql`
    UPDATE users
    SET plan = 'free',
        subscription_id = NULL,
        subscription_provider = NULL,
        plan_started_at = NULL,
        plan_expires_at = NULL,
        usage_limit_cap = 15,
        updated_at = NOW()
    WHERE github_id = ${githubId}
  `
  console.log(`User ${githubId} downgraded due to ${reason}`)
}

/**
 * Get the Razorpay subscription ID for a user (used for cancellation).
 */
export async function getUserSubscriptionId(githubId: number): Promise<string | null> {
  const result = await sql`
    SELECT subscription_id FROM users WHERE github_id = ${githubId}
  `
  return result[0]?.subscription_id || null
}

export async function updateSelectedRepos(githubId: number, repos: string[]): Promise<void> {
  await sql`
    UPDATE users
    SET selected_repos = ${sql.json(repos)}, updated_at = NOW()
    WHERE github_id = ${githubId}
  `
}

export async function updateInstallationId(githubId: number, installationId: number): Promise<void> {
  await sql`
    UPDATE users
    SET github_installation_id = ${installationId}, updated_at = NOW()
    WHERE github_id = ${githubId}
  `
}

export async function incrementPrsReviewed(githubId: number): Promise<void> {
  await sql`
    UPDATE users
    SET prs_reviewed = prs_reviewed + 1, updated_at = NOW()
    WHERE github_id = ${githubId}
  `
}

export async function getUserCount(): Promise<number> {
  const result = await sql`
    SELECT COUNT(*)::int as count FROM users
  `
  return result[0]?.count || 0
}

export async function getNewUsersCount(days: number): Promise<number> {
  const result = await sql`
    SELECT COUNT(*)::int as count FROM users
    WHERE created_at > NOW() - INTERVAL '1 day' * ${days}
  `
  return result[0]?.count || 0
}

export async function getUsersByPlan(): Promise<Record<string, number>> {
  const result = await sql`
    SELECT plan, COUNT(*)::int as count
    FROM users
    GROUP BY plan
  `
  const byPlan: Record<string, number> = {}
  for (const row of result) {
    byPlan[row.plan] = row.count
  }
  return byPlan
}