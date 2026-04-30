'use client'

import { useEffect, useState } from 'react'
import { Loader2, ArrowLeft, Github, GitPullRequest, LayoutDashboard, Shield, Crown } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import Image from 'next/image'

interface UserData {
  id: number
  username: string
  name: string | null
  email: string | null
  avatarUrl: string
  plan: 'free' | 'pro' | 'max'
  selectedRepos: string[]
  prsReviewed: number
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('github_user='))
    
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
        setUser(userData)
      } catch {
        window.location.href = '/login'
      }
    } else {
      window.location.href = '/login'
    }
    setIsLoading(false)
  }, [])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'max': return <Crown className="w-5 h-5 text-yellow-400" />
      case 'pro': return <Shield className="w-5 h-5 text-blue-400" />
      default: return <Shield className="w-5 h-5 text-white/40" />
    }
  }

  return (
    <main className="min-h-screen bg-[#050508] text-white selection:bg-primary/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Github className="w-64 h-64" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.username} 
                  className="relative w-32 h-32 rounded-full border-2 border-white/10 object-cover"
                />
              ) : (
                <div className="relative w-32 h-32 rounded-full border-2 border-white/10 bg-white/5 flex items-center justify-center">
                  <User className="w-12 h-12 text-white/20" />
                </div>
              )}
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                {user.name || user.username}
              </h1>
              <p className="text-white/40 text-lg font-mono mb-4">@{user.username}</p>
              
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                  {getPlanIcon(user.plan)}
                  <span className="font-bold uppercase tracking-wider text-sm">
                    {user.plan} Plan
                  </span>
                </div>
                {user.email && (
                  <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/60 text-sm">
                    {user.email}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0c0c12] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-primary mb-4">
                <LayoutDashboard className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-widest text-sm">Repositories</h3>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black">{user.selectedRepos?.length || 0}</span>
                <span className="text-white/40 mb-1">
                  / {user.plan === 'max' ? '∞' : (user.plan === 'pro' ? '15' : '5')}
                </span>
              </div>
              <p className="text-white/40 text-sm mt-2">Active monitored repositories</p>
            </div>

            <div className="bg-[#0c0c12] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-primary mb-4">
                <GitPullRequest className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-widest text-sm">PRs Analyzed</h3>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black">{user.prsReviewed || 0}</span>
              </div>
              <p className="text-white/40 text-sm mt-2">Total pull requests processed by Prix</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
