import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, MapPin, ChefHat, Bath, Hammer, Paintbrush } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import type { Metadata } from 'next'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Areas We Cover | Home, Kitchen & Bathroom Renovations | BMB Renovation',
  description: 'View the full list of areas covered by BMB Renovation across Hertfordshire, London & Bedfordshire. Kitchen fitting, bathroom renovations, and full home remodelling.',
  alternates: {
    canonical: 'https://bmbrenovation.co.uk/locations',
  },
  openGraph: {
    title: 'Areas We Cover | BMB Renovation',
    description: 'BMB Renovation serves Watford, Bushey, St Albans, Hemel Hempstead, Harrow, Luton, Bedford & surrounding areas.',
    url: 'https://bmbrenovation.co.uk/locations',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'BMB Renovation Locations' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Areas We Cover | BMB Renovation',
    description: 'BMB Renovation served areas list across Hertfordshire, London & Bedfordshire.',
    images: ['/og-image.png'],
  },
}

const cities = [
  {
    name: 'Watford',
    postcodes: 'WD17, WD18, WD19, WD24, WD25',
    slug: 'watford'
  },
  {
    name: 'Bushey',
    postcodes: 'WD23',
    slug: 'bushey'
  },
  {
    name: 'Rickmansworth',
    postcodes: 'WD3',
    slug: 'rickmansworth'
  },
  {
    name: 'St Albans',
    postcodes: 'AL1, AL2, AL3, AL4',
    slug: 'st-albans'
  },
  {
    name: 'Hemel Hempstead',
    postcodes: 'HP1, HP2, HP3',
    slug: 'hemel-hempstead'
  },
  {
    name: 'Borehamwood',
    postcodes: 'WD6',
    slug: 'borehamwood'
  },
  {
    name: 'Harrow',
    postcodes: 'HA1, HA2, HA3',
    slug: 'harrow'
  },
  {
    name: 'Croxley Green',
    postcodes: 'WD3 3XX',
    slug: 'croxley-green'
  },
  {
    name: 'Luton',
    postcodes: 'LU1, LU2, LU3, LU4',
    slug: 'luton'
  },
  {
    name: 'Bedford',
    postcodes: 'MK40, MK41, MK42, MK43, MK44, MK45',
    slug: 'bedford'
  }
]

export default function LocationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Header />

        {/* Hero Section */}
        <section className="relative pt-20 pb-0">
          <div className="relative h-[300px] sm:h-[360px] overflow-hidden">
            <Image
              src="/images/08_glass_extension.webp"
              alt="BMB Renovation Areas We Serve"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-4">
                  <Sparkles className="w-4 h-4 text-[#C8A97E]" />
                  <span className="text-white/90 text-sm font-medium">Areas We Serve</span>
                </div>
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                  Our Service <span className="text-[#C8A97E]">Locations</span>
                </h1>
                <p className="text-white/70 mt-3 max-w-xl text-base leading-relaxed">
                  We are based in Watford and provide professional home renovation, kitchen fitting, and bathroom remodelling services throughout Hertfordshire, North London, and Bedfordshire.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Locations Grid */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">Served Areas</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4 tracking-tight">
                Find Your Local Renovation Specialists
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
                Click on the service links under your city to request a free local consultation and written quote.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cities.map((city) => (
                <div
                  key={city.name}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* City Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#C8A97E]/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6 text-[#C8A97E]" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-gray-900">{city.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Postcodes: {city.postcodes}</p>
                      </div>
                    </div>

                    {/* Services Links list */}
                    <div className="space-y-3 pt-2">
                      <Link
                        href={`/kitchen-renovation-${city.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-50 bg-gray-50/50 hover:bg-[#C8A97E]/5 hover:border-[#C8A97E]/20 text-gray-700 hover:text-[#C8A97E] text-sm font-semibold transition-all group"
                      >
                        <ChefHat className="w-4 h-4 text-[#C8A97E] shrink-0" />
                        <span>Kitchen Renovation</span>
                        <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                      </Link>

                      <Link
                        href={`/kitchen-fitting-${city.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-50 bg-gray-50/50 hover:bg-[#C8A97E]/5 hover:border-[#C8A97E]/20 text-gray-700 hover:text-[#C8A97E] text-sm font-semibold transition-all group"
                      >
                        <Hammer className="w-4 h-4 text-[#C8A97E] shrink-0" />
                        <span>Kitchen Fitting</span>
                        <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                      </Link>

                      <Link
                        href={`/bathroom-renovation-${city.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-50 bg-gray-50/50 hover:bg-[#C8A97E]/5 hover:border-[#C8A97E]/20 text-gray-700 hover:text-[#C8A97E] text-sm font-semibold transition-all group"
                      >
                        <Bath className="w-4 h-4 text-[#C8A97E] shrink-0" />
                        <span>Bathroom Renovation</span>
                        <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                      </Link>

                      <Link
                        href={`/bathroom-fitting-${city.slug}`}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-50 bg-gray-50/50 hover:bg-[#C8A97E]/5 hover:border-[#C8A97E]/20 text-gray-700 hover:text-[#C8A97E] text-sm font-semibold transition-all group"
                      >
                        <Paintbrush className="w-4 h-4 text-[#C8A97E] shrink-0" />
                        <span>Bathroom Fitting</span>
                        <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
