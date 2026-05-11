import { sql } from './db'

export type Plan = 'free' | 'starter' | 'pro' | 'max'

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
  razorpaySubscriptionId: string | null
  planStartedAt: string | null
  planExpiresAt: string | null
  createdAt: string
  updatedAt: string
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
    razorpaySubscriptionId: row.razorpay_subscription_id || null,
    planStartedAt: row.plan_started_at ? row.plan_started_at.toISOString() : null,
    planExpiresAt: row.plan_expires_at ? row.plan_expires_at.toISOString() : null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
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
  razorpaySubscriptionId: string
): Promise<void> {
  await sql`
    UPDATE users
    SET plan = ${plan},
        razorpay_subscription_id = ${razorpaySubscriptionId},
        plan_started_at = NOW(),
        plan_expires_at = NOW() + INTERVAL '30 days',
        updated_at = NOW()
    WHERE github_id = ${githubId}
  `
}

/**
 * Extend a subscription by 30 days from the current expiration date.
 * Called when a recurring charge succeeds (webhook: subscription.charged).
 */
export async function extendSubscription(githubId: number): Promise<void> {
  await sql`
    UPDATE users
    SET plan_expires_at = GREATEST(plan_expires_at, NOW()) + INTERVAL '30 days',
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
 * The razorpay_subscription_id is cleared so we know it's cancelled.
 */
export async function cancelUserSubscription(githubId: number): Promise<void> {
  await sql`
    UPDATE users
    SET razorpay_subscription_id = NULL,
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
        razorpay_subscription_id = NULL,
        plan_started_at = NULL,
        plan_expires_at = NULL,
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
 * Get the Razorpay subscription ID for a user (used for cancellation).
 */
export async function getUserSubscriptionId(githubId: number): Promise<string | null> {
  const result = await sql`
    SELECT razorpay_subscription_id FROM users WHERE github_id = ${githubId}
  `
  return result[0]?.razorpay_subscription_id || null
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
    WHERE created_at > NOW() - INTERVAL '${days} days'
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