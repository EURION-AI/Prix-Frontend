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
    const { repo, action } = await request.json()

    if (!repo || !['add', 'remove'].includes(action)) {
      return NextResponse.json({ error: 'Invalid repository or action' }, { status: 400 })
    }

    // Fetch fresh user data from DB to ensure accurate limits and state
    const user = await getUserByGithubId(userDataCookie.id)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }

    let currentRepos = [...(user.selectedRepos || [])]

    if (action === 'remove') {
      currentRepos = currentRepos.filter(r => r !== repo)
    } else if (action === 'add') {
      if (!currentRepos.includes(repo)) {
        // Check limits before adding
        const limit = user.plan === 'max' ? Infinity : (user.plan === 'pro' ? 15 : 5)
        
        if (currentRepos.length >= limit) {
          return NextResponse.json({ 
            error: `Your ${user.plan.toUpperCase()} plan limits you to ${limit} repositories. Please upgrade to add more.` 
          }, { status: 403 })
        }
        
        currentRepos.push(repo)
      }
    }

    await updateSelectedRepos(user.githubId, currentRepos)

    return NextResponse.json({ success: true, selectedRepos: currentRepos })
  } catch (error) {
    console.error('Error saving selected repo:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
