// Fact-check pass: a second OpenAI call reviews the draft claim by claim.
// Anything unverifiable (statistics, prices stated as fact, regulations,
// invented company claims) is removed or hedged before publishing.
//
// Honest scope: this is grounding + model self-verification, not live web
// lookup. To add real web verification later, plug a search API (e.g. Tavily)
// in here and pass the results in as evidence.

import type { BlogPost } from '../../lib/blog-types'
import { chatJson } from './openai'
import type { AutoBlogConfig } from './config'
import type { Draft } from './pipeline'

interface FactCheckResult {
  blocks: Draft['blocks']
  faq: Draft['faq']
  claimsChecked: number
  claimsRemoved: number
  notes: string
}

export async function factCheckDraft(
  apiKey: string,
  config: AutoBlogConfig,
  draft: Draft,
): Promise<{ blocks: Draft['blocks']; faq: Draft['faq']; report: BlogPost['factCheck'] }> {
  const result = await chatJson<FactCheckResult>({
    apiKey,
    model: config.model,
    temperature: 0.2,
    maxTokens: 6000,
    system: `You are a meticulous fact-checker for a UK home renovation company's blog.
Your job is to make sure nothing in the article is hallucinated. Review every factual claim and fix the content accordingly:
- REMOVE or REWRITE any invented statistic, study, regulation, law, award or review score.
- Claims about BMB Renovation must match the approved facts exactly — remove anything beyond them.
- Prices/costs may only appear as rough, clearly-hedged typical UK ranges ("as a rough guide", "typically") with a note that every project differs and readers should get a free quote for accurate pricing.
- Keep genuinely useful general trade knowledge (how renovations work, what affects cost, planning considerations) — that is fine.
- Preserve the structure, internal markdown links and tone. Keep the JSON shape identical.
Output ONLY a JSON object.`,
    user: `Approved facts about BMB Renovation:
${config.approvedFacts.map((f) => `- ${f}`).join('\n')}

Article to check (JSON):
${JSON.stringify({ blocks: draft.blocks, faq: draft.faq }, null, 2)}

Return JSON with exactly these fields:
{
  "blocks": [...same shape as input, with fixes applied...],
  "faq": [...same shape as input, with fixes applied...],
  "claimsChecked": <number of factual claims reviewed>,
  "claimsRemoved": <number of claims removed or hedged>,
  "notes": "one sentence summarising what was fixed"
}`,
  })

  if (!result || !Array.isArray(result.blocks)) {
    // Fact-check call failed structurally — publish nothing risky: keep the draft
    // but report that verification did not complete.
    return {
      blocks: draft.blocks,
      faq: draft.faq,
      report: { claimsChecked: 0, claimsRemoved: 0, notes: 'fact-check pass failed to parse; original draft kept' },
    }
  }

  return {
    blocks: result.blocks,
    faq: Array.isArray(result.faq) ? result.faq : [],
    report: {
      claimsChecked: result.claimsChecked ?? 0,
      claimsRemoved: result.claimsRemoved ?? 0,
      notes: result.notes ?? '',
    },
  }
}
