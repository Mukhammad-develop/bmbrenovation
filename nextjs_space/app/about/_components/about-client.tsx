'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Phone, Sparkles } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AnimatedSection from '@/components/animated-section'
import Counter from '@/components/counter'

const whatWeDo = [
  'Kitchen Renovations – Modern, functional, and stylish kitchen transformations.',
  'Bathroom Remodeling – Elegant and spa-like designs tailored to your lifestyle.',
  'Living & Bedroom Renovations – Comfortable and personalized spaces.',
  'Flooring & Wall Finishes – High-quality materials for lasting impact.',
  'Custom Storage Solutions – Smart designs that maximize your space.',
  'Full Home Transformations – Cohesive, luxury designs from start to finish.',
]

const approach = [
  'Personalized designs tailored to each client',
  'Premium materials and top-notch finishes',
  'Transparent communication and project management',
  'Commitment to deadlines and budgets',
]

const stats = [
  { value: 2, suffix: 'K+', label: 'Projects Done' },
  { value: 3, suffix: 'K+', label: 'Happy Customers' },
  { value: 5, suffix: '', label: 'Company Rating' },
  { value: 15, suffix: '+', label: 'Years Experience' },
]

export default function AboutClient() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-20 pb-0">
        <div className="relative h-[320px] sm:h-[380px] overflow-hidden">
          <Image
            src="/images/14_construction_team.jpg"
            alt="BMB Renovation Team"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-4">
                <Sparkles className="w-4 h-4 text-[#C8A97E]" />
                <span className="text-white/90 text-sm">About Us</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">
                Crafting Homes with{' '}<span className="text-[#C8A97E]">Elegance</span>
              </h1>
              <p className="text-white/70 mt-3 max-w-lg">Home &rarr; About Us</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection direction="left">
              <div className="relative">
                <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                  <Image
                    src="/images/15_elegant_hallway.jpg"
                    alt="Elegant home renovation by BMB"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-[#C8A97E] text-white p-6 rounded-lg shadow-xl hidden sm:block">
                  <div className="text-3xl font-display font-bold"><Counter end={15} suffix="+" /></div>
                  <p className="text-sm text-white/90">Years Experience</p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">Who We Are</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-5 tracking-tight">
                Crafting Homes with Elegance & Functionality
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                At BMB Renovation, we don&apos;t just renovate houses—we transform them into timeless, luxurious living spaces. With years of expertise in interior renovation and design, our mission is to create homes that perfectly balance style, comfort, and functionality.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8A97E] text-white font-semibold rounded-full hover:bg-[#B8996E] transition-colors"
              >
                Discover More <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-950 py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats?.map((s: any, i: number) => (
              <AnimatedSection key={i} delay={i * 0.1} className="text-center">
                <div className="text-3xl sm:text-4xl text-[#C8A97E]">
                  <Counter end={s?.value ?? 0} suffix={s?.suffix ?? ''} />
                </div>
                <p className="text-gray-400 text-sm mt-1">{s?.label ?? ''}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <AnimatedSection direction="left">
              <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">What We Do</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-6 tracking-tight">
                Home Interior Renovations That Enhance Beauty & Practicality
              </h2>
              <div className="space-y-4">
                {whatWeDo?.map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#C8A97E] mt-0.5 shrink-0" />
                    <p className="text-gray-600 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors mt-8"
              >
                View All Services <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                <Image
                  src="/images/02_kitchen_marble.jpg"
                  alt="Kitchen renovation by BMB Renovation"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection direction="left">
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                <Image
                  src="/images/04_living_room_open_plan.jpg"
                  alt="BMB Renovation project showcase"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">BMB Renovation</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-5 tracking-tight">
                Our Story
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Founded with a passion for design and craftsmanship, BMB Renovation began with a simple belief: every home has the potential to be extraordinary. What started as a vision to provide high-quality renovation services has grown into a trusted name for bespoke, luxury renovations across London.
              </p>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-4">Our Approach</h3>
              <p className="text-gray-600 leading-relaxed mb-5">
                Every project begins with listening to you—understanding your needs, preferences, and lifestyle. We then combine meticulous planning, innovative design, and skilled craftsmanship to bring your vision to life.
              </p>
              <div className="space-y-3 mb-8">
                {approach?.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#C8A97E] shrink-0" />
                    <p className="text-gray-600 text-sm">{item}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8A97E] text-white font-semibold rounded-full hover:bg-[#B8996E] transition-colors"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/01_hero_luxury_interior.jpg" alt="BMB Renovation" fill className="object-cover" />
          <div className="absolute inset-0 bg-gray-900/85" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5">
              Ready to Transform Your Home?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Contact us today for a free, no-obligation consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#C8A97E] text-white font-semibold rounded-full hover:bg-[#B8996E] transition-all">
                Contact Now <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:+447775758717" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all">
                <Phone className="w-4 h-4" /> +44 7775 758 717
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  )
}
