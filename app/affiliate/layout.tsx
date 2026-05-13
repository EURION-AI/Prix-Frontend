import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Affiliate Program | Prix AI — Earn Free AI Code Reviews',
  description: 'Refer developers to Prix AI and earn free Starter or Pro plans. Share your affiliate link, earn rewards for every paid referral.',
  alternates: {
    canonical: 'https://www.prixai.xyz/affiliate',
  },
}

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
