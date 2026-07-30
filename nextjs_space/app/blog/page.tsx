import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { getPublishedPosts } from '@/lib/blog'
import PostCard from './_components/post-card'

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
  const posts = getPublishedPosts()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-20 pb-0">
        <div className="relative h-[250px] sm:h-[300px] overflow-hidden">
          <Image
            src="/images/14_construction_team.webp"
            alt="BMB Renovation Blog"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-4">
                <Sparkles className="w-4 h-4 text-[#C8A97E]" />
                <span className="text-white/90 text-sm">Our Blog</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">
                Renovation Tips &{' '}<span className="text-[#C8A97E]">Advice</span>
              </h1>
              <p className="text-white/70 mt-3 max-w-lg">
                Honest guides for homeowners planning kitchens, bathrooms and renovations across Hertfordshire, London &amp; Bedfordshire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 sm:py-24 flex-grow bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
              <p className="text-lg">New articles are on their way — check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
