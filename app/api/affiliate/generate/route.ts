import { NextResponse } from 'next/server'
import { getOrCreateAffiliateUser } from '@/lib/affiliate-store-db'
import { rateLimit } from '@/lib/security'

export async function POST(request: Request) {
  const rateLimitResult = rateLimit(request, 10)
  if (!rateLimitResult.allowed && rateLimitResult.response) {
    return rateLimitResult.response
  }

  try {
    const body = await request.json()
    const { githubId, username } = body

    if (!githubId || typeof githubId !== 'number' || githubId <= 0) {
      return NextResponse.json({ error: 'Missing or invalid githubId' }, { status: 400 })
    }

    if (!username || typeof username !== 'string' || username.length < 1 || username.length > 100) {
      return NextResponse.json({ error: 'Missing or invalid username' }, { status: 400 })
    }

    const sanitizedUsername = username.replace(/[<>\"'&]/g, '').substring(0, 50)
    const affiliate = await getOrCreateAffiliateUser(githubId, sanitizedUsername)

    return NextResponse.json({
      affiliateCode: affiliate.affiliateCode,
    })
  } catch (error) {
    console.error('Affiliate code generation error:', error)
    return NextResponse.json({ error: 'Failed to generate affiliate code' }, { status: 500 })
  }
}