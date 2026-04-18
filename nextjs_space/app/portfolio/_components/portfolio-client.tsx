'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, Phone, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AnimatedSection from '@/components/animated-section'

const categories = ['All', 'Kitchen', 'Bathroom', 'Living Room', 'Extension', 'Loft']

const projects = [
  { title: 'Modern Kitchen Renovation', category: 'Kitchen', img: '/images/02_kitchen_marble.jpg', desc: 'Complete kitchen transformation with marble countertops and custom cabinetry.' },
  { title: 'Luxury Bathroom Redesign', category: 'Bathroom', img: '/images/03_luxury_bathroom.jpg', desc: 'Spa-like bathroom with elegant fixtures and premium tile work.' },
  { title: 'Open Plan Living Room', category: 'Living Room', img: '/images/04_living_room_open_plan.jpg', desc: 'Spacious open-plan renovation creating a bright, airy living space.' },
  { title: 'Glass House Extension', category: 'Extension', img: '/images/08_glass_extension.jpg', desc: 'Modern glass extension adding light and space to the property.' },
  { title: 'Loft Conversion Office', category: 'Loft', img: '/images/07_loft_conversion.jpg', desc: 'Unused loft transformed into a stylish home office space.' },
  { title: 'Bright Kitchen Interior', category: 'Kitchen', img: '/images/13_modern_kitchen_bright.jpg', desc: 'Bright, minimalist kitchen with integrated appliances and clean lines.' },
  { title: 'Premium Bathroom Tiling', category: 'Bathroom', img: '/images/09_tile_work.jpg', desc: 'Luxurious tile work creating a statement bathroom design.' },
  { title: 'Elegant Hallway Design', category: 'Living Room', img: '/images/15_elegant_hallway.jpg', desc: 'Inviting hallway renovation with premium flooring and lighting.' },
  { title: 'Hardwood Flooring Install', category: 'Living Room', img: '/images/06_hardwood_flooring.jpg', desc: 'Beautiful hardwood flooring installation throughout the home.' },
]

export default function PortfolioClient() {
  const [active, setActive] = useState('All')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filtered = active === 'All' ? projects : (projects?.filter((p: any) => p?.category === active) ?? [])

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-20">
        <div className="relative h-[320px] sm:h-[380px] overflow-hidden">
          <Image src="/images/12_bathroom_before_after.jpg" alt="BMB Renovation Portfolio" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-4">
                <Sparkles className="w-4 h-4 text-[#C8A97E]" />
                <span className="text-white/90 text-sm">Our Work</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">Portfolio</h1>
              <p className="text-white/70 mt-3">We are the experts in good taste!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-10">
            <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">Featured Projects</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-3 tracking-tight">Our Recent Work</h2>
          </AnimatedSection>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories?.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  active === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered?.map((project: any, i: number) => (
                <motion.div
                  key={project?.title ?? i}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => setLightbox(i)}
                    className="block w-full text-left group"
                  >
                    <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                      <Image
                        src={project?.img ?? '/images/01_hero_luxury_interior.jpg'}
                        alt={project?.title ?? 'Project'}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <p className="text-[#C8A97E] text-xs font-semibold uppercase tracking-wider mb-1">{project?.category ?? ''}</p>
                        <h3 className="font-display text-lg font-bold text-white">{project?.title ?? ''}</h3>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && filtered?.[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-4xl w-full"
              onClick={(e: any) => e?.stopPropagation?.()}
            >
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <Image
                  src={filtered?.[lightbox]?.img ?? '/images/01_hero_luxury_interior.jpg'}
                  alt={filtered?.[lightbox]?.title ?? 'Project'}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-display text-2xl font-bold text-white">{filtered?.[lightbox]?.title ?? ''}</h3>
                <p className="text-white/70 mt-2">{filtered?.[lightbox]?.desc ?? ''}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5">
              Like What You See?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">Let us bring the same level of craftsmanship and attention to detail to your project.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#C8A97E] text-white font-semibold rounded-full hover:bg-[#B8996E] transition-all">
                Start Your Project <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:+447775758717" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all">
                <Phone className="w-4 h-4" /> Call Us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  )
}
