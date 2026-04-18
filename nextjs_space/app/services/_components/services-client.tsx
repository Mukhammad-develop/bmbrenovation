'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Paintbrush, Bath, Home, ChefHat, Grid3X3, Layers, Hammer, Building2, ArrowUpFromDot, Wrench, ArrowRight, Sparkles, Phone } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AnimatedSection from '@/components/animated-section'

const allServices = [
  {
    id: 'painting',
    icon: Paintbrush,
    title: 'Painting & Decorations',
    short: 'From cosy homes to expansive commercial spaces, we offer comprehensive painting and decorating services that cater to every need.',
    long: 'Our painting and decorating services cover everything from interior wall painting and wallpaper installation to exterior finishing. We use premium paints and eco-friendly products to deliver flawless, long-lasting results that transform any space.',
    img: '/images/05_painting_decorating.jpg',
  },
  {
    id: 'house-renovation',
    icon: Home,
    title: 'House Renovation',
    short: 'Embarking on a house renovation project can be a thrilling and transformative experience, especially for owners of small homes looking to maximize their living space.',
    long: 'From modern apartments to expansive commercial spaces, we provide full-service home renovation solutions. Our skilled team manages everything from interior redesigns and extensions to structural improvements and finishing touches.',
    img: '/images/04_living_room_open_plan.jpg',
  },
  {
    id: 'bathroom',
    icon: Bath,
    title: 'Bathroom Renovations',
    short: 'Undertaking a bathroom renovation can offer the perfect opportunity to transform this space into a peaceful retreat for relaxation and rejuvenation.',
    long: 'We create elegant, spa-like bathrooms tailored to your lifestyle. From tiling and plumbing to lighting and fixtures, we handle every detail to deliver a bathroom that combines luxury with functionality.',
    img: '/images/03_luxury_bathroom.jpg',
  },
  {
    id: 'kitchen',
    icon: ChefHat,
    title: 'Kitchen Fitting',
    short: 'BMB Renovation stands at the forefront of kitchen fitting in London, offering a perfect blend of functionality and personal style.',
    long: 'From compact residential kitchens to large commercial spaces, we offer complete kitchen fitting services tailored to every need. Our experienced team handles everything from cabinetry installation and worktops to plumbing, tiling, and lighting.',
    img: '/images/02_kitchen_marble.jpg',
  },
  {
    id: 'flooring',
    icon: Layers,
    title: 'Flooring',
    short: "Flooring is more than just a surface you walk on; it's an integral part of your home's aesthetic and functional foundation.",
    long: 'We offer a wide range of flooring solutions including hardwood, laminate, vinyl, tile, and natural stone. Our expert team ensures precise installation for a flawless finish that enhances your space.',
    img: '/images/06_hardwood_flooring.jpg',
  },
  {
    id: 'loft',
    icon: ArrowUpFromDot,
    title: 'Loft Conversion',
    short: 'Are you in need of extra living space in your London home but don\'t want to deal with the hassle of moving? A loft conversion could be the perfect solution.',
    long: 'We transform unused loft spaces into beautiful, functional rooms — bedrooms, offices, playrooms, or en-suite bathrooms. Our team handles planning, structural work, insulation, and finishing.',
    img: '/images/07_loft_conversion.jpg',
  },
  {
    id: 'extension',
    icon: Building2,
    title: 'House Extension',
    short: 'BMB Renovation has the perfect solution for London homeowners looking to expand their living area: a house extension.',
    long: 'Expanding your living or working space is one of the best ways to add value and functionality to your property. We deliver high-quality house extensions that seamlessly blend with your existing structure.',
    img: '/images/08_glass_extension.jpg',
  },
  {
    id: 'tiling',
    icon: Grid3X3,
    title: 'Tiling',
    short: 'We specialize in providing comprehensive tiling solutions tailored to the unique challenges and opportunities presented by smaller living spaces in London.',
    long: 'From kitchen splashbacks to bathroom floors and feature walls, our tiling experts deliver precision craftsmanship with a wide range of materials including ceramic, porcelain, marble, and mosaic tiles.',
    img: '/images/09_tile_work.jpg',
  },
  {
    id: 'handyman',
    icon: Wrench,
    title: 'General Handy Man Work',
    short: 'In the bustling city of London, small houses come with their charm and unique set of renovation needs.',
    long: 'From small home fixes to large commercial maintenance tasks, our handyman services cover every corner of your property. We handle furniture assembly, shelving installation, minor plumbing and electrical repairs, and general property maintenance.',
    img: '/images/11_handyman_professional.jpg',
  },
  {
    id: 'carpentry',
    icon: Hammer,
    title: 'Carpentry',
    short: 'We understand the pivotal role that carpentry plays in the realm of small house renovations in London.',
    long: 'Our skilled carpenters create bespoke solutions including custom cabinetry, built-in wardrobes, shelving units, doors, window frames, and decorative woodwork that add character and functionality to your home.',
    img: '/images/10_custom_carpentry.jpg',
  },
]

export default function ServicesClient() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-20">
        <div className="relative h-[320px] sm:h-[380px] overflow-hidden">
          <Image src="/images/13_modern_kitchen_bright.jpg" alt="BMB Renovation Services" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-4">
                <Sparkles className="w-4 h-4 text-[#C8A97E]" />
                <span className="text-white/90 text-sm">Our Services</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">
                Rediscover Your Home
              </h1>
              <p className="text-white/70 mt-3 max-w-lg">A perfect blend of colours, textures, and design.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">What We Offer</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-3 tracking-tight">
              Our Complete Range of Services
            </h2>
          </AnimatedSection>

          <div className="space-y-20">
            {allServices?.map((service: any, i: number) => (
              <AnimatedSection key={service?.id ?? i} delay={0.1}>
                <div id={service?.id ?? ''} className="scroll-mt-28">
                  <div className={`grid lg:grid-cols-2 gap-10 lg:gap-14 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                    <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
                      <div className="aspect-[16/10] relative rounded-lg overflow-hidden group">
                        <Image
                          src={service?.img ?? '/images/01_hero_luxury_interior.jpg'}
                          alt={service?.title ?? 'Service'}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-[#C8A97E]/10 flex items-center justify-center">
                          {service?.icon && <service.icon className="w-5 h-5 text-[#C8A97E]" />}
                        </div>
                        <h3 className="font-display text-2xl font-bold text-gray-900">{service?.title ?? ''}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-4">{service?.short ?? ''}</p>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6">{service?.long ?? ''}</p>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors text-sm"
                      >
                        Get a Free Quote <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
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
              Ready to Start Your <span className="text-[#C8A97E]">Renovation</span>?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">Contact us today for a free, no-obligation quote.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#C8A97E] text-white font-semibold rounded-full hover:bg-[#B8996E] transition-all">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:+447775758717" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all">
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
