'use client'

import { useEffect, useState } from 'react'
import { Loader2, Copy, Check, Users, Gift, Star, ArrowLeft, ExternalLink, CreditCard, Settings } from 'lucide-react'
import Link from 'next/link'
import { AffiliateStatsSkeleton } from '@/components/skeleton'

interface UserData {
  id: number
  username: string
  name: string | null
  email: string | null
  avatarUrl: string
}

interface AffiliateStats {
  affiliateCode: string
  referralCount: number
  paidReferralCount: number
  tier: 'free' | 'basic' | 'advanced'
  requiredForBasic: number
  requiredForAdvanced: number
  progressToBasic: number
  progressToAdvanced: number
  referrals: {
    username: string
    hasPurchased: boolean
    createdAt: string
  }[]
}

function AffiliateDashboard({ user }: { user: UserData }) {
  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const affiliateLink = stats?.affiliateCode && typeof window !== 'undefined'
    ? `${window.location.origin}/api/affiliate/click?code=${stats.affiliateCode}`
    : ''

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/affiliate/stats?githubId=${user.id}&username=${user.username}`)
        const data = await response.json()
        setStats(data)
      } catch {
        setError('Failed to load affiliate stats')
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [user.id, user.username])

  const copyToClipboard = async () => {
    if (affiliateLink) {
      await navigator.clipboard.writeText(affiliateLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <AffiliateStatsSkeleton />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">{error || 'Failed to load stats'}</p>
      </div>
    )
  }

  const tierColors = {
    free: 'text-white/40',
    basic: 'text-blue-400',
    advanced: 'text-primary',
  }

  const tierLabels = {
    free: 'Free Tier',
    basic: 'Pro Plan',
    advanced: 'Team Plan',
  }

  const tierBgColors = {
    free: 'bg-white/5',
    basic: 'bg-blue-500/10',
    advanced: 'bg-primary/10',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className={`inline-block px-6 py-2 rounded-full ${tierBgColors[stats.tier]} mb-4`}>
          <span className={`text-xl font-bold ${tierColors[stats.tier]}`}>
            {tierLabels[stats.tier]}
          </span>
        </div>
        <p className="text-white/50 text-sm max-w-lg mx-auto">
          {stats.tier === 'advanced' 
            ? '🎉 You have lifetime Team access!' 
            : stats.tier === 'basic'
            ? '✨ You have lifetime Pro access!'
            : `Earn free access! Get ${stats.requiredForBasic - stats.paidReferralCount} more paid referrals for Pro.`}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/5">
          <Users className="w-8 h-8 text-white/40 mx-auto mb-3" />
          <div className="text-4xl font-bold text-white mb-1">{stats.referralCount}</div>
          <div className="text-white/40 text-xs uppercase tracking-wider">Total Referrals</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/5">
          <Gift className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <div className="text-4xl font-bold text-white mb-1">{stats.paidReferralCount}</div>
          <div className="text-white/40 text-xs uppercase tracking-wider">Paid Referrals</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/5">
          <Star className={`w-8 h-8 mx-auto mb-3 ${tierColors[stats.tier]}`} />
          <div className={`text-4xl font-bold mb-1 ${tierColors[stats.tier]}`}>
            {stats.tier === 'free' ? '0' : stats.tier === 'basic' ? '1' : '2'}
          </div>
          <div className="text-white/40 text-xs uppercase tracking-wider">Unlocks</div>
        </div>
      </div>

      {stats.tier !== 'advanced' && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-white text-center">Progress to Next Tier</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Pro Plan ({stats.requiredForBasic} paid)</span>
                <span className="text-white font-medium">{stats.paidReferralCount}/{stats.requiredForBasic}</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-400 transition-all duration-700 ease-out rounded-full"
                  style={{ width: `${stats.progressToBasic}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 border border-primary/20">
        <h3 className="text-xl font-bold text-white mb-2">Your Referral Link</h3>
        <p className="text-white/50 text-sm mb-6">
          Share this link with friends. When they sign up and purchase, you get rewarded!
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={affiliateLink}
            readOnly
            className="flex-1 bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white/80 text-sm font-mono"
          />
          <button
            onClick={copyToClipboard}
            className="px-6 py-4 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-bold flex items-center gap-2"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {stats.tier !== 'free' && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4">Manage Subscription</h3>
          <p className="text-white/50 text-sm mb-4">
            You have an active {tierLabels[stats.tier]} subscription. Click below to manage your billing, update payment method, or cancel.
          </p>
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/stripe/portal', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ githubId: user.id }),
                })
                const data = await response.json()
                if (data.url) {
                  window.location.href = data.url
                }
              } catch {
                console.error('Failed to open billing portal')
              }
            }}
            className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors font-medium flex items-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Manage Billing
          </button>
        </div>
      )}

      <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
        <h3 className="text-lg font-bold text-white mb-6">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h4 className="font-bold text-white mb-2">Share Your Link</h4>
            <p className="text-white/50 text-sm">Copy your unique referral link and share it.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h4 className="font-bold text-white mb-2">They Sign Up</h4>
            <p className="text-white/50 text-sm">When someone creates an account, they become your referral.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h4 className="font-bold text-white mb-2">You Get Rewards</h4>
            <p className="text-white/50 text-sm">When they purchase, you earn free Pro access!</p>
          </div>
        </div>
      </div>

      {stats.referrals.length > 0 && (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6">Your Referrals ({stats.referrals.length})</h3>
          <div className="space-y-3">
            {stats.referrals.map((referral, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-white/60 font-medium">{referral.username[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-white font-medium">{referral.username}</span>
                    <p className="text-white/30 text-xs">{new Date(referral.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {referral.hasPurchased ? (
                  <span className="px-4 py-1.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">Paid ✓</span>
                ) : (
                  <span className="px-4 py-1.5 bg-white/10 text-white/60 text-xs font-bold rounded-full">Signed Up</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function AffiliatePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('github_user='))
    
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
        setUser({
          id: userData.id,
          username: userData.username,
          name: userData.name,
          email: userData.email,
          avatarUrl: userData.avatarUrl,
        })
      } catch {
        window.location.href = '/login'
      }
    } else {
      window.location.href = '/login'
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
        <Loader2 className="w-10 h-10 animate-spin text-white/50" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#050508] pt-32 pb-20 px-4 relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-white">Earn Free Access</h1>
            </div>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Share Prix with your friends and community. Get free Pro access when they upgrade.
            </p>
          </div>
        </div>

        <AffiliateDashboard user={user} />
      </div>
    </div>
  )
}