import AboutClient from './_components/about-client'

export const metadata = {
  title: 'About BMB Renovation | 15+ Years Experience | Watford & London',
  description: 'BMB Renovation — 15+ years transforming homes in Watford, London & Hertfordshire. Meet our team and learn how we deliver premium kitchens, bathrooms & home renovations.',
  alternates: { canonical: 'https://bmbrenovation.co.uk/about' },
  openGraph: {
    title: 'About BMB Renovation | 15+ Years Experience | Watford & London',
    description: 'BMB Renovation — 15+ years transforming homes in Watford, London & Hertfordshire. Premium kitchens, bathrooms & home renovations.',
    url: 'https://bmbrenovation.co.uk/about',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BMB Renovation team' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About BMB Renovation | 15+ Years Experience',
    description: 'BMB Renovation — 15+ years transforming homes in Watford, London & Hertfordshire.',
    images: ['/og-image.png'],
  },
}

export default function AboutPage() {
  return <AboutClient />
}
