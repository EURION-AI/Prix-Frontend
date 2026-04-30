import { sql } from './db'

export interface User {
  id: string
  githubId: number
  username: string
  email: string | null
  avatarUrl: string | null
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  selectedRepo: string | null
  createdAt: string
  updatedAt: string
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

  const row = result[0]
  return {
    id: row.id,
    githubId: row.github_id,
    username: row.username,
    email: row.email,
    avatarUrl: row.avatar_url,
    plan: row.plan,
    selectedRepo: row.selected_repo,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }
}

export async function getUserByGithubId(githubId: number): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE github_id = ${githubId}
  `

  if (result.length === 0) return null

  const row = result[0]
  return {
    id: row.id,
    githubId: row.github_id,
    username: row.username,
    email: row.email,
    avatarUrl: row.avatar_url,
    plan: row.plan,
    selectedRepo: row.selected_repo,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }
}

export async function updateUserPlan(githubId: number, plan: string): Promise<void> {
  await sql`
    UPDATE users
    SET plan = ${plan}, updated_at = NOW()
    WHERE github_id = ${githubId}
  `
}

export async function updateSelectedRepo(githubId: number, repo: string): Promise<void> {
  await sql`
    UPDATE users
    SET selected_repo = ${repo}, updated_at = NOW()
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