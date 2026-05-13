import { cookies } from 'next/headers'

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

export async function getAuthenticatedUser(): Promise<{ githubId: number } | null> {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('github_user')
  if (!userCookie?.value) return null

  const session = parseUserCookie(userCookie.value)
  if (!session) return null

  return { githubId: session.id }
}
