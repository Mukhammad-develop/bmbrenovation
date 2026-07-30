// Keyword research from real Google Autocomplete data (free, no API key).
// Harvests a rotating slice of seed combinations each run so the pool grows
// over time without hammering Google.

import type { KeywordEntry, KeywordPool } from '../../lib/blog-types'

export interface KeywordSeeds {
  servicePhrases: string[]
  locations: string[]
  modifiers: string[]
}

const SUGGEST_ENDPOINT = 'https://suggestqueries.google.com/complete/search'
const REQUEST_GAP_MS = 400

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function buildSeedQueries(seeds: KeywordSeeds): string[] {
  const queries: string[] = []
  for (const service of seeds.servicePhrases) {
    for (const location of seeds.locations) {
      queries.push(`${service} ${location}`)
      for (const modifier of seeds.modifiers) {
        queries.push(`${service} ${modifier} ${location}`)
      }
    }
    // Generic (non-local) research queries, e.g. "kitchen renovation ideas".
    for (const modifier of seeds.modifiers) {
      queries.push(`${service} ${modifier}`)
    }
  }
  return queries
}

// Higher score = more likely to attract visitors who convert.
export function scoreKeyword(keyword: string): number {
  const k = keyword.toLowerCase()
  let score = 1
  if (/\b(cost|price|how much|budget)\b/.test(k)) score += 4 // high buying intent
  if (/\b(near me|company|companies|builders|fitters)\b/.test(k)) score += 3 // looking to hire
  if (/\b(ideas|design|inspiration|before and after)\b/.test(k)) score += 2
  if (/\b(best|top|guide|how to)\b/.test(k)) score += 1
  if (k.length > 60) score -= 1 // very long-tail, likely near-zero volume
  if (/\b(jobs|course|salary|free)\b/.test(k)) score -= 3 // wrong audience
  return score
}

async function fetchSuggestions(query: string): Promise<string[]> {
  const url = `${SUGGEST_ENDPOINT}?client=firefox&hl=en&gl=uk&q=${encodeURIComponent(query)}`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BMB-AutoBlog/1.0)' },
    })
    if (!res.ok) return []
    const data = (await res.json()) as [string, string[]]
    return Array.isArray(data?.[1]) ? data[1] : []
  } catch {
    return [] // network hiccup — skip this seed, don't kill the run
  }
}

// Harvest the next slice of seeds and merge into the existing pool.
// Returns the number of brand-new keywords added.
export async function refreshKeywordPool(
  pool: KeywordPool,
  seeds: KeywordSeeds,
  batchSize: number,
): Promise<number> {
  const queries = buildSeedQueries(seeds)
  const start = pool.nextSeedIndex % queries.length
  const batch = Array.from({ length: Math.min(batchSize, queries.length) }, (_, i) => queries[(start + i) % queries.length])
  pool.nextSeedIndex = (start + batch.length) % queries.length

  const seen = new Set(pool.pool.map((e) => e.keyword.toLowerCase()))
  let added = 0

  for (const query of batch) {
    const suggestions = await fetchSuggestions(query)
    for (const s of suggestions) {
      const keyword = s.trim().toLowerCase()
      if (keyword.length < 8 || seen.has(keyword)) continue
      seen.add(keyword)
      pool.pool.push({
        keyword,
        score: scoreKeyword(keyword),
        source: query,
        firstSeen: new Date().toISOString(),
      })
      added++
    }
    await sleep(REQUEST_GAP_MS)
  }

  // Keep the pool bounded — best keywords first.
  pool.pool.sort((a, b) => b.score - a.score)
  pool.pool = pool.pool.slice(0, 2000)
  pool.updatedAt = new Date().toISOString()
  return added
}

// Pick candidate keywords that have not been covered by existing posts.
export function pickCandidates(pool: KeywordPool, coveredKeywords: string[], limit: number): KeywordEntry[] {
  const covered = new Set(coveredKeywords.map((k) => k.toLowerCase()))
  return pool.pool
    .filter((e) => !covered.has(e.keyword.toLowerCase()))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
