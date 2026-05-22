'use client'

import { useEffect, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function ReferralPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function handleReferral() {
      try {
        const response = await fetch(`/api/affiliate/click?code=${code}`)
        
        if (response.ok) {
          router.push(`/?ref=${code}`)
        } else {
          const error = searchParams.get('error') || 'invalid_code'
          router.push(`/?error=${error}`)
        }
      } catch (error) {
        console.error('Referral error:', error)
        router.push('/?error=click_failed')
      }
    }

    handleReferral()
  }, [code, router, searchParams])

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-white/60">Redirecting...</p>
      </div>
    </div>
  )
}
