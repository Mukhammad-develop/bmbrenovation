// Renders the engine's markdown-lite inline syntax ([links](/path), **bold**)
// as React nodes — no dangerouslySetInnerHTML, no external parser.

import React from 'react'
import Link from 'next/link'

const TOKEN = /(\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*)/g

export function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let last = 0
  let key = 0

  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0
    if (index > last) nodes.push(text.slice(last, index))

    if (match[2] !== undefined && match[3] !== undefined) {
      const href = match[3]
      const isInternal = href.startsWith('/')
      nodes.push(
        isInternal ? (
          <Link key={key++} href={href} className="text-[#C8A97E] font-medium underline decoration-[#C8A97E]/40 underline-offset-2 hover:decoration-[#C8A97E] transition-colors">
            {match[2]}
          </Link>
        ) : (
          <a key={key++} href={href} target="_blank" rel="noopener noreferrer" className="text-[#C8A97E] font-medium underline decoration-[#C8A97E]/40 underline-offset-2 hover:decoration-[#C8A97E] transition-colors">
            {match[2]}
          </a>
        ),
      )
    } else if (match[4] !== undefined) {
      nodes.push(<strong key={key++} className="font-semibold text-gray-900">{match[4]}</strong>)
    }
    last = index + match[0].length
  }

  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}
