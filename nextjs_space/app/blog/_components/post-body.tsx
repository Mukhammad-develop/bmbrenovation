import type { PostBlock as PostBlockType } from '@/lib/blog-types'
import { renderInline } from '@/lib/inline'
import CtaBlock from './cta-block'

function Block({ block }: { block: PostBlockType }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-12 mb-4">
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mt-8 mb-3">
          {block.text}
        </h3>
      )
    case 'ul':
      return (
        <ul className="my-5 space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-gray-700 leading-relaxed">
              <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-[#C8A97E] flex-shrink-0" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
    case 'cta':
      return <CtaBlock heading={block.heading} text={block.text} buttonText={block.buttonText} href={block.href} />
    case 'p':
    default:
      return <p className="text-gray-700 leading-relaxed my-5">{renderInline(block.text)}</p>
  }
}

export default function PostBody({ blocks }: { blocks: PostBlockType[] }) {
  return (
    <div>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  )
}
