import { cookies } from 'next/headers'
import { sql } from './db'

export function parseUserCookie(cookieValue: string): { id: number } | null {
  try {
    const decoded = cookieValue.includes('%') ? decodeURIComponent(cookieValue) : cookieValue
    const data = JSON.parse(decoded)
    const id = data.id || data.githubId
    if (!id || typeof id !== 'number') return null
    return { id }
  } catch {
    return null
  }
}

/**
 * Activate queued plan if current plan has expired.
 * Called on every authenticated request to ensure queued plans are promoted.
 */
async function activateQueuedPlan(githubId: number): Promise<void> {
  await sql`
    UPDATE users
    SET plan = queued_plan,
        queued_plan = NULL,
        plan_started_at = NOW(),
        plan_expires_at = NOW() + INTERVAL '30 days',
        updated_at = NOW()
    WHERE github_id = ${githubId}
      AND queued_plan IS NOT NULL
      AND plan_expires_at IS NOT NULL
      AND plan_expires_at < NOW()
  `
}

/**
 * Expire overdue plans (downgrade to free).
 */
async function expireOverduePlan(githubId: number): Promise<void> {
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
      AND plan IN ('starter', 'pro')
      AND plan_expires_at IS NOT NULL
      AND plan_expires_at < NOW()
  `
}

export async function getAuthenticatedUser(): Promise<{ githubId: number } | null> {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('github_user')
  if (!userCookie?.value) return null

  const session = parseUserCookie(userCookie.value)
  if (!session) return null

  try {
    // Only run plan transitions for paid users to avoid DB queries on every request
    const user = await sql`
      SELECT plan, queued_plan, plan_expires_at FROM users WHERE github_id = ${session.id}
    `
    if (user.length > 0) {
      if (user[0].queued_plan && user[0].plan_expires_at) {
        const expiresAt = new Date(user[0].plan_expires_at).getTime()
        if (expiresAt < Date.now()) {
          await activateQueuedPlan(session.id)
        }
      }
      if ((user[0].plan === 'starter' || user[0].plan === 'pro') && user[0].plan_expires_at) {
        const expiresAt = new Date(user[0].plan_expires_at).getTime()
        if (expiresAt < Date.now()) {
          await expireOverduePlan(session.id)
        }
      }
    }
  } catch (e) {
    console.error('Failed to process plan state:', e)
  }

  return { githubId: session.id }
}
