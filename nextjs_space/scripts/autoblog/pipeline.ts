// The OpenAI-driven writing pipeline: pick a topic, draft a structured post,
// then enforce the commercial layer (service pitch CTAs) programmatically.

import type { BlogPost, PostBlock, PostFaq } from '../../lib/blog-types'
import { chatJson } from './openai'
import type { AutoBlogConfig } from './config'
import { buildLinkPool } from './config'

export interface Draft {
  title: string
  description: string
  keywords: string[]
  relatedServices: string[]
  blocks: PostBlock[]
  faq: PostFaq[]
}

const WRITER_SYSTEM = `You are a senior content writer for BMB Renovation, a home renovation company in Watford, UK.
You write helpful, specific, honest blog articles for homeowners in Hertfordshire, North London and Bedfordshire who are researching renovation projects.
Rules you MUST follow:
- British English, warm expert tone, no hype, no filler.
- Never invent statistics, studies, regulations, awards or review scores. If a number is needed (e.g. typical UK costs), present it as a rough, hedged range ("typically", "as a rough guide") and note that every project is different.
- Never claim BMB Renovation has qualities not listed in the approved facts (no fake years of experience, guarantees or accreditations).
- Weave 2-3 internal links into the body text using markdown syntax [anchor text](/path) — only paths from the provided link pool, only where genuinely relevant.
- The article must gently position BMB Renovation as the local team who can do the work — but the reader should get real value first.
- Output ONLY a JSON object.`

export async function selectTopic(
  apiKey: string,
  config: AutoBlogConfig,
  candidates: string[],
  existingTitles: string[],
): Promise<{ keyword: string; angle: string }> {
  const result = await chatJson<{ keyword: string; angle: string }>({
    apiKey,
    model: config.writerModel,
    temperature: 0.5,
    maxTokens: 300,
    system:
      'You are an SEO strategist for a UK home renovation company. Pick the single best keyword to target next — prefer high buying intent (cost/price/near me) and topics a renovation company can honestly advise on. Output JSON: {"keyword": "...", "angle": "one sentence describing the article angle"}.',
    user: `Candidate keywords (best first):\n${candidates
      .slice(0, 25)
      .map((k, i) => `${i + 1}. ${k}`)
      .join('\n')}\n\nAlready covered (do NOT pick anything similar):\n${existingTitles.slice(0, 30).join('\n') || '(none yet)'}`,
  })
  if (!result?.keyword) throw new Error('Topic selection returned no keyword')
  return result
}

export async function writeDraft(
  apiKey: string,
  config: AutoBlogConfig,
  keyword: string,
  angle: string,
): Promise<Draft> {
  const linkPool = buildLinkPool(config)
  const relevantLinks = linkPool.filter((l) => {
    const words = keyword.toLowerCase().split(/\s+/)
    return l.path === '/contact' || words.some((w) => w.length > 3 && l.label.includes(w))
  })
  const linksForPrompt = [...relevantLinks.slice(0, 12), ...linkPool.filter((l) => l.path === '/services' || l.path === '/portfolio')]

  const draft = await chatJson<Draft>({
    apiKey,
    model: config.writerModel,
    temperature: config.temperature,
    maxTokens: 6000,
    system: WRITER_SYSTEM,
    user: `Write a blog article targeting the Google search query: "${keyword}".
Angle: ${angle}
Length: ${config.minWords}-${config.maxWords} words of body content.

Approved facts about the company (the ONLY claims you may make about BMB Renovation):
${config.approvedFacts.map((f) => `- ${f}`).join('\n')}

Internal link pool (use 2-3 of these as markdown links in body text):
${linksForPrompt.map((l) => `- ${l.path} (${l.label})`).join('\n')}

Output a JSON object with exactly these fields:
{
  "title": "SEO title, max 60 characters, includes the keyword naturally",
  "description": "meta description, 140-160 characters, includes the keyword",
  "keywords": ["3-6 related search terms"],
  "relatedServices": ["1-3 paths from the link pool most relevant to this article"],
  "blocks": [
    {"type": "p", "text": "intro paragraph (no H1 — the title is rendered separately)"},
    {"type": "h2", "text": "section heading"},
    {"type": "p", "text": "paragraph, may contain [markdown links](/path)"},
    {"type": "h3", "text": "optional sub-heading"},
    {"type": "ul", "items": ["bullet point", "bullet point"]}
  ],
  "faq": [{"q": "question a searcher would ask", "a": "concise honest answer"}]
}
Requirements:
- 8-14 blocks total, mixing h2/h3/p/ul. No cta blocks — those are added automatically.
- 3-5 FAQ entries targeting "People Also Ask" style questions for this keyword.
- Do NOT include a conclusion that pitches the company in the final paragraph — a CTA block is appended automatically.`,
  })

  if (!draft?.title || !Array.isArray(draft.blocks) || draft.blocks.length === 0) {
    throw new Error('Draft generation returned invalid content')
  }
  draft.faq = Array.isArray(draft.faq) ? draft.faq : []
  draft.keywords = Array.isArray(draft.keywords) ? draft.keywords : []
  draft.relatedServices = Array.isArray(draft.relatedServices) ? draft.relatedServices : []
  return draft
}

// Guarantee every post pitches the service: a mid-article CTA and a closing CTA,
// added in code so no model behaviour can skip them.
export function enforceCtas(blocks: PostBlock[], config: AutoBlogConfig): PostBlock[] {
  const withoutCtas = blocks.filter((b) => b.type !== 'cta')

  const midCta: PostBlock = {
    type: 'cta',
    heading: 'Thinking about your own project?',
    text: `${config.company.name} covers ${config.company.areas.slice(0, 5).join(', ')} and beyond — all trades in-house. Call ${config.company.phone} or send us a message.`,
    buttonText: 'Get a Free Quote',
    href: config.cta.href,
  }
  const closingCta: PostBlock = {
    type: 'cta',
    heading: config.cta.heading,
    text: config.cta.text,
    buttonText: config.cta.buttonText,
    href: config.cta.href,
  }

  const insertAt = Math.min(4, Math.max(2, Math.floor(withoutCtas.length / 2)))
  const result = [...withoutCtas]
  result.splice(insertAt, 0, midCta)
  result.push(closingCta)
  return result
}

export function assemblePost(
  slug: string,
  keyword: string,
  draft: Draft,
  factCheck: BlogPost['factCheck'],
  config: AutoBlogConfig,
): BlogPost {
  return {
    slug,
    title: draft.title.slice(0, 70),
    description: draft.description.slice(0, 170),
    keywords: draft.keywords,
    targetKeyword: keyword,
    status: config.autoPublish ? 'published' : 'draft',
    publishedAt: new Date().toISOString(),
    relatedServices: draft.relatedServices,
    blocks: enforceCtas(draft.blocks, config),
    faq: draft.faq,
    factCheck,
    generatedBy: `autoblog/1.0 (writer: ${config.writerModel}, review: ${config.reviewModel})`,
  }
}
