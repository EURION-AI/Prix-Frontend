import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/request'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userCookie = request.cookies.get('github_user')

  // If user is at the root '/'
  if (pathname === '/') {
    if (userCookie) {
      // Redirect logged-in users to the profile (dashboard)
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      // Redirect logged-out users to pricing
      return NextResponse.redirect(new URL('/pricing', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/'],
}
