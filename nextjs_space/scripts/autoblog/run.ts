// AutoBlog engine entry point.
//
//   npm run blog:run                  generate posts once (needs OPENAI_API_KEY in .env)
//   npm run blog:run -- --mock        no API key / no network — template post, for testing
//   npm run blog:run -- --daemon      keep running, one batch every daemonIntervalHours
//   npm run blog:run -- --posts 3     override postsPerRun from config
//
// GitHub Actions runs this daily; you can also run it locally or on a cron.

import 'dotenv/config'
import { loadConfig } from './config'
import { refreshKeywordPool, pickCandidates } from './keywords'
import { selectTopic, writeDraft, assemblePost } from './pipeline'
import { factCheckDraft } from './factcheck'
import { MOCK_KEYWORDS, buildMockPost } from './mock'
import { loadIndex, loadKeywords, saveKeywords, savePost, appendLog, slugify, postExists, updateSitemap, loadSettings, loadLog, duePostsToday, successfulRunsToday } from './store'
import type { EngineRun } from '../../lib/blog-types'

const args = process.argv.slice(2)
const MOCK = args.includes('--mock')
const DAEMON = args.includes('--daemon')
const FORCE = args.includes('--force') // bypass the postsPerDay cadence (manual runs)
const postsFlag = args.indexOf('--posts')
const POSTS_OVERRIDE = postsFlag !== -1 ? parseInt(args[postsFlag + 1] ?? '', 10) : undefined

function uniqueSlug(base: string): string {
  let slug = slugify(base)
  if (postExists(slug)) slug = `${slug}-${Date.now().toString(36)}`
  return slug
}

async function generateOne(mode: 'openai' | 'mock'): Promise<EngineRun> {
  const startedAt = new Date().toISOString()
  const config = loadConfig()

  // Cadence gate (scheduled runs only): honour postsPerDay from settings.json.
  // 0 = paused; otherwise generate only if we're behind the even-spacing curve.
  if (mode === 'openai' && !FORCE) {
    const settings = loadSettings()
    const done = successfulRunsToday(loadLog())
    const due = duePostsToday(settings.postsPerDay)
    if (settings.postsPerDay === 0 || done >= due) {
      return { startedAt, finishedAt: new Date().toISOString(), mode, status: 'not-due' }
    }
  }

  const index = loadIndex()
  const keywords = loadKeywords()

  // 1. Make sure there is keyword data to work from.
  if (mode === 'mock') {
    if (keywords.pool.length === 0) {
      keywords.pool = [...MOCK_KEYWORDS]
      keywords.updatedAt = new Date().toISOString()
      saveKeywords(keywords)
    }
  } else {
    const added = await refreshKeywordPool(keywords, config.keywordSeeds, config.seedBatchSize)
    saveKeywords(keywords)
    console.log(`[autoblog] keyword pool: +${added} new (total ${keywords.pool.length})`)
  }

  // 2. Find uncovered topics.
  const covered = index.posts.map((p) => p.targetKeyword)
  const candidates = pickCandidates(keywords, covered, 25)
  if (candidates.length === 0) {
    return { startedAt, finishedAt: new Date().toISOString(), mode, status: 'no-topics' }
  }

  // 3. Generate the post.
  if (mode === 'mock') {
    const keyword = candidates[0].keyword
    const post = buildMockPost(config, keyword, index.posts.map((p) => p.slug))
    savePost(post)
    updateSitemap(config.siteUrl)
    return {
      startedAt,
      finishedAt: new Date().toISOString(),
      mode,
      status: 'ok',
      keyword,
      slug: post.slug,
      postStatus: post.status,
    }
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set. Add it to nextjs_space/.env or use --mock.')

  const topic = await selectTopic(apiKey, config, candidates.map((c) => c.keyword), index.posts.map((p) => p.title))
  console.log(`[autoblog] topic: "${topic.keyword}" — ${topic.angle}`)

  const draft = await writeDraft(apiKey, config, topic.keyword, topic.angle)
  const checked = await factCheckDraft(apiKey, config, draft)
  console.log(`[autoblog] fact-check: ${checked.report.claimsChecked} claims checked, ${checked.report.claimsRemoved} removed/hedged`)

  const post = assemblePost(uniqueSlug(topic.keyword), topic.keyword, { ...draft, blocks: checked.blocks, faq: checked.faq }, checked.report, config)
  savePost(post)
  updateSitemap(config.siteUrl)

  return {
    startedAt,
    finishedAt: new Date().toISOString(),
    mode,
    status: 'ok',
    keyword: topic.keyword,
    slug: post.slug,
    postStatus: post.status,
    claimsChecked: checked.report.claimsChecked,
    claimsRemoved: checked.report.claimsRemoved,
  }
}

async function runBatch(): Promise<boolean> {
  const config = loadConfig()
  const count = Math.max(1, POSTS_OVERRIDE ?? config.postsPerRun ?? 1)
  const mode = MOCK ? 'mock' : 'openai'
  let ok = true

  for (let i = 0; i < count; i++) {
    let run: EngineRun
    try {
      run = await generateOne(mode)
    } catch (err: any) {
      run = {
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        mode,
        status: 'error',
        error: err?.message ?? String(err),
      }
      ok = false
    }
    appendLog(run)
    console.log(`[autoblog] run: ${run.status}${run.slug ? ` → /blog/${run.slug}` : ''}${run.error ? ` — ${run.error}` : ''}`)
  }
  return ok
}

async function main() {
  if (DAEMON) {
    const config = loadConfig()
    const interval = Math.max(1, config.daemonIntervalHours) * 60 * 60 * 1000
    console.log(`[autoblog] daemon mode — a batch every ${config.daemonIntervalHours}h (Ctrl+C to stop)`)
    await runBatch()
    setInterval(() => {
      runBatch().catch((err) => console.error('[autoblog] daemon batch failed:', err))
    }, interval)
    return
  }

  const ok = await runBatch()
  process.exit(ok ? 0 : 1)
}

main().catch((err) => {
  console.error('[autoblog] fatal:', err)
  process.exit(1)
})
