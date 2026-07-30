import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { renderInline } from '@/lib/inline'

interface CtaBlockProps {
  heading: string
  text: string
  buttonText: string
  href: string
}

export default function CtaBlock({ heading, text, buttonText, href }: CtaBlockProps) {
  return (
    <aside className="my-10 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 sm:p-8 border border-[#C8A97E]/30">
      <h3 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">{heading}</h3>
      <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-5">{renderInline(text)}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8A97E] text-white text-sm font-bold hover:bg-[#b39668] transition-colors"
      >
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </aside>
  )
}
