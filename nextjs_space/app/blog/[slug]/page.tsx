import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, ChevronRight, Home, Wrench } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { getPost, getPublishedPosts } from '@/lib/blog'
import PostBody from '../_components/post-body'
import Faq from '../_components/faq'

export const dynamicParams = false

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) return {}
  const url = `https://bmbrenovation.co.uk/blog/${post.slug}`
  return {
    title: `${post.title} | BMB Renovation`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.publishedAt,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ['/og-image.png'],
    },
  }
}

function titleFromPath(path: string): string {
  return path.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'BMB Renovation',
      url: 'https://bmbrenovation.co.uk',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BMB Renovation',
      url: 'https://bmbrenovation.co.uk',
      logo: { '@type': 'ImageObject', url: 'https://bmbrenovation.co.uk/og-image.png' },
    },
    mainEntityOfPage: `https://bmbrenovation.co.uk/blog/${post.slug}`,
    keywords: post.keywords.join(', '),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bmbrenovation.co.uk' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://bmbrenovation.co.uk/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://bmbrenovation.co.uk/blog/${post.slug}` },
    ],
  }

  const faqSchema =
    post.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <Header />

      {/* Article header */}
      <section className="relative pt-28 pb-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#C8A97E] transition-colors inline-flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-[#C8A97E] transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80 truncate max-w-[200px] sm:max-w-none">{post.title}</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[#C8A97E] text-xs mb-4">
            {post.targetKeyword}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-white/50 text-sm mt-5">
            <Calendar className="w-4 h-4" />
            {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            <span className="text-white/25">·</span>
            <span>BMB Renovation</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="py-14 sm:py-20 flex-grow bg-gray-50">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
            <PostBody blocks={post.blocks} />
            <Faq faq={post.faq} />

            {/* Related services */}
            {post.relatedServices.length > 0 && (
              <section className="mt-14 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-2.5 mb-5">
                  <Wrench className="w-5 h-5 text-[#C8A97E]" />
                  <h2 className="font-display text-xl font-bold text-gray-900 tracking-tight">Related Services</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {post.relatedServices.map((path) => (
                    <Link
                      key={path}
                      href={path}
                      className="px-4 py-2.5 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#C8A97E] hover:text-[#C8A97E] transition-colors"
                    >
                      {titleFromPath(path)}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
