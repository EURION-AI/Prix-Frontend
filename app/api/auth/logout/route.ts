import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  
  // Delete all auth-related cookies
  cookieStore.delete('github_token')
  cookieStore.delete('github_user')
  cookieStore.delete('session_id')
  
  return NextResponse.json({ success: true })
}
