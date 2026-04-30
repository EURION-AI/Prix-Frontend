'use client'

import { useEffect, useState } from 'react'
import { Loader2, Github, Search, Check, AlertCircle, ChevronRight, LayoutDashboard, Settings, Gift, LogOut, User, Bell, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  private: boolean
  updated_at: string
}

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

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [repos, setRepos] = useState<Repository[]>([])
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('github_user='))
    
    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]))
        setUser(userData)
        if (userData.selectedRepos) {
          setSelectedRepos(userData.selectedRepos)
        }
        fetchRepos()
      } catch {
        window.location.href = '/login'
      }
    } else {
      window.location.href = '/login'
    }
  }, [])

  useEffect(() => {
    const filtered = repos.filter(repo => 
      repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredRepos(filtered)
  }, [searchTerm, repos])

  async function fetchRepos() {
    try {
      const response = await fetch('/api/github/repos')
      if (!response.ok) throw new Error('Failed to fetch repositories')
      const data = await response.json()
      setRepos(data)
      setFilteredRepos(data)
    } catch (err) {
      setError('Could not load repositories from GitHub. Please try logging in again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/'
    } catch (err) {
      console.error('Failed to logout:', err)
    }
  }

  async function handleRepoSelect(repoName: string) {
    const action = selectedRepos.includes(repoName) ? 'remove' : 'add'
    
    // Frontend limit check
    if (user && action === 'add') {
      const limit = user.plan === 'max' ? Infinity : (user.plan === 'pro' ? 15 : 5)
      if (selectedRepos.length >= limit) {
        setError(`Your ${user.plan.toUpperCase()} plan limits you to ${limit} repositories. Please upgrade to add more.`)
        return
      }
    }
    
    setIsSaving(true)
    setError(null)
    try {
      const response = await fetch('/api/github/select-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repoName, action }),
      })
      
      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Failed to save selection')
      
      if (user) {
        const updatedUser = { ...user, selectedRepos: data.selectedRepos }
        document.cookie = `github_user=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=${60 * 60 * 24 * 7}`
        setUser(updatedUser)
      }
      
      setSelectedRepos(data.selectedRepos)
    } catch (err: any) {
      setError(err.message || 'Failed to save your repository selection.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center relative">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-[#050508] to-[#050508] pointer-events-none" />
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-white/50 animate-pulse">Loading your GitHub universe...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#050508] text-white selection:bg-primary/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2 text-primary">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-widest">User Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
              Initialize Your Project
            </h1>
            <p className="text-white/50 text-lg max-w-2xl">
              Select a GitHub repository to enable Prix's automated intelligence and performance monitoring.
            </p>
          </div>

          <div className="flex gap-3">
            <Link 
              href="/affiliate"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center gap-2 group"
            >
              <Gift className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
              <span className="font-medium">Affiliate Program</span>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center gap-2 group outline-none">
                  <Settings className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
                  <span className="font-medium">Settings</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#0c0c12] border-white/10 text-white" align="end">
                <DropdownMenuLabel className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Account Settings</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="hover:bg-white/5 cursor-pointer" asChild>
                    <Link href="/dashboard/profile">
                      <User className="mr-2 h-4 w-4 text-primary" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/5 cursor-pointer">
                    <Bell className="mr-2 h-4 w-4 text-primary" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-white/5 cursor-pointer" asChild>
                    <Link href="/dashboard/settings/billing">
                      <CreditCard className="mr-2 h-4 w-4 text-primary" />
                      <span>Billing</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="hover:bg-red-500/10 text-red-400 focus:text-red-400 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search your repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-white/20"
            />
          </div>
          {user && (
            <div className="bg-white/5 border border-white/10 rounded-2xl py-5 px-6 flex items-center gap-4 min-w-max">
              <span className="text-white/40 font-medium">Selected Repositories</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-primary">{selectedRepos.length}</span>
                <span className="text-white/20">/</span>
                <span className="text-lg font-bold text-white/60">
                  {user.plan === 'max' ? '∞' : (user.plan === 'pro' ? '15' : '5')}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRepos.length > 0 ? (
            filteredRepos.map((repo) => (
              <button
                key={repo.id}
                onClick={() => handleRepoSelect(repo.full_name)}
                disabled={isSaving}
                className={`text-left p-6 rounded-2xl border transition-all relative group ${
                  selectedRepos.includes(repo.full_name) 
                    ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]' 
                    : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${repo.private ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      <Github className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg truncate max-w-[200px]">{repo.name}</span>
                  </div>
                  {repo.private && (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/5 border border-white/10 rounded-md text-white/40">
                      Private
                    </span>
                  )}
                </div>
                
                <p className="text-white/40 text-sm mb-6 line-clamp-2 min-h-[40px]">
                  {repo.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-white/20 font-mono">
                    Last updated: {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    {isSaving && selectedRepos.includes(repo.full_name) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : selectedRepos.includes(repo.full_name) ? (
                      <span className="flex items-center gap-2 text-red-400 hover:text-red-300">
                        Remove
                      </span>
                    ) : (
                      <>
                        <span>Select</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </div>

                {selectedRepos.includes(repo.full_name) && (
                  <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-white/20 text-xl">No repositories found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
