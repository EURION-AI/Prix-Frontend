import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { updateInstallationId, getUserByGithubId } from '@/lib/user-store'

export async function POST(request: Request) {
  try {
    const { installationId } = await request.json()
    const cookieStore = await cookies()
    const userCookie = cookieStore.get('github_user')?.value

    if (!userCookie || !installationId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const userData = JSON.parse(userCookie)
    const githubId = userData.githubId

    if (!githubId) {
      return NextResponse.json({ error: 'Invalid user session' }, { status: 401 })
    }

    // Update the database with the new installation ID
    await updateInstallationId(githubId, parseInt(installationId))

    // Notify the Hugging Face backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    if (backendUrl) {
      try {
        await fetch(`${backendUrl.replace(/\/$/, '')}/api/github/mount`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            installationId: parseInt(installationId),
            githubId: githubId
          }),
        })
      } catch (err) {
        console.error('Failed to notify backend:', err)
      }
    }

    return NextResponse.json({ success: true, installationId })
  } catch (error) {
    console.error('Error mounting installation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
