'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PricingSection } from '@/components/pricing-section'
import { getUserRegion } from '@/lib/pricing'

export function HomePageClient() {
  const searchParams = useSearchParams()
  const region = getUserRegion(searchParams.get('region'))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return <PricingSection region={region} />
}
