import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { updateInstallationId, getUserByGithubId } from '@/lib/user-store'
import { markInstallationConnected, cleanupInvalidRepos } from '@/lib/github-installation'

export async function POST(request: Request) {
  try {
    const { installationId } = await request.json()
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('github_user')?.value
    const token = cookieStore.get('github_token')?.value

    if (!userCookie || !installationId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const userData = JSON.parse(userCookie)
    const githubId = userData.githubId || userData.id

    if (!githubId) {
      return NextResponse.json({ error: 'Invalid user session' }, { status: 401 })
    }

    const installationIdNum = parseInt(installationId)

    // Update the database with the new installation ID and mark as connected
    await markInstallationConnected(githubId, installationIdNum)

    // Clean up any invalid repos from previous installation
    if (token) {
      await cleanupInvalidRepos(githubId, installationIdNum, token)
    }

    // Notify the Hugging Face backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    if (backendUrl) {
      try {
        await fetch(`${backendUrl.replace(/\/$/, '')}/api/github/mount`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            installationId: installationIdNum,
            githubId: githubId
          }),
        })
      } catch (err) {
        console.error('Failed to notify backend:', err)
      }
    }

    return NextResponse.json({ success: true, installationId: installationIdNum })
  } catch (error) {
    console.error('Error mounting installation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
