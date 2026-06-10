import ServicesClient from './_components/services-client'

export const metadata = {
  title: 'Renovation Services | Kitchens, Bathrooms & Home Renovations | BMB Renovation',
  description: 'Explore BMB Renovation\'s full range of services: kitchen renovations, bathroom fitting, home extensions, loft conversions & more in Watford, London & Hertfordshire.',
  alternates: { canonical: 'https://bmbrenovation.co.uk/services' },
  openGraph: {
    title: 'Renovation Services | Kitchens, Bathrooms & Home Renovations | BMB Renovation',
    description: 'Kitchen renovations, bathroom fitting, home extensions & more in Watford, London & Hertfordshire.',
    url: 'https://bmbrenovation.co.uk/services',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BMB Renovation Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Renovation Services | BMB Renovation',
    description: 'Kitchen renovations, bathroom fitting, home extensions & more in Watford & London.',
    images: ['/og-image.png'],
  },
}

export default function ServicesPage() {
  return <ServicesClient />
}
