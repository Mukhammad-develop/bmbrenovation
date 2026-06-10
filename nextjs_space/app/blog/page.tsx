import BlogClient from './_components/blog-client'

export const metadata = {
  title: 'Renovation Tips & Advice Blog | BMB Renovation',
  description: 'Read expert renovation tips, design inspiration, and project guides from BMB Renovation. Your local home renovation specialist in Watford, London & Hertfordshire.',
  alternates: { canonical: 'https://bmbrenovation.co.uk/blog' },
  openGraph: {
    title: 'Renovation Tips & Advice Blog | BMB Renovation',
    description: 'Expert renovation tips, design inspiration & project guides from BMB Renovation — Watford, London & Hertfordshire.',
    url: 'https://bmbrenovation.co.uk/blog',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BMB Renovation Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Renovation Tips & Advice Blog | BMB Renovation',
    description: 'Expert renovation tips & design inspiration from BMB Renovation.',
    images: ['/og-image.png'],
  },
}

export default function BlogPage() {
  return <BlogClient />
}
