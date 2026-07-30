// Shared types for the autoblog engine, the Next.js blog pages and the admin panel.
// Content lives in public/blog-content/ as JSON files (single source of truth).

export type PostStatus = 'draft' | 'published'

export type PostBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'cta'; heading: string; text: string; buttonText: string; href: string }

export interface PostFaq {
  q: string
  a: string
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  keywords: string[]
  targetKeyword: string
  status: PostStatus
  publishedAt: string // ISO date
  relatedServices: string[] // site paths e.g. "/kitchen-fitting-watford"
  blocks: PostBlock[]
  faq: PostFaq[]
  factCheck: {
    claimsChecked: number
    claimsRemoved: number
    notes: string
  }
  generatedBy: string
}

export interface BlogIndexEntry {
  slug: string
  title: string
  description: string
  targetKeyword: string
  keywords: string[]
  status: PostStatus
  publishedAt: string
}

export interface BlogIndex {
  updatedAt: string
  posts: BlogIndexEntry[]
}

export interface KeywordEntry {
  keyword: string
  score: number
  source: string // seed that produced it
  firstSeen: string // ISO date
}

export interface KeywordPool {
  updatedAt: string
  nextSeedIndex: number
  pool: KeywordEntry[]
}

export interface EngineRun {
  startedAt: string
  finishedAt: string
  mode: 'openai' | 'mock'
  status: 'ok' | 'no-topics' | 'not-due' | 'error'
  keyword?: string
  slug?: string
  postStatus?: PostStatus
  claimsChecked?: number
  claimsRemoved?: number
  error?: string
}

export interface EngineLog {
  runs: EngineRun[] // newest first, capped
}

// Runtime settings editable from the admin panel (public/blog-content/settings.json).
// postsPerDay: 0 = paused, 1-24 = that many posts per day, evenly spaced.
export interface BlogSettings {
  postsPerDay: number
  ga4MeasurementId: string // e.g. "G-XXXXXXX" — empty = GA4 disabled
  analyticsEmbedUrl: string // Looker Studio embed URL shown in the admin panel
  updatedAt: string
}
