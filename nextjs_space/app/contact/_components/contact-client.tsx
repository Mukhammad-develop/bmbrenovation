'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, Send, CheckCircle, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AnimatedSection from '@/components/animated-section'

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.()
    if (!form?.name || !form?.phone) {
      toast?.error?.('Please fill in your name and phone number.')
      return
    }
    setSending(true)
    try {
      const res = await fetch('https://formsubmit.co/ajax/admin@bmbrenovation.co.uk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `New Enquiry from ${form.name} — BMB Renovation`,
          name: form.name,
          phone: form.phone,
          email: form.email || '(not provided)',
          message: form.message || '(no message)',
          _template: 'table',
        }),
      })
      const data = await res.json()
      if (data?.success === 'true' || data?.success === true || res.ok) {
        // Save to localStorage for admin dashboard
        try {
          const stored = JSON.parse(localStorage.getItem('bmb_quotes') || '[]')
          stored.push({
            id: Date.now().toString(36) + Math.random().toString(36).slice(2,7),
            timestamp: new Date().toISOString(),
            name: form.name, phone: form.phone,
            email: form.email || '(not provided)',
            project: '(contact page)',
            postcode: '(not provided)',
            message: form.message || '(no message)',
            contact_time: 'Any time',
            page: '/contact',
            status: 'new',
          })
          localStorage.setItem('bmb_quotes', JSON.stringify(stored))
        } catch {}
        setSubmitted(true)
        toast?.success?.('Message sent! We will be in touch shortly.')
      } else {
        throw new Error('Submission failed')
      }
    } catch {
      toast?.error?.('Something went wrong. Please call us directly on +44 7775 758 717.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-20">
        <div className="relative h-[320px] sm:h-[380px] overflow-hidden">
          <Image src="/images/01_hero_luxury_interior.jpg" alt="Contact BMB Renovation" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-4">
                <Sparkles className="w-4 h-4 text-[#C8A97E]" />
                <span className="text-white/90 text-sm">Contact Us</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">
                Get in <span className="text-[#C8A97E]">Touch</span>
              </h1>
              <p className="text-white/70 mt-3 max-w-lg">We&apos;d love to hear from you!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Info */}
            <AnimatedSection direction="left" className="lg:col-span-2">
              <span className="text-[#C8A97E] font-semibold text-sm uppercase tracking-widest">Contact Info</span>
              <h2 className="font-display text-3xl font-bold text-gray-900 mt-3 mb-3 tracking-tight">We Will Be in Touch Shortly</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                Whether you have a question about our services, need assistance, or want to discuss a project, our team is here to help.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#C8A97E]/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#C8A97E]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Address</h4>
                    <p className="text-gray-600 text-sm">157 Judge Street, Watford, England, WD24 5AN</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#C8A97E]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#C8A97E]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Phone</h4>
                    <a href="tel:+447775758717" className="text-gray-600 text-sm hover:text-[#C8A97E] transition-colors">+44 7775 758 717</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#C8A97E]/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#C8A97E]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Email</h4>
                    <a href="mailto:bmb.renovation@gmail.com" className="text-gray-600 text-sm hover:text-[#C8A97E] transition-colors">bmb.renovation@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#C8A97E]/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#C8A97E]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Working Hours</h4>
                    <p className="text-gray-600 text-sm">Mon - Sat: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 text-sm mb-4">Follow Us</h4>
                <div className="flex items-center gap-3">
                  <a href="https://www.facebook.com/people/BMB-Renovation/61560985672329/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#C8A97E] hover:text-white transition-all text-gray-600">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="https://www.instagram.com/bmb_renovation/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#C8A97E] hover:text-white transition-all text-gray-600">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="https://i.ytimg.com/vi/G9U-BaCsugU/maxresdefault.jpg" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#C8A97E] hover:text-white transition-all text-gray-600">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection direction="right" className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 shadow-[var(--shadow-lg)] border border-gray-100">
                <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
                <p className="text-gray-500 text-sm mb-8">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>

                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                    <p className="text-gray-600">Your message has been sent. We&apos;ll be in touch shortly.</p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', message: '' }) }}
                      className="mt-6 text-[#C8A97E] font-semibold text-sm hover:underline"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                        <input
                          type="text"
                          value={form?.name ?? ''}
                          onChange={(e: any) => setForm({ ...(form ?? {}), name: e?.target?.value ?? '' })}
                          placeholder="John Smith"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/50 focus:border-[#C8A97E] transition-all text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={form?.phone ?? ''}
                          onChange={(e: any) => setForm({ ...(form ?? {}), phone: e?.target?.value ?? '' })}
                          placeholder="+44 7XXX XXX XXX"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/50 focus:border-[#C8A97E] transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={form?.email ?? ''}
                        onChange={(e: any) => setForm({ ...(form ?? {}), email: e?.target?.value ?? '' })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/50 focus:border-[#C8A97E] transition-all text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                      <textarea
                        value={form?.message ?? ''}
                        onChange={(e: any) => setForm({ ...(form ?? {}), message: e?.target?.value ?? '' })}
                        placeholder="Tell us about your project..."
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/50 focus:border-[#C8A97E] transition-all text-sm resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <>
                          Send Message <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-400 text-center">Your information is safe with us. We respect your privacy.</p>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
