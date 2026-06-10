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
  const serviceSchema = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Kitchen Fitting & Installation",
      "provider": {
        "@type": "HomeAndConstructionBusiness",
        "name": "BMB Renovation",
        "telephone": "+447775758717",
        "image": "https://bmbrenovation.co.uk/og-image.png",
        "priceRange": "££",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "157 Judge Street",
          "addressLocality": "Watford",
          "postalCode": "WD24 5AN",
          "addressCountry": "GB"
        }
      },
      "areaServed": [
        { "@type": "City", "name": "Watford" },
        { "@type": "City", "name": "Bushey" },
        { "@type": "City", "name": "Rickmansworth" },
        { "@type": "City", "name": "St Albans" },
        { "@type": "City", "name": "Hemel Hempstead" },
        { "@type": "City", "name": "Borehamwood" },
        { "@type": "City", "name": "Harrow" },
        { "@type": "City", "name": "Croxley Green" },
        { "@type": "City", "name": "Luton" },
        { "@type": "City", "name": "Bedford" }
      ],
      "description": "Premium kitchen design, supply, and professional fitting services. All plumbing, tiling, electrical, and cabinet installation handled in-house."
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Bathroom Renovation & Fitting",
      "provider": {
        "@type": "HomeAndConstructionBusiness",
        "name": "BMB Renovation",
        "telephone": "+447775758717",
        "image": "https://bmbrenovation.co.uk/og-image.png",
        "priceRange": "££",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "157 Judge Street",
          "addressLocality": "Watford",
          "postalCode": "WD24 5AN",
          "addressCountry": "GB"
        }
      },
      "areaServed": [
        { "@type": "City", "name": "Watford" },
        { "@type": "City", "name": "Bushey" },
        { "@type": "City", "name": "Rickmansworth" },
        { "@type": "City", "name": "St Albans" },
        { "@type": "City", "name": "Hemel Hempstead" },
        { "@type": "City", "name": "Borehamwood" },
        { "@type": "City", "name": "Harrow" },
        { "@type": "City", "name": "Croxley Green" },
        { "@type": "City", "name": "Luton" },
        { "@type": "City", "name": "Bedford" }
      ],
      "description": "Complete bathroom remodeling services, from wetrooms and walk-in showers to premium vanity fitting, tiling, and expert waterproofing."
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "House Renovation & Extensions",
      "provider": {
        "@type": "HomeAndConstructionBusiness",
        "name": "BMB Renovation",
        "telephone": "+447775758717",
        "image": "https://bmbrenovation.co.uk/og-image.png",
        "priceRange": "££",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "157 Judge Street",
          "addressLocality": "Watford",
          "postalCode": "WD24 5AN",
          "addressCountry": "GB"
        }
      },
      "areaServed": [
        { "@type": "City", "name": "Watford" },
        { "@type": "City", "name": "Bushey" },
        { "@type": "City", "name": "Rickmansworth" },
        { "@type": "City", "name": "St Albans" },
        { "@type": "City", "name": "Hemel Hempstead" },
        { "@type": "City", "name": "Borehamwood" },
        { "@type": "City", "name": "Harrow" },
        { "@type": "City", "name": "Croxley Green" },
        { "@type": "City", "name": "Luton" },
        { "@type": "City", "name": "Bedford" }
      ],
      "description": "Bespoke home extensions, loft conversions, structural alterations, and full-property interior remodeling from design to Snagging handover."
    }
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <ServicesClient />
    </>
  )
}
