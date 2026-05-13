import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
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

  // Milestone requirements
  const STARTER_REQUIRED = 2
  const PRO_REQUIRED = 3

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

  // 1. Join with users table to get the current state
  const userResult = await sql`
    SELECT * FROM users WHERE github_id = ${requestedGithubId}
  `
  
  if (userResult.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  let user = userResult[0]

  // 2. Activation Logic: Check if current plan is expired and if a queued plan exists
  if (user.plan !== 'free' && user.plan_expires_at && user.plan_expires_at < new Date() && user.queued_plan) {
    const nextPlan = user.queued_plan
    // Promote queued plan to active
    const updated = await sql`
      UPDATE users 
      SET plan = ${nextPlan},
          plan_started_at = NOW(),
          plan_expires_at = NOW() + INTERVAL '30 days',
          queued_plan = NULL,
          updated_at = NOW()
      WHERE github_id = ${requestedGithubId}
      RETURNING *
    `
    user = updated[0]
  }

  // 3. Get affiliate data
  const affiliateResult = await sql`
    SELECT * FROM affiliate_users WHERE github_id = ${requestedGithubId}
  `

  if (affiliateResult.length === 0) {
    const username = usernameParam ? validateString(usernameParam, 'username', 100) : `user_${requestedGithubId}`
    const affiliate = await getOrCreateAffiliateUser(requestedGithubId, username)
    
    return NextResponse.json({
      affiliateCode: affiliate.affiliateCode,
      referralCount: affiliate.referralCount,
      paidReferralCount: affiliate.paidReferralCount,
      rewardClaimed: affiliate.rewardClaimed,
      rewardClaimedAt: affiliate.rewardClaimedAt,
      tier: user.plan || 'free',
      queuedPlan: user.queued_plan || null,
      starterRequired: STARTER_REQUIRED,
      proRequired: PRO_REQUIRED,
      progressToStarter: Math.min(((affiliate.paidReferralCount || 0) / STARTER_REQUIRED) * 100, 100),
      progressToPro: Math.min(((affiliate.paidReferralCount || 0) / PRO_REQUIRED) * 100, 100),
      referrals: [],
    })
  }

  const affiliateData = affiliateResult[0]
  const referrals = await getReferralsForAffiliate(affiliateData.id)
    
  const paidReferralCount = affiliateData.paid_referral_count || 0
  const progressToStarter = Math.min((paidReferralCount / STARTER_REQUIRED) * 100, 100)
  const progressToPro = Math.min((paidReferralCount / PRO_REQUIRED) * 100, 100)

  return NextResponse.json({
    affiliateCode: affiliateData.affiliate_code,
    referralCount: affiliateData.referral_count,
    paidReferralCount: paidReferralCount,
    rewardClaimed: affiliateData.reward_claimed || false,
    rewardClaimedAt: affiliateData.reward_claimed_at || null,
    tier: user.plan,
    queuedPlan: user.queued_plan || null,
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