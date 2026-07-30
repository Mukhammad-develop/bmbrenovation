// Persistence for the autoblog engine: posts, index, keyword pool, run log,
// and sitemap.xml updates. Everything lives in public/blog-content/ so the
// same files are readable by fs at build time and over HTTP by the admin panel.

import fs from 'fs'
import path from 'path'
import type { BlogIndex, BlogPost, EngineLog, EngineRun, KeywordPool } from '../../lib/blog-types'

const ROOT = process.cwd()
export const CONTENT_DIR = path.join(ROOT, 'public', 'blog-content')
export const POSTS_DIR = path.join(CONTENT_DIR, 'posts')
const INDEX_FILE = path.join(CONTENT_DIR, 'index.json')
const KEYWORDS_FILE = path.join(CONTENT_DIR, 'keywords.json')
const LOG_FILE = path.join(CONTENT_DIR, 'engine-log.json')
const SITEMAP_FILE = path.join(ROOT, 'public', 'sitemap.xml')

const MAX_LOG_RUNS = 100

function ensureDirs() {
  fs.mkdirSync(POSTS_DIR, { recursive: true })
}

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as T
  } catch {
    return fallback
  }
}

function writeJson(file: string, data: unknown) {
  ensureDirs()
  const tmp = `${file}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n')
  fs.renameSync(tmp, file)
}

export function loadIndex(): BlogIndex {
  return readJson<BlogIndex>(INDEX_FILE, { updatedAt: new Date().toISOString(), posts: [] })
}

export function saveIndex(index: BlogIndex) {
  index.updatedAt = new Date().toISOString()
  writeJson(INDEX_FILE, index)
}

export function loadKeywords(): KeywordPool {
  return readJson<KeywordPool>(KEYWORDS_FILE, {
    updatedAt: new Date().toISOString(),
    nextSeedIndex: 0,
    pool: [],
  })
}

export function saveKeywords(keywords: KeywordPool) {
  writeJson(KEYWORDS_FILE, keywords)
}

export function loadLog(): EngineLog {
  return readJson<EngineLog>(LOG_FILE, { runs: [] })
}

export function appendLog(run: EngineRun) {
  const log = loadLog()
  log.runs.unshift(run)
  log.runs = log.runs.slice(0, MAX_LOG_RUNS)
  writeJson(LOG_FILE, log)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function postExists(slug: string): boolean {
  return fs.existsSync(path.join(POSTS_DIR, `${slug}.json`))
}

// Save a post and upsert its summary entry in the index.
export function savePost(post: BlogPost) {
  writeJson(path.join(POSTS_DIR, `${post.slug}.json`), post)

  const index = loadIndex()
  index.posts = index.posts.filter((p) => p.slug !== post.slug)
  index.posts.unshift({
    slug: post.slug,
    title: post.title,
    description: post.description,
    targetKeyword: post.targetKeyword,
    keywords: post.keywords,
    status: post.status,
    publishedAt: post.publishedAt,
  })
  saveIndex(index)
}

// Rewrite the Blog Posts section of public/sitemap.xml (idempotent).
export function updateSitemap(siteUrl: string) {
  if (!fs.existsSync(SITEMAP_FILE)) return
  const index = loadIndex()
  const published = index.posts.filter((p) => p.status === 'published')

  const section = published
    .map(
      (p) => `  <url>
    <loc>${siteUrl}/blog/${p.slug}</loc>
    <lastmod>${p.publishedAt.slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join('\n')

  const BEGIN = '  <!-- Blog Posts -->'
  const END = '  <!-- /Blog Posts -->'
  const block = published.length > 0 ? `${BEGIN}\n${section}\n${END}` : ''

  let xml = fs.readFileSync(SITEMAP_FILE, 'utf-8')
  xml = xml.replace(/  <!-- Blog Posts -->[\s\S]*?<!-- \/Blog Posts -->\n?/, '')
  xml = xml.replace('</urlset>', `${block ? block + '\n\n' : ''}</urlset>`)
  fs.writeFileSync(SITEMAP_FILE, xml)
}
