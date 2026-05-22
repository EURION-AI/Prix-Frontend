export interface AffiliateUser {
  id: string
  githubId: number
  username: string
  affiliateCode: string
  referralCount: number
  paidReferralCount: number
  rewardClaimed: boolean
  rewardClaimedAt?: string | null
  createdAt: string
  updatedAt?: string
}

export interface Referral {
  id: string
  affiliateId: string
  referredGithubId: number
  referredUsername: string
  referredIpHash: string
  hasPurchased: boolean
  purchasedPlan?: string | null
  purchasedAmount?: number | null
  createdAt: string
}

export const AFFILIATE_TIERS = {
  free: { requiredReferrals: 0 },
  starter: { requiredReferrals: 2 },
  pro: { requiredReferrals: 3 },
} as const

export function generateAffiliateCode(username: string): string {
  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 6)
  const array = new Uint8Array(3)
  crypto.getRandomValues(array)
  const randomPart = Array.from(array).map(b => b.toString(36).padStart(2, '0')).join('').substring(0, 4)
  const code = cleanUsername + randomPart
  return code.length >= 6 ? code : code + randomPart.substring(0, 8 - code.length)
}

export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + (process.env.IP_SALT || 'prix_salt_v1'))
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 32)
}

// Tiers are now managed in the main users table.