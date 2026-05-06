'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, ArrowUp } from 'lucide-react'

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Contact', href: '/contact' },
]

const serviceLinks = [
  { name: 'Kitchen Fitting', href: '/services#kitchen' },
  { name: 'Bathroom Renovations', href: '/services#bathroom' },
  { name: 'House Renovation', href: '/services#house-renovation' },
  { name: 'Painting & Decorations', href: '/services#painting' },
  { name: 'Loft Conversion', href: '/services#loft' },
]

const areas = [
  { name: 'Watford', href: '/kitchen-renovation-watford' },
  { name: 'Bushey', href: '/kitchen-renovation-bushey' },
  { name: 'Rickmansworth', href: '/kitchen-renovation-rickmansworth' },
  { name: 'St Albans', href: '/kitchen-renovation-st-albans' },
  { name: 'Hemel Hempstead', href: '/kitchen-renovation-hemel-hempstead' },
  { name: 'Borehamwood', href: '/kitchen-renovation-borehamwood' },
  { name: 'Harrow', href: '/kitchen-renovation-harrow' },
  { name: 'Croxley Green', href: '/kitchen-renovation-croxley-green' },
  { name: 'Luton', href: '/kitchen-renovation-luton' },
  { name: 'Bedford', href: '/kitchen-renovation-bedford' },
]

export default function Footer() {
  const scrollToTop = () => {
    window?.scrollTo?.({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="font-display text-2xl font-bold text-white">BMB</span>
              <span className="font-display text-2xl font-light text-[#C8A97E]"> Renovation</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              We specialize in bespoke home interior renovations, combining elegance and functionality to create timeless living spaces.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/people/BMB-Renovation/61560985672329/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C8A97E] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/bmb_renovation/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C8A97E] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://x.com/bmb_renovation" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C8A97E] transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base font-semibold text-white mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks?.map((link: any) => (
                <li key={link?.name}>
                  <Link href={link?.href ?? '/'} className="text-gray-400 text-sm hover:text-[#C8A97E] transition-colors">
                    {link?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-base font-semibold text-white mb-5">Our Services</h4>
            <ul className="space-y-3">
              {serviceLinks?.map((link: any) => (
                <li key={link?.name}>
                  <Link href={link?.href ?? '/services'} className="text-gray-400 text-sm hover:text-[#C8A97E] transition-colors">
                    {link?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas We Cover */}
          <div>
            <h4 className="font-display text-base font-semibold text-white mb-5">Areas We Cover</h4>
            <ul className="space-y-3">
              {areas?.map((area: any) => (
                <li key={area?.name}>
                  <Link href={area?.href ?? '/'} className="text-gray-400 text-sm hover:text-[#C8A97E] transition-colors">
                    {area?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2 lg:col-span-5 border-t border-white/10 pt-8 mt-4 lg:mt-8">
            <h4 className="font-display text-base font-semibold text-white mb-5">Get in Touch</h4>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C8A97E] mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">157 Judge Street, Watford, England, WD24 5AN</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C8A97E] shrink-0" />
                <a href="tel:+447775758717" className="text-gray-400 text-sm hover:text-[#C8A97E] transition-colors">+44 7775 758 717</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C8A97E] shrink-0" />
                <a href="mailto:bmb.renovation@gmail.com" className="text-gray-400 text-sm hover:text-[#C8A97E] transition-colors">bmb.renovation@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2026 BMB Renovation. All Rights Reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-[#C8A97E] text-white flex items-center justify-center hover:bg-[#B8996E] transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  )
}
