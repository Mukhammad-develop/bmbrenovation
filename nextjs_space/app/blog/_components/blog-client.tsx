'use client'

import Image from 'next/image'
import Script from 'next/script'
import { Sparkles } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AnimatedSection from '@/components/animated-section'

export default function BlogClient() {
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
              <AnimatedSection>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-4">
                  <Sparkles className="w-4 h-4 text-[#C8A97E]" />
                  <span className="text-white/90 text-sm">Our Blog</span>
                </div>
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">
                  Latest Insights &{' '}<span className="text-[#C8A97E]">News</span>
                </h1>
                <p className="text-white/70 mt-3 max-w-lg">Home &rarr; Blog</p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 sm:py-24 flex-grow bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
          <AnimatedSection direction="up">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8 min-h-[500px]">
              <div id="soro-blog"></div>
              <Script src="https://app.trysoro.com/api/embed/aaa721f6-6dc9-453c-a122-9e62a51bbf61" strategy="afterInteractive" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  )
}
