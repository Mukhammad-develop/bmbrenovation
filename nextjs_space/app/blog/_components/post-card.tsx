import Link from 'next/link'
import { Calendar, Tag, ArrowRight } from 'lucide-react'
import type { BlogIndexEntry } from '@/lib/blog-types'

export default function PostCard({ post }: { post: BlogIndexEntry }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col hover:shadow-md hover:border-[#C8A97E]/40 transition-all"
    >
      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
        <span className="inline-flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
        <span className="inline-flex items-center gap-1 text-[#C8A97E]">
          <Tag className="w-3.5 h-3.5" />
          {post.targetKeyword}
        </span>
      </div>
      <h2 className="font-display text-xl sm:text-2xl font-bold text-gray-900 tracking-tight group-hover:text-[#C8A97E] transition-colors mb-3">
        {post.title}
      </h2>
      <p className="text-gray-600 text-sm leading-relaxed flex-grow">{post.description}</p>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C8A97E] mt-4">
        Read article
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </span>
    </Link>
  )
}
