import ContactClient from './_components/contact-client'

export const metadata = {
  title: 'Contact BMB Renovation | Free Quote | Watford & London',
  description: 'Get in touch with BMB Renovation for a free, no-obligation consultation. Call +44 7775 758 717 or fill in our quote form. Serving Watford, London & Hertfordshire.',
  alternates: { canonical: 'https://bmbrenovation.co.uk/contact' },
  openGraph: {
    title: 'Contact BMB Renovation | Free Quote | Watford & London',
    description: 'Get a free, no-obligation consultation. Call +44 7775 758 717. Serving Watford, London & Hertfordshire.',
    url: 'https://bmbrenovation.co.uk/contact',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Contact BMB Renovation' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact BMB Renovation | Free Quote',
    description: 'Get a free, no-obligation consultation. Call +44 7775 758 717.',
    images: ['/og-image.png'],
  },
}

export default function ContactPage() {
  return <ContactClient />
}
