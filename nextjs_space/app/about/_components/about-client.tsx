'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Phone, Sparkles, Star, Shield, Clock, Users } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AnimatedSection from '@/components/animated-section'
import Counter from '@/components/counter'

const whatWeDo = [
  'Kitchen Renovations – Complete kitchen transformations: units, worktops, tiling, plumbing and electrics.',
  'Bathroom Remodelling – Fully fitted bathrooms and en-suites to any specification, from suite-only installs to full wet-room transformations.',
  'Living & Bedroom Renovations – Bespoke joinery, built-in storage, plastering and decoration.',
  'Flooring & Wall Finishes – LVT, porcelain tile, engineered wood and professional decorating.',
  'Extensions & Structural Work – Single-storey extensions, loft conversions and structural alterations.',
  'Full Home Transformations – End-to-end project management for whole-property renovations.',
]

const process = [
  {
    step: '01',
    title: 'Free Consultation',
    desc: 'We visit your home at a time that suits you — no charge, no obligation. We listen carefully to what you want, assess the space and answer every question you have.',
  },
  {
    step: '02',
    title: 'Clear Written Quote',
    desc: 'Within 48 hours you receive a detailed, itemised written quote. Every cost is explained upfront. There are no hidden charges or surprise additions once work begins.',
  },
  {
    step: '03',
    title: 'Design & Planning',
    desc: 'We finalise the design, confirm materials, agree a schedule and co-ordinate every trade required. You have one point of contact throughout — us.',
  },
  {
    step: '04',
    title: 'Expert Installation',
    desc: 'Our in-house team of skilled tradespeople carry out all the work: plumbing, tiling, carpentry, electrics, plastering and decorating. No subcontractors, no gaps in quality.',
  },
  {
    step: '05',
    title: 'Handover & Aftercare',
    desc: 'We carry out a full snagging check before handover. Any issues are resolved immediately. We stay available after completion — our reputation depends on every job we do.',
  },
]

const guarantees = [
  {
    icon: Shield,
    title: '15+ Years of Experience',
    desc: 'Over fifteen years delivering renovations across Watford, Hertfordshire and London. We have worked on every type of property — Victorian terraces, modern apartments, large family homes.',
  },
  {
    icon: Users,
    title: 'All Trades In-House',
    desc: 'We do not subcontract. Our own team handles plumbing, tiling, joinery, electrics, plastering and decorating. One team, one standard, one point of accountability.',
  },
  {
    icon: Clock,
    title: 'On Time, On Budget',
    desc: 'We agree a programme before work starts and keep to it. If anything unexpected arises during the project we tell you immediately — and solve it without drama.',
  },
  {
    icon: Star,
    title: 'Premium Materials Only',
    desc: 'We source products from trusted UK suppliers. Whether it is a British Standard kitchen, a Merlyn shower enclosure or Porcelanosa tiles, we specify materials that perform and last.',
  },
]

const approach = [
  'Personalised designs tailored to each client\'s lifestyle and taste',
  'Premium materials sourced from trusted UK suppliers',
  'Transparent communication and single point of contact throughout',
  'Firm commitment to agreed deadlines and budgets',
  'Full snagging and sign-off process before final handover',
]

const stats = [
  { value: 2, suffix: 'K+', label: 'Projects Done' },
  { value: 3, suffix: 'K+', label: 'Happy Customers' },
  { value: 5, suffix: '★', label: 'Average Rating' },
  { value: 15, suffix: '+', label: 'Years Experience' },
]

export default function AboutClient() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-20 pb-0">
        <div className="relative h-[340px] sm:h-[420px] overflow-hidden">
          <Image
            src="/images/14_construction_team.webp"
            alt="BMB Renovation professional team at work in Watford"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-4">
                <Sparkles className="w-4 h-4 text-[#C8A97E]" />
                <span className="text-white/90 text-sm font-medium">About BMB Renovation</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                Crafting Homes with{' '}<span className="text-[#C8A97E]">Elegance</span><br />
                <span className="text-3xl sm:text-4xl font-semibold">in Watford &amp; London</span>
              </h1>
              <p className="text-white/90 mt-4 max-w-xl text-base leading-relaxed">
                15+ years. 2,000+ projects. One standard: exceptional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection direction="left">
              <div className="relative">
                <div className="aspect-[4/3] relative rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="/images/15_elegant_hallway.webp"
                    alt="Elegant home renovation by BMB Renovation Watford"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-[#C8A97E] text-white p-6 rounded-xl shadow-2xl hidden sm:block">
                  <div className="text-3xl font-display font-bold"><Counter end={15} suffix="+" /></div>
                  <p className="text-sm text-white/90 mt-1">Years Experience</p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">Who We Are</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-5 tracking-tight">
                Watford&apos;s Trusted Home Renovation Specialists
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                BMB Renovation was founded with a single belief: every home has the potential to be extraordinary. Based in Watford — at 157 Judge Street, WD24 5AN — we serve homeowners across Hertfordshire and London with premium renovation services that combine skilled craftsmanship, quality materials and honest pricing.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Over fifteen years we have completed more than 2,000 projects: from full kitchen renovations and bathroom fitting to whole-home transformations and extensions. Every project is handled by our own in-house team of tradespeople. We do not subcontract, which means one consistent standard of quality across every trade — plumbing, tiling, carpentry, plastering, electrics and decoration.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our clients choose us because we are straightforward to deal with: clear quotes before work starts, honest timescales, a single point of contact throughout, and a team that turns up when we say we will. Our reputation is built locally — in Watford and the surrounding towns — and we intend to keep it.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8A97E] text-white font-semibold rounded-full hover:bg-[#B8996E] transition-colors"
              >
                Get a Free Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-950 py-14">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.1} className="text-center">
                <div className="text-3xl sm:text-4xl text-[#C8A97E] font-display font-bold">
                  <Counter end={s.value} suffix={s.suffix} />
                </div>
                <p className="text-gray-300 text-sm mt-2">{s.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">How We Work</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-3 tracking-tight">
              Our Renovation Process — Simple &amp; Transparent
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
              From the first phone call to handover day, we make the renovation process as smooth and stress-free as possible. Here is exactly what to expect when you work with us.
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {process.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-white rounded-xl p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="w-12 h-12 rounded-full bg-[#C8A97E] flex items-center justify-center text-white font-display font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-display text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <AnimatedSection direction="left">
              <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">Our Services</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-3 tracking-tight">
                Home Renovations That Enhance Beauty &amp; Practicality
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We offer a complete range of home renovation services. Whether you need a single room refitted or a full property transformation, we handle the entire project from design through to the final finishing detail.
              </p>
              <div className="space-y-4">
                {whatWeDo.map((item, i) => (
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
              <div className="aspect-[4/3] relative rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/images/02_kitchen_marble.webp"
                  alt="Premium kitchen renovation by BMB Renovation Watford"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-20 sm:py-28 bg-gray-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">Why Choose BMB</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-3 tracking-tight">
              What Sets Us Apart
            </h2>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto leading-relaxed">
              We are not a national franchise or a call-centre operation. We are a local Watford team — and our entire business depends on doing every job to a standard we are proud of.
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-xl p-7 hover:bg-white/10 transition-colors h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#C8A97E]/20 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-[#C8A97E]" />
                  </div>
                  <h3 className="font-display text-base font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedSection direction="left">
              <div className="aspect-[4/3] relative rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/images/04_living_room_open_plan.webp"
                  alt="BMB Renovation completed living room project"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">Our Story</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-5 tracking-tight">
                Built on Craftsmanship, Grown on Reputation
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                BMB Renovation started with a simple ambition: to offer homeowners in Watford a renovation service that was genuinely reliable, fairly priced and delivered to a high standard. From a small team working on bathroom refits in WD24, we have grown into one of Hertfordshire&apos;s most respected renovation companies — without ever losing the values we started with.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                Today we serve clients across Watford, Bushey, Rickmansworth, St Albans, Hemel Hempstead, Borehamwood, Harrow and further afield. The majority of our new enquiries come from referrals and returning customers — which tells us everything about the quality of the work we deliver.
              </p>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-4">Our Approach</h3>
              <div className="space-y-3 mb-8">
                {approach.map((item, i) => (
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
          <Image src="/images/01_hero_luxury_interior.webp" alt="BMB Renovation premium interior" fill className="object-cover" />
          <div className="absolute inset-0 bg-gray-900/88" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5">
              Ready to Transform Your Home?
            </h2>
            <p className="text-white/90 max-w-xl mx-auto mb-8 leading-relaxed">
              Call us today or fill in our online form for a free, no-obligation consultation. We cover Watford, London and the whole of Hertfordshire.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#C8A97E] text-white font-semibold rounded-full hover:bg-[#B8996E] transition-all">
                Get a Free Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:+447775758717" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all">
                <Phone className="w-4 h-4" /> +44 7775 758 717
              </a>
            </div>
            <p className="text-white/45 text-sm mt-5 italic">No obligation — only friendly advice.</p>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  )
}
