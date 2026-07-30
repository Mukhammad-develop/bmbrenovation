import { HelpCircle } from 'lucide-react'
import type { PostFaq } from '@/lib/blog-types'
import { renderInline } from '@/lib/inline'

// Native <details> accordion — works with zero client JS (static-export friendly).
export default function Faq({ faq }: { faq: PostFaq[] }) {
  if (faq.length === 0) return null
  return (
    <section className="mt-14">
      <div className="flex items-center gap-2.5 mb-6">
        <HelpCircle className="w-6 h-6 text-[#C8A97E]" />
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="space-y-3">
        {faq.map((item, i) => (
          <details key={i} className="group bg-white rounded-xl border border-gray-100 shadow-sm open:border-[#C8A97E]/40">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 p-5 font-semibold text-gray-900 text-sm sm:text-base [&::-webkit-details-marker]:hidden">
              {item.q}
              <span className="text-[#C8A97E] text-xl leading-none group-open:rotate-45 transition-transform flex-shrink-0">+</span>
            </summary>
            <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">
              {renderInline(item.a)}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
