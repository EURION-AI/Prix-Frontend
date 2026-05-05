import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sql } from '@/lib/db'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('github_token')?.value

  if (!token) {
    console.error('Repos API: No github_token found in cookies')
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const userCookie = cookieStore.get('github_user')?.value
  const userData = userCookie ? JSON.parse(userCookie) : null
  let installationId = userData?.githubInstallationId

  // If missing from cookie, try fetching from database
  if (!installationId && userData?.id) {
    try {
      const result = await sql`SELECT github_installation_id FROM users WHERE github_id = ${userData.id}`
      if (result.length > 0) {
        installationId = result[0].github_installation_id
      }
    } catch (err) {
      console.error('Repos API: Failed to fetch installation ID from DB:', err)
    }
  }

  try {
    console.log('Repos API: Fetching repos from GitHub...')
    
    const url = installationId 
      ? `https://api.github.com/user/installations/${installationId}/repositories`
      : 'https://api.github.com/user/repos?sort=updated&per_page=100'

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Repos API: GitHub error ${response.status} at ${url}:`, errorText)
      
      // FALLBACK: If installation fetch fails, try the standard user repos fetch
      if (installationId) {
        console.log('Repos API: Installation fetch failed, falling back to standard user repos')
        const fallbackResponse = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json()
          return NextResponse.json(mapRepos(fallbackData))
        }
      }
      
      return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: response.status })
    }

    const data = await response.json()
    
    // Handle different response formats
    let repos = []
    if (installationId && data.repositories) {
      repos = data.repositories
    } else if (Array.isArray(data)) {
      repos = data
    } else if (data.repositories) {
      repos = data.repositories
    } else {
      console.error('Repos API: Unexpected GitHub response format:', data)
      throw new Error('Unexpected response format')
    }

    console.log(`Repos API: Successfully fetched ${repos.length} repositories`)
    return NextResponse.json(mapRepos(repos))
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function mapRepos(repos: any[]) {
  return repos.map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    html_url: repo.html_url,
    private: repo.private,
    updated_at: repo.updated_at,
  }))
}
