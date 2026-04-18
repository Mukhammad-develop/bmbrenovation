'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight, Paintbrush, Bath, Home, ChefHat, Grid3X3, Layers,
  Hammer, Building2, ArrowUpFromDot, Wrench, Star, Award, Users,
  Clock, Palette, MessageSquareQuote, Phone, CheckCircle2, Sparkles
} from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AnimatedSection from '@/components/animated-section'
import Counter from '@/components/counter'

const services = [
  {
    icon: Paintbrush,
    title: 'Painting & Decorations',
    desc: 'From cosy homes to expansive commercial spaces, we offer comprehensive painting and decorating services that cater to every need.',
    href: '/services#painting',
    img: '/images/05_painting_decorating.jpg',
  },
  {
    icon: Home,
    title: 'House Renovation',
    desc: 'A thrilling and transformative experience, maximizing living space and breathing new life into your property.',
    href: '/services#house-renovation',
    img: '/images/04_living_room_open_plan.jpg',
  },
  {
    icon: Bath,
    title: 'Bathroom Renovations',
    desc: 'Transform your bathroom into a peaceful retreat for relaxation and rejuvenation.',
    href: '/services#bathroom',
    img: '/images/03_luxury_bathroom.jpg',
  },
  {
    icon: ChefHat,
    title: 'Kitchen Fitting',
    desc: 'At the forefront of kitchen fitting in London, offering a perfect blend of functionality and personal style.',
    href: '/services#kitchen',
    img: '/images/02_kitchen_marble.jpg',
  },
]

const benefits = [
  { icon: Palette, title: 'Professional Designer', desc: 'Our expert designers ensure every renovation is both stylish and functional. From concept to completion, we transform your space into something unique.' },
  { icon: MessageSquareQuote, title: 'Free Consultations', desc: 'We offer free consultations to understand your needs, share ideas, and provide guidance before starting any project.' },
  { icon: Award, title: 'Based on Your Budget', desc: 'We create customized renovation plans that fit your budget while delivering exceptional results without compromising on quality.' },
  { icon: Clock, title: '24/7 Premium Support', desc: 'Our dedicated support team is available 24/7 to answer your questions, resolve issues, and ensure a smooth renovation journey.' },
]

const testimonials = [
  { text: 'From the very first consultation, the team listened carefully to our needs and delivered beyond our expectations. Our kitchen now feels modern, elegant, and incredibly functional.', author: 'Sarah & James R.', location: 'London' },
  { text: 'The designers helped us reimagine our living room, and the craftsmanship was outstanding. Every detail was handled with care, and the result was a space that feels both stylish and comfortable.', author: 'David L.', location: 'Kensington' },
  { text: 'We wanted a complete interior renovation, and London House Renovations exceeded our vision. The team managed everything smoothly, kept us informed, and delivered a stunning finish on time.', author: 'Scarlett Burton', location: 'London' },
]

const stats = [
  { value: 15, suffix: '+', label: 'Years Experience' },
  { value: 2, suffix: 'K+', label: 'Projects Done' },
  { value: 3, suffix: 'K+', label: 'Happy Customers' },
  { value: 5, suffix: '', label: 'Company Rating' },
]

export default function HomeClient() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO */}
      <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/01_hero_luxury_interior.jpg"
            alt="Luxury home interior renovation by BMB Renovation"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-[#C8A97E]" />
              <span className="text-white/90 text-sm font-medium">Welcome to BMB Renovation</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              We Will Help You{' '}
              <span className="text-[#C8A97E]">Build</span>{' '}
              Your Dream
            </h1>
            <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
              Expert Home, Kitchen & Bathroom Remodeling services in London & Watford.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C8A97E] text-white font-semibold rounded-full hover:bg-[#B8996E] transition-all duration-200 shadow-lg shadow-[#C8A97E]/20"
              >
                Our Services <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                Get a Free Quote
              </Link>
            </div>
          </motion.div>
        </div>
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-white/60" />
          </div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section className="bg-gray-950 py-10">
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

      {/* ABOUT SNIPPET */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection direction="left">
              <div className="relative">
                <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                  <Image
                    src="/images/15_elegant_hallway.jpg"
                    alt="BMB Renovation elegant interior design"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-[#C8A97E] text-white p-6 rounded-lg shadow-xl hidden sm:block">
                  <div className="text-3xl font-display font-bold"><Counter end={15} suffix="+" /></div>
                  <p className="text-sm text-white/90">Years of Excellence</p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">Who We Are</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-5 tracking-tight">
                Crafting Homes with{' '}
                <span className="text-[#C8A97E]">Elegance</span> & Functionality
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                At BMB Renovation, we don&apos;t just renovate houses—we transform them into timeless, luxurious living spaces. With years of expertise in interior renovation and design, our mission is to create homes that perfectly balance style, comfort, and functionality.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                From meticulous planning to flawless execution, we specialize in bespoke, luxury renovations, ensuring every space we curate is a perfect blend of style and excellence.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
              >
                Discover More <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">What We Offer</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-3 tracking-tight">
              Discover the Harmony of Colours, Textures, and Patterns
            </h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 gap-6">
            {services?.map((service: any, i: number) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <Link href={service?.href ?? '/services'} className="group block">
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                    <Image
                      src={service?.img ?? '/images/01_hero_luxury_interior.jpg'}
                      alt={service?.title ?? 'Service'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3 mb-2">
                        {service?.icon && <service.icon className="w-5 h-5 text-[#C8A97E]" />}
                        <h3 className="font-display text-xl font-bold text-white">{service?.title ?? ''}</h3>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed line-clamp-2">{service?.desc ?? ''}</p>
                      <span className="inline-flex items-center gap-1 mt-3 text-[#C8A97E] text-sm font-semibold group-hover:gap-2 transition-all">
                        Learn more <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
            >
              Explore All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection direction="left">
              <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">Our Capabilities</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-5 tracking-tight">
                Create a Home That Defines{' '}
                <span className="text-[#C8A97E]">Who You Are</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                With expert designers, personalized plans, and top-quality craftsmanship, we bring your vision to life—making every corner of your home tell your story.
              </p>
              <div className="space-y-5">
                {[
                  { label: 'Interior Design', pct: 95 },
                  { label: 'Architecture', pct: 90 },
                  { label: '3D Visualization', pct: 85 },
                  { label: 'Project Management', pct: 92 },
                ]?.map((item: any, i: number) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item?.label ?? ''}</span>
                      <span className="text-sm font-bold text-[#C8A97E]">{item?.pct ?? 0}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#C8A97E] to-[#D4B98F] rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item?.pct ?? 0}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                <Image
                  src="/images/13_modern_kitchen_bright.jpg"
                  alt="Modern kitchen interior by BMB Renovation"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 sm:py-28 bg-gray-950 text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">Why Choose Us</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3 tracking-tight">
              Inspire Your Space Through Art and Design
            </h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits?.map((b: any, i: number) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-full hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-12 h-12 rounded-lg bg-[#C8A97E]/20 flex items-center justify-center mb-5 group-hover:bg-[#C8A97E]/30 transition-colors">
                    {b?.icon && <b.icon className="w-6 h-6 text-[#C8A97E]" />}
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-3">{b?.title ?? ''}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{b?.desc ?? ''}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">Testimonials</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-3 tracking-tight">
              What Our Clients Say About Us
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials?.map((t: any, i: number) => (
              <AnimatedSection key={i} delay={i * 0.15}>
                <div className="bg-white border border-gray-100 rounded-xl p-7 h-full shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-shadow duration-300">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)]?.map((_: any, j: number) => (
                      <Star key={j} className="w-4 h-4 fill-[#C8A97E] text-[#C8A97E]" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed italic mb-6">&ldquo;{t?.text ?? ''}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-[#C8A97E]/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#C8A97E]" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{t?.author ?? ''}</p>
                      <p className="text-xs text-gray-500">{t?.location ?? ''}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/06_hardwood_flooring.jpg"
            alt="BMB Renovation premium interiors"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/85" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5">
              Let&apos;s Get Together and Create{' '}
              <span className="text-[#C8A97E]">Your Dream Home</span>
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              From meticulous planning to flawless execution, we specialize in bespoke, luxury renovations, ensuring every space we curate is a perfect blend of style and excellence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#C8A97E] text-white font-semibold rounded-full hover:bg-[#B8996E] transition-all shadow-lg shadow-[#C8A97E]/20"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+447775758717"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all"
              >
                <Phone className="w-4 h-4" /> Call Us Now
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  )
}
