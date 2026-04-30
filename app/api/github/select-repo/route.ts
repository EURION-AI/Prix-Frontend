import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { updateSelectedRepo } from '@/lib/user-store'

export async function POST(request: Request) {
  const userCookie = cookies().get('github_user')?.value
  if (!userCookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const userData = JSON.parse(decodeURIComponent(userCookie))
    const { repo } = await request.json()

    if (!repo) {
      return NextResponse.json({ error: 'Repository is required' }, { status: 400 })
    }

    await updateSelectedRepo(userData.id, repo)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving selected repo:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
