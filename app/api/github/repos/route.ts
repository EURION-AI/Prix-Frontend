import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const token = cookies().get('github_token')?.value

  if (!token) {
    console.error('Repos API: No github_token found in cookies')
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    console.log('Repos API: Fetching repos from GitHub...')
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Repos API: GitHub error ${response.status}:`, errorText)
      return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: response.status })
    }

    const repos = await response.json()
    console.log(`Repos API: Successfully fetched ${repos.length} repositories`)
    return NextResponse.json(repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      private: repo.private,
      updated_at: repo.updated_at,
    })))
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
