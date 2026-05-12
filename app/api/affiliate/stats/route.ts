import { NextRequest, NextResponse } from 'next/server'
import { validateGitHubId, validateString } from '@/lib/validation'
import { getOrCreateAffiliateUser, getAffiliateUserByGithubId, getReferralsForAffiliate } from '@/lib/affiliate-store-db'

function getAuthenticatedUserId(request: NextRequest): number | null {
  const userCookie = request.cookies.get('github_user')?.value
  if (!userCookie) return null
  try {
    const user = JSON.parse(decodeURIComponent(userCookie))
    return typeof user.id === 'number' ? user.id : null
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const githubIdParam = searchParams.get('githubId')
  const usernameParam = searchParams.get('username')
  const authToken = request.cookies.get('github_token')?.value

  if (!authToken) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const authenticatedUserId = getAuthenticatedUserId(request)
  if (!authenticatedUserId) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  if (!githubIdParam) {
    return NextResponse.json({ error: 'Missing githubId parameter' }, { status: 400 })
  }

  const requestedGithubId = parseInt(githubIdParam, 10)
  if (isNaN(requestedGithubId) || !validateGitHubId(requestedGithubId)) {
    return NextResponse.json({ error: 'Invalid githubId' }, { status: 400 })
  }

  if (requestedGithubId !== authenticatedUserId) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  if (usernameParam && usernameParam.length > 100) {
    return NextResponse.json({ error: 'Username too long' }, { status: 400 })
  }

  let affiliate = await getAffiliateUserByGithubId(requestedGithubId)
    
  if (!affiliate) {
    const username = usernameParam ? validateString(usernameParam, 'username', 100) : `user_${requestedGithubId}`
    affiliate = await getOrCreateAffiliateUser(requestedGithubId, username)
  }

  const referrals = await getReferralsForAffiliate(affiliate.id)
    
  // Milestone requirements
  const STARTER_REQUIRED = 2
  const PRO_REQUIRED = 3
  
  const paidReferralCount = affiliate.paidReferralCount || 0
  const progressToStarter = Math.min((paidReferralCount / STARTER_REQUIRED) * 100, 100)
  const progressToPro = Math.min((paidReferralCount / PRO_REQUIRED) * 100, 100)

  return NextResponse.json({
    affiliateCode: affiliate.affiliateCode,
    referralCount: affiliate.referralCount,
    paidReferralCount: paidReferralCount,
    accumulatedCredit: affiliate.accumulatedCredit || 0,
    tier: affiliate.tier,
    starterRequired: STARTER_REQUIRED,
    proRequired: PRO_REQUIRED,
    progressToStarter,
    progressToPro,
    referrals: referrals.map(r => ({
      username: sanitizeUsername(r.referredUsername || 'Anonymous'),
      hasPurchased: r.hasPurchased,
      purchasedPlan: r.purchasedPlan || null,
      createdAt: r.createdAt,
    })),
  })
}

function sanitizeUsername(username: string): string {
  return username.replace(/[<>\"'&]/g, '').substring(0, 50)
}