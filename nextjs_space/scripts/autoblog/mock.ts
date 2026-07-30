// Mock mode: deterministic post generation with NO OpenAI key and NO network.
// Exists so the full pipeline (storage, pages, sitemap, admin) can be tested
// end-to-end. Real content only comes from `npm run blog:run` with a key set.

import type { BlogPost, KeywordEntry } from '../../lib/blog-types'
import type { AutoBlogConfig } from './config'
import { buildLinkPool } from './config'
import { enforceCtas } from './pipeline'
import { slugify } from './store'

export const MOCK_KEYWORDS: KeywordEntry[] = [
  { keyword: 'kitchen renovation cost watford', score: 8, source: 'mock', firstSeen: new Date().toISOString() },
  { keyword: 'bathroom fitting ideas for small bathrooms', score: 6, source: 'mock', firstSeen: new Date().toISOString() },
  { keyword: 'how much does a loft conversion cost uk', score: 7, source: 'mock', firstSeen: new Date().toISOString() },
]

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1))
}

export function buildMockPost(config: AutoBlogConfig, keyword: string, existingSlugs: string[]): BlogPost {
  const subject = titleCase(keyword)
  const link = buildLinkPool(config).find((l) =>
    keyword.toLowerCase().split(/\s+/).some((w) => w.length > 3 && l.label.includes(w)),
  ) ?? { path: '/services', label: 'our renovation services' }

  let slug = slugify(keyword)
  if (existingSlugs.includes(slug)) slug = `${slug}-${Date.now().toString(36)}`

  const body = [
    { type: 'p', text: `If you are searching for "${keyword}", you are probably in the early planning stage of a project — and the amount of conflicting advice online can be overwhelming. This guide breaks down what actually matters, based on how renovation projects really work in the UK.` },
    { type: 'h2', text: `What affects ${keyword}?` },
    { type: 'p', text: `Every home is different, so treat anything you read online — including this — as a starting point rather than a fixed answer. The main factors are the size of the space, the condition of the existing structure, the materials you choose, and how much of the work involves plumbing, electrics or structural changes.` },
    { type: 'ul', items: [
      'Size and layout of the space',
      'Specification of materials and finishes',
      'Plumbing, electrical or structural work required',
      'Access to the property and any building constraints',
    ] },
    { type: 'h2', text: 'How to budget sensibly' },
    { type: 'p', text: `As a rough guide, UK renovation costs vary widely depending on specification, and every project is different — which is why reputable firms offer a free survey and written quote rather than quoting blind. Getting two or three detailed quotes is the single best way to understand the real cost of your specific project.` },
    { type: 'p', text: `If you would like an accurate figure for your home, you can [get a free, no-obligation quote](/contact) from our team. We also recommend reading about ${link.label.startsWith('our') ? link.label : `our ${link.label}`} services [here](${link.path}).` },
    { type: 'h2', text: 'Choosing the right team' },
    { type: 'p', text: `Look for a company that handles all trades in-house, provides a written quote, and is happy to show you recent local projects. Ask who will actually be on site each day and how snagging is handled at the end of the job.` },
  ] as BlogPost['blocks']

  return {
    slug,
    title: `${subject}: A Homeowner's Guide`.slice(0, 70),
    description: `Planning ${keyword}? An honest UK homeowner's guide covering costs, options and how to choose the right team — from ${config.company.name}.`.slice(0, 170),
    keywords: [keyword, `${keyword} uk`, `${keyword} guide`],
    targetKeyword: keyword,
    status: config.autoPublish ? 'published' : 'draft',
    publishedAt: new Date().toISOString(),
    relatedServices: [link.path],
    blocks: enforceCtas(body, config),
    faq: [
      { q: `How much should I budget for ${keyword}?`, a: 'Costs vary widely by size, specification and location. Treat online figures as a rough guide only — a free in-home survey and written quote is the only reliable way to price your specific project.' },
      { q: 'How long does a typical project take?', a: 'Most single-room projects take between one and four weeks of on-site work, depending on scope, materials lead time and whether structural, plumbing or electrical work is involved.' },
      { q: `Does ${config.company.name} cover my area?`, a: `${config.company.name} is based in Watford and covers ${config.company.areas.join(', ')}. Get in touch on ${config.company.phone} to discuss your project.` },
    ],
    factCheck: { claimsChecked: 0, claimsRemoved: 0, notes: 'mock mode — template content, no AI claims to check' },
    generatedBy: 'autoblog/1.0 (mock)',
  }
}
