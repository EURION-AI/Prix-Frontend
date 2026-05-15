import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserByGithubId, updateInstallationId } from '@/lib/user-store'
import { markInstallationConnected, cleanupInvalidRepos } from '@/lib/github-installation'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('github_token')?.value
    const userCookie = cookieStore.get('github_user')?.value

    if (!token || !userCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userData = JSON.parse(userCookie)
    const githubId = userData.githubId || userData.id

    const APP_SLUG = process.env.GITHUB_APP_NAME || 'prix-ai-automation'

    const res = await fetch('https://api.github.com/user/installations', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      return NextResponse.json(
        { found: false, error: 'Failed to fetch installations from GitHub' },
        { status: 200 }
      )
    }

    const data = await res.json()

    const ourInstallation = data.installations?.find(
      (inst: any) => inst.app_slug === APP_SLUG
    )

    if (!ourInstallation) {
      return NextResponse.json(
        { found: false, error: `No installation found for ${APP_SLUG}` },
        { status: 200 }
      )
    }

    const installationId = ourInstallation.id

    await markInstallationConnected(githubId, installationId)

    if (token) {
      await cleanupInvalidRepos(githubId, installationId, token)
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    if (backendUrl) {
      try {
        await fetch(`${backendUrl.replace(/\/$/, '')}/api/github/mount`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ installationId, githubId }),
        })
      } catch (err) {
        console.error('Failed to notify backend about discovered installation:', err)
      }
    }

    const user = await getUserByGithubId(githubId)

    return NextResponse.json({
      found: true,
      installationId,
      user: user
        ? {
            githubInstallationId: user.githubInstallationId,
            installationStatus: user.installationStatus,
            selectedRepos: user.selectedRepos,
          }
        : null,
    })
  } catch (error) {
    console.error('Discovery error:', error)
    return NextResponse.json({ found: false, error: 'Internal error' }, { status: 200 })
  }
}
