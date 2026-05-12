'use client'

import { useEffect, useState } from 'react'
import { Loader2, Copy, Check, Users, Gift, Star, ArrowLeft, ExternalLink, Settings } from 'lucide-react'
import Link from 'next/link'
import { AffiliateStatsSkeleton } from '@/components/skeleton'
import { Navbar } from '@/components/navbar'

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
  accumulatedCredit: number
  tier: 'free' | 'starter' | 'pro'
  starterRequired: number
  proRequired: number
  progressToStarter: number
  progressToPro: number
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
  const [isClaiming, setIsClaiming] = useState<string | null>(null)

  const affiliateLink = stats?.affiliateCode && typeof window !== 'undefined'
    ? `${window.location.origin}/ref/${stats.affiliateCode}`
    : ''

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/affiliate/stats?githubId=${user.id}&username=${user.username}`)
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          setError(errData.error || `Failed to load affiliate stats (${response.status})`)
          return
        }
        const data = await response.json()
        if (data.error) {
          setError(data.error)
          return
        }
        setStats(data)
      } catch {
        setError('Failed to load affiliate stats. Please try again later.')
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
    starter: 'text-blue-400',
    pro: 'text-primary',
  }

  const tierLabels = {
    free: 'Free Tier',
    starter: 'Starter Plan',
    pro: 'Pro Plan',
  }

  const tierBgColors = {
    free: 'bg-white/5',
    starter: 'bg-blue-500/10',
    pro: 'bg-primary/10',
  }



  const handleClaim = async (plan: 'starter' | 'pro') => {
    setIsClaiming(plan)
    try {
      const response = await fetch('/api/affiliate/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, githubId: user.id }),
      })
      const data = await response.json()
      if (data.error) {
        alert(data.error)
      } else {
        alert(`Successfully claimed ${plan} plan!`)
        window.location.reload()
      }
    } catch {
      alert('Failed to claim reward')
    } finally {
      setIsClaiming(null)
    }
  }

  const formatCredit = (cents: number) => `$${(cents / 100).toFixed(2)}`

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className={`inline-block px-6 py-2 rounded-full ${tierBgColors[stats.tier]} mb-4`}>
          <span className={`text-xl font-bold ${tierColors[stats.tier]}`}>
            {tierLabels[stats.tier]}
          </span>
        </div>
        <p className="text-white/50 text-sm max-w-lg mx-auto">
          {stats.tier === 'pro'
            ? '🎉 You have Pro access!'
            : stats.tier === 'starter'
            ? '✨ You have Starter access! Earn more to upgrade to Pro.'
            : `Earn free access! Share your link and get rewards when people join.`}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/5">
          <Users className="w-8 h-8 text-white/40 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{stats.referralCount}</div>
          <div className="text-white/40 text-[10px] uppercase tracking-wider">Joined</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/5">
          <Gift className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">{stats.paidReferralCount}</div>
          <div className="text-white/40 text-[10px] uppercase tracking-wider">Paid</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/5 col-span-2">
          <div className="flex items-center justify-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
               <Star className="w-5 h-5 text-primary" />
             </div>
             <div className="text-3xl font-bold text-white">{stats.paidReferralCount}</div>
          </div>
          <div className="text-white/40 text-[10px] uppercase tracking-wider">Total Upgrades Referred</div>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl p-8 border border-white/5 space-y-10">
        <h3 className="text-lg font-bold text-white text-center">Reward Progress</h3>
        
        <div className="space-y-8">
          {/* Starter Progress */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="text-white font-bold flex items-center gap-2">
                  Starter Reward <span className="text-xs font-normal text-white/40">(Value: 30 Days)</span>
                </h4>
                <p className="text-white/40 text-xs">Unlock with {stats.starterRequired || 2} paid referrals</p>
              </div>
              <div className="text-right">
                <span className="text-white font-mono text-sm">{stats.paidReferralCount} / {stats.starterRequired || 2}</span>
              </div>
            </div>
            <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${stats.progressToStarter}%` }}
              />
            </div>
            <button 
              disabled={stats.paidReferralCount < (stats.starterRequired || 2) || isClaiming !== null || stats.tier === 'starter' || stats.tier === 'pro'}
              onClick={() => handleClaim('starter')}
              className="w-full py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold hover:bg-blue-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isClaiming === 'starter' ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.tier === 'starter' || stats.tier === 'pro' ? <Check className="w-4 h-4" /> : null}
              {stats.tier === 'starter' || stats.tier === 'pro' ? 'Already Unlocked' : 'Claim Starter Plan'}
            </button>
          </div>

          <div className="h-px bg-white/5" />

          {/* Pro Progress */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="text-white font-bold flex items-center gap-2">
                  Pro Reward <span className="text-xs font-normal text-white/40">(Value: 30 Days)</span>
                </h4>
                <p className="text-white/40 text-xs">Unlock with {stats.proRequired || 3} paid referrals</p>
              </div>
              <div className="text-right">
                <span className="text-white font-mono text-sm">{stats.paidReferralCount} / {stats.proRequired || 3}</span>
              </div>
            </div>
            <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                style={{ width: `${stats.progressToPro}%` }}
              />
            </div>
            <button 
              disabled={stats.paidReferralCount < (stats.proRequired || 3) || isClaiming !== null || stats.tier === 'pro'}
              onClick={() => handleClaim('pro')}
              className="w-full py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold hover:bg-primary/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isClaiming === 'pro' ? <Loader2 className="w-4 h-4 animate-spin" /> : stats.tier === 'pro' ? <Check className="w-4 h-4" /> : null}
              {stats.tier === 'pro' ? 'Already Unlocked' : 'Claim Pro Plan'}
            </button>
          </div>
        </div>
      </div>

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
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/user')
        if (!response.ok) {
          window.location.href = '/login'
          return
        }
        const data = await response.json()
        setUser({
          id: data.user.id,
          username: data.user.username,
          name: data.user.name,
          email: data.user.email,
          avatarUrl: data.user.avatarUrl,
        })
      } catch (e) {
        console.error('Failed to fetch user:', e)
        window.location.href = '/login'
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
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
      <Navbar />
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