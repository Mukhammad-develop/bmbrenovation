'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'

const services = [
  { name: 'Painting & Decorations', href: '/services#painting' },
  { name: 'Bathroom Renovations', href: '/services#bathroom' },
  { name: 'House Renovation', href: '/services#house-renovation' },
  { name: 'Kitchen Fitting', href: '/services#kitchen' },
  { name: 'Tiling', href: '/services#tiling' },
  { name: 'Flooring', href: '/services#flooring' },
  { name: 'Carpentry', href: '/services#carpentry' },
  { name: 'House Extension', href: '/services#extension' },
  { name: 'Loft Conversion', href: '/services#loft' },
  { name: 'General Handy Man Work', href: '/services#handyman' },
]

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services', hasDropdown: true },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setServicesOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <span className={`font-display text-2xl font-bold tracking-tight transition-colors ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}>
                BMB
              </span>
              <span className={`font-display text-2xl font-light tracking-tight transition-colors ${
                scrolled ? 'text-[#C8A97E]' : 'text-[#C8A97E]'
              }`}>
                {' '}Renovation
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks?.map((link: any) => (
              <div key={link?.name} className="relative group">
                <Link
                  href={link?.href ?? '/'}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    pathname === link?.href
                      ? scrolled
                        ? 'text-[#C8A97E] bg-[#C8A97E]/10'
                        : 'text-[#C8A97E] bg-white/10'
                      : scrolled
                        ? 'text-gray-700 hover:text-[#C8A97E] hover:bg-gray-100'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                  onMouseEnter={() => link?.hasDropdown && setServicesOpen(true)}
                >
                  {link?.name}
                  {link?.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
                </Link>
                {link?.hasDropdown && (
                  <div
                    className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[240px]">
                      {services?.map((s: any) => (
                        <Link
                          key={s?.name}
                          href={s?.href ?? '/services'}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:text-[#C8A97E] hover:bg-[#C8A97E]/5 transition-colors"
                        >
                          {s?.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+447775758717"
              className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                scrolled
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks?.map((link: any) => (
                <div key={link?.name}>
                  <Link
                    href={link?.href ?? '/'}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                      pathname === link?.href
                        ? 'text-[#C8A97E] bg-[#C8A97E]/10'
                        : 'text-gray-700 hover:text-[#C8A97E] hover:bg-gray-50'
                    }`}
                  >
                    {link?.name}
                  </Link>
                  {link?.hasDropdown && (
                    <div className="ml-4 mt-1 space-y-1">
                      {services?.map((s: any) => (
                        <Link
                          key={s?.name}
                          href={s?.href ?? '/services'}
                          className="block px-4 py-2 text-sm text-gray-500 hover:text-[#C8A97E] rounded-lg"
                        >
                          {s?.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a
                href="tel:+447775758717"
                className="block mt-4 text-center px-4 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800"
              >
                <Phone className="w-4 h-4 inline mr-2" /> Call Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
