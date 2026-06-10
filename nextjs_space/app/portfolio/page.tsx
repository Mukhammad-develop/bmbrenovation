import PortfolioClient from './_components/portfolio-client'

export const metadata = {
  title: 'Portfolio | Completed Renovation Projects | BMB Renovation',
  description: 'View our portfolio of completed renovation projects — luxury kitchens, stylish bathrooms & full home renovations in Watford, London & Hertfordshire. Over 2,000 projects delivered.',
  alternates: { canonical: 'https://bmbrenovation.co.uk/portfolio' },
  openGraph: {
    title: 'Portfolio | Completed Renovation Projects | BMB Renovation',
    description: 'Luxury kitchens, stylish bathrooms & full home renovations in Watford, London & Hertfordshire. Over 2,000 projects delivered.',
    url: 'https://bmbrenovation.co.uk/portfolio',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BMB Renovation portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | BMB Renovation',
    description: 'Luxury kitchens, stylish bathrooms & full home renovations in Watford & London.',
    images: ['/og-image.png'],
  },
}

export default function PortfolioPage() {
  return <PortfolioClient />
}
