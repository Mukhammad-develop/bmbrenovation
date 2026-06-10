import type { Metadata } from 'next'
import HomeClient from './_components/home-client'

export const metadata: Metadata = {
  title: 'BMB Renovation | Premium Home, Kitchen & Bathroom Renovation in Watford & London',
  description: 'BMB Renovation offers premium home, kitchen & bathroom renovation services in Watford, London & Hertfordshire. Free consultation. Get your quote today. Call +44 7775 758 717.',
  alternates: { canonical: 'https://bmbrenovation.co.uk' },
  openGraph: {
    title: 'BMB Renovation | Premium Home, Kitchen & Bathroom Renovation in Watford & London',
    description: 'BMB Renovation offers premium home, kitchen & bathroom renovation services in Watford, London & Hertfordshire. Free consultation. Call +44 7775 758 717.',
    url: 'https://bmbrenovation.co.uk',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BMB Renovation - Premium Home Renovation Services in Watford' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMB Renovation | Premium Home, Kitchen & Bathroom Renovation in Watford & London',
    description: 'BMB Renovation offers premium home, kitchen & bathroom renovation services in Watford, London & Hertfordshire.',
    images: ['/og-image.png'],
  },
}

export default function HomePage() {
  return (
    <>
      <link
        rel="preload"
        href="/images/01_hero_luxury_interior_mobile.webp"
        as="image"
        type="image/webp"
        media="(max-width: 640px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        href="/images/01_hero_luxury_interior.webp"
        as="image"
        type="image/webp"
        media="(min-width: 641px)"
        fetchPriority="high"
      />
      <HomeClient />
    </>
  )
}

