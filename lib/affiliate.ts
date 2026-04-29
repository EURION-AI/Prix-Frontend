export interface AffiliateUser {
  id: string
  githubId: number
  username: string
  affiliateCode: string
  referralCount: number
  paidReferralCount: number
  tier: 'free' | 'basic' | 'advanced'
  createdAt: string
}

export interface Referral {
  id: string
  affiliateId: string
  referredGithubId: number
  referredUsername: string
  referredIpHash: string
  hasPurchased: boolean
  createdAt: string
}

export const AFFILIATE_TIERS = {
  free: { requiredReferrals: 0 },
  basic: { requiredReferrals: 2 },
  advanced: { requiredReferrals: 3 },
} as const

export function generateAffiliateCode(username: string): string {
  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 15)
  const timestamp = Date.now().toString(36)
  const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .reduce((acc, byte) => acc + byte.toString(36).padStart(2, '0'), '')
  return `${cleanUsername}_${timestamp}_${randomPart}`.substring(0, 50)
}

export async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + 'prix_salt_v1')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 32)
}

export function getAffiliateTier(paidReferralCount: number): 'free' | 'basic' | 'advanced' {
  if (paidReferralCount >= AFFILIATE_TIERS.advanced.requiredReferrals) return 'advanced'
  if (paidReferralCount >= AFFILIATE_TIERS.basic.requiredReferrals) return 'basic'
  return 'free'
}