import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { updateSelectedRepos, getUserByGithubId } from '@/lib/user-store'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get('github_user')?.value
  if (!userCookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const userDataCookie = JSON.parse(decodeURIComponent(userCookie))
    const { repo, action, repositoryId } = await request.json()

    if (!repo || !['add', 'remove'].includes(action)) {
      return NextResponse.json({ error: 'Invalid repository or action' }, { status: 400 })
    }

    const user = await getUserByGithubId(userDataCookie.id)

    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }

    // Toggle the GitHub App installation on the specific repo
    const installationId = user.githubInstallationId
    if (installationId && repositoryId) {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      if (backendUrl) {
        try {
          const toggleRes = await fetch(`${backendUrl.replace(/\/$/, '')}/api/github/toggle-install`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ installationId, repositoryId, action }),
          })
          if (!toggleRes.ok) {
            const errData = await toggleRes.json()
            console.error('[SELECT-REPO] Backend toggle failed:', errData)
          }
        } catch (err) {
          console.error('[SELECT-REPO] Failed to call backend toggle-install:', err)
        }
      }
    }

    let currentRepos = [...(user.selectedRepos || [])]

    if (action === 'remove') {
      currentRepos = currentRepos.filter(r => r !== repo)
    } else if (action === 'add') {
      if (!currentRepos.includes(repo)) {
        if (user.plan === 'free') {
          const limit = 5
          if (currentRepos.length >= limit) {
            return NextResponse.json({
              error: `Your FREE plan limits you to ${limit} repositories. Please upgrade to unlock unlimited repositories.`
            }, { status: 403 })
          }
        }
        currentRepos.push(repo)
      }
    }

    await updateSelectedRepos(user.githubId, currentRepos)

    const response = NextResponse.json({ success: true, selectedRepos: currentRepos })

    const updatedUser = {
      ...userDataCookie,
      selectedRepos: currentRepos
    }

    response.cookies.set('github_user', JSON.stringify(updatedUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Error saving selected repo:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
