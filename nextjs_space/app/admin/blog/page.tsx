'use client'

import { useState, useEffect, useCallback } from 'react'

export const dynamic = 'force-static'

// ── CONFIG ───────────────────────────────────────────────────────────────────
// Same access code + session key as /admin/quotes — one login for both.
const PASS = 'bmb2026'
const SESSION_KEY = 'bmb_admin_auth'
const GH_TOKEN_KEY = 'bmb_gh_pat' // persisted in localStorage so it survives sessions
const GH_TOKEN_SAVED_KEY = 'bmb_gh_pat_saved'
const GH_REPO = 'Mukhammad-develop/bmbrenovation'
const GH_BRANCH = 'main'
const INDEX_PATH = 'nextjs_space/public/blog-content/index.json'
const SETTINGS_PATH = 'nextjs_space/public/blog-content/settings.json'
const POSTS_DIR = 'nextjs_space/public/blog-content/posts'
const WORKFLOW_FILE = 'autoblog.yml'

// ── TYPES ────────────────────────────────────────────────────────────────────
interface IndexEntry {
  slug: string
  title: string
  description: string
  targetKeyword: string
  status: 'draft' | 'published'
  publishedAt: string
}
interface BlogIndex { updatedAt: string; posts: IndexEntry[] }
interface EngineRun {
  startedAt: string
  finishedAt: string
  mode: string
  status: 'ok' | 'no-topics' | 'error'
  keyword?: string
  slug?: string
  error?: string
}
interface KeywordPool { pool: { keyword: string; score: number }[] }

// ── GITHUB HELPERS ───────────────────────────────────────────────────────────
function b64encode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
}

async function gh(token: string, path: string, options: RequestInit = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    cache: 'no-store',
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`GitHub ${res.status}: ${body.slice(0, 200)}`)
  }
  return res.status === 204 ? null : res.json()
}

async function ghGetFile(token: string, path: string): Promise<{ sha: string; content: string }> {
  const data = await gh(token, `/repos/${GH_REPO}/contents/${path}?ref=${GH_BRANCH}&t=${Date.now()}`)
  const content = decodeURIComponent(escape(atob((data.content || '').replace(/\n/g, ''))))
  return { sha: data.sha, content }
}

async function ghPutFile(token: string, path: string, content: string, sha: string | undefined, message: string) {
  await gh(token, `/repos/${GH_REPO}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: b64encode(content), sha, branch: GH_BRANCH }),
  })
}

// Read-modify-write with conflict retry: another writer (engine run, second
// tab) may bump the file between our read and write → GitHub answers 409.
async function ghUpdateFile(token: string, path: string, message: string, mutate: (content: string) => string) {
  let lastErr: any
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const file = await ghGetFile(token, path)
      await ghPutFile(token, path, mutate(file.content), file.sha, message)
      return
    } catch (err: any) {
      lastErr = err
      if (!/409/.test(err?.message || '')) throw err
    }
  }
  throw lastErr
}

async function ghDeleteFile(token: string, path: string, sha: string, message: string) {
  await gh(token, `/repos/${GH_REPO}/contents/${path}`, {
    method: 'DELETE',
    body: JSON.stringify({ message, sha, branch: GH_BRANCH }),
  })
}

// ── PAGE ─────────────────────────────────────────────────────────────────────
export default function AdminBlogPage() {
  const [authed, setAuthed] = useState(false)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [index, setIndex] = useState<BlogIndex | null>(null)
  const [runs, setRuns] = useState<EngineRun[]>([])
  const [keywordCount, setKeywordCount] = useState<number>(0)
  const [loadError, setLoadError] = useState('')

  const [ghToken, setGhToken] = useState('')
  const [ghInput, setGhInput] = useState('')
  const [tokenSavedAt, setTokenSavedAt] = useState('')
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [busy, setBusy] = useState('')
  const [notice, setNotice] = useState('')
  const [previewSlug, setPreviewSlug] = useState<string | null>(null)
  const [preview, setPreview] = useState<any>(null)
  const [settings, setSettings] = useState<any>(null)
  const [freqInput, setFreqInput] = useState('1')
  const [ga4Input, setGa4Input] = useState('')
  const [embedInput, setEmbedInput] = useState('')
  const [settingsBusy, setSettingsBusy] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const bust = `?t=${Date.now()}`
      const [idx, log, kw, st] = await Promise.all([
        fetch(`/blog-content/index.json${bust}`).then((r) => r.json()),
        fetch(`/blog-content/engine-log.json${bust}`).then((r) => r.json()),
        fetch(`/blog-content/keywords.json${bust}`).then((r) => r.json()),
        fetch(`/blog-content/settings.json${bust}`).then((r) => r.json()),
      ])
      setIndex(idx)
      setRuns((log.runs || []).slice(0, 10))
      setKeywordCount((kw as KeywordPool).pool?.length ?? 0)
      setSettings(st)
      setFreqInput(String(st.postsPerDay ?? 1))
      setGa4Input(st.ga4MeasurementId || '')
      setEmbedInput(st.analyticsEmbedUrl || '')
      setLoadError('')
    } catch {
      setLoadError('Could not load blog content files. The engine may not have run yet on this deployment.')
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    if (sessionStorage.getItem(SESSION_KEY) === '1') setAuthed(true)
    const saved = localStorage.getItem(GH_TOKEN_KEY)
    if (saved) {
      setGhToken(saved)
      setTokenSavedAt(localStorage.getItem(GH_TOKEN_SAVED_KEY) || '')
    }
  }, [])

  useEffect(() => {
    if (authed) loadData()
  }, [authed, loadData])

  const login = () => {
    if (code === PASS) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setAuthed(true)
      setCodeError(false)
    } else {
      setCodeError(true)
      setCode('')
    }
  }

  const saveToken = () => {
    const token = ghInput.trim()
    if (!token) return
    const savedAt = new Date().toISOString()
    localStorage.setItem(GH_TOKEN_KEY, token)
    localStorage.setItem(GH_TOKEN_SAVED_KEY, savedAt)
    setGhToken(token)
    setTokenSavedAt(savedAt)
    setGhInput('')
    setShowTokenInput(false)
    setNotice('GitHub token saved in this browser — it stays until you disconnect it.')
  }

  const clearToken = () => {
    localStorage.removeItem(GH_TOKEN_KEY)
    localStorage.removeItem(GH_TOKEN_SAVED_KEY)
    setGhToken('')
    setTokenSavedAt('')
  }

  // Commit a settings.json change to GitHub (schedule, GA4 id, analytics embed).
  const saveSettings = async (patch: Record<string, any>) => {
    if (!ghToken) {
      setNotice('Connect a GitHub token first to change settings.')
      return
    }
    setSettingsBusy(true)
    try {
      let updated: any = null
      await ghUpdateFile(ghToken, SETTINGS_PATH, 'autoblog(admin): update settings', (content) => {
        updated = { ...JSON.parse(content), ...patch, updatedAt: new Date().toISOString() }
        return JSON.stringify(updated, null, 2) + '\n'
      })
      setSettings(updated)
      setNotice('Settings saved — live after the next site rebuild & deploy (up to ~15 min).')
    } catch (err: any) {
      setNotice(`Failed: ${err.message}`)
    } finally {
      setSettingsBusy(false)
    }
  }

  // Commit a new index.json to GitHub (with conflict retry).
  const commitIndex = async (updated: BlogIndex, message: string) => {
    if (!ghToken) throw new Error('Add a GitHub token first')
    await ghUpdateFile(ghToken, INDEX_PATH, message, () => JSON.stringify(updated, null, 2) + '\n')
  }

  const setStatus = async (slug: string, status: 'draft' | 'published') => {
    setBusy(slug)
    setNotice('')
    try {
      if (!index) return
      const updated: BlogIndex = {
        ...index,
        updatedAt: new Date().toISOString(),
        posts: index.posts.map((p) => (p.slug === slug ? { ...p, status } : p)),
      }
      await commitIndex(updated, `autoblog(admin): ${status} ${slug}`)
      setIndex(updated)
      setNotice(`"${slug}" ${status === 'published' ? 'published' : 'unpublished'} — live after the next site rebuild & deploy.`)
    } catch (err: any) {
      setNotice(`Failed: ${err.message}`)
    } finally {
      setBusy('')
    }
  }

  const deletePost = async (slug: string) => {
    if (!confirm(`Delete "${slug}" permanently?`)) return
    setBusy(slug)
    setNotice('')
    try {
      if (!index) return
      const updated: BlogIndex = {
        ...index,
        updatedAt: new Date().toISOString(),
        posts: index.posts.filter((p) => p.slug !== slug),
      }
      await commitIndex(updated, `autoblog(admin): delete ${slug}`)
      // Also remove the post file itself (needs its own sha).
      try {
        const postFile = await ghGetFile(ghToken, `${POSTS_DIR}/${slug}.json`)
        await ghDeleteFile(ghToken, `${POSTS_DIR}/${slug}.json`, postFile.sha, `autoblog(admin): delete ${slug} post file`)
      } catch {
        // Post file may not exist (e.g. never committed) — index removal is enough.
      }
      setIndex(updated)
      setNotice(`"${slug}" deleted — gone after the next site rebuild & deploy.`)
    } catch (err: any) {
      setNotice(`Failed: ${err.message}`)
    } finally {
      setBusy('')
    }
  }

  const generateNow = async () => {
    setBusy('generate')
    setNotice('')
    try {
      if (!ghToken) throw new Error('Add a GitHub token first')
      await gh(ghToken, `/repos/${GH_REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`, {
        method: 'POST',
        body: JSON.stringify({ ref: GH_BRANCH }),
      })
      setNotice('Generation started on GitHub Actions. It takes a few minutes — refresh this page shortly, and expect the post live after the next rebuild & deploy.')
    } catch (err: any) {
      setNotice(`Failed: ${err.message}`)
    } finally {
      setBusy('')
    }
  }

  const togglePreview = async (slug: string) => {
    if (previewSlug === slug) {
      setPreviewSlug(null)
      setPreview(null)
      return
    }
    setPreviewSlug(slug)
    setPreview(null)
    try {
      const post = await fetch(`/blog-content/posts/${slug}.json?t=${Date.now()}`).then((r) => r.json())
      setPreview(post)
    } catch {
      setPreview({ error: 'Could not load post content.' })
    }
  }

  if (!mounted) return null

  // ── PASSWORD GATE ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.5rem', padding: '3rem 2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '1rem', background: 'linear-gradient(135deg, #C8A97E, #a07850)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.75rem' }}>✍️</div>
            <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.4rem', letterSpacing: '-0.03em' }}>BMB Renovation</h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', margin: 0 }}>Admin — AutoBlog Control</p>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Access Code</label>
            <input
              type="password"
              value={code}
              onChange={(e) => { setCode(e.target.value); setCodeError(false) }}
              onKeyDown={(e) => e.key === 'Enter' && login()}
              placeholder="Enter access code"
              autoFocus
              style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.07)', border: `1.5px solid ${codeError ? '#f87171' : 'rgba(255,255,255,0.12)'}`, color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
            />
            {codeError && <p style={{ color: '#f87171', fontSize: '0.8125rem', margin: '0.5rem 0 0' }}>Incorrect access code. Please try again.</p>}
          </div>
          <button onClick={login} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #C8A97E, #a07850)', border: 'none', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em' }}>
            Enter Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const posts = index?.posts ?? []
  const published = posts.filter((p) => p.status === 'published')
  const drafts = posts.filter((p) => p.status === 'draft')
  const lastRun = runs[0]
  const statusColor: Record<string, string> = { ok: '#22c55e', 'no-topics': '#f59e0b', 'not-due': '#94a3b8', error: '#f87171', published: '#22c55e', draft: '#f59e0b' }

  const btn = (bg: string, border: string, color: string): React.CSSProperties => ({
    padding: '0.4rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
    background: bg, border: `1px solid ${border}`, color,
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Inter','Segoe UI',sans-serif", color: '#fff' }}>

      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <span style={{ fontWeight: 900, fontSize: '1.125rem', letterSpacing: '-0.02em', color: '#C8A97E' }}>BMBRENOVATION</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginLeft: '1rem' }}>AutoBlog Control</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="/blog" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem', textDecoration: 'none' }}>View blog →</a>
          <a href="/admin/quotes" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem', textDecoration: 'none' }}>Quotes dashboard →</a>
          <button onClick={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false) }} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.8125rem' }}>Sign out</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Notice */}
        <div style={{ background: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.3)', borderRadius: '0.75rem', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
          🤖 The engine runs daily on GitHub Actions and researches what people search on Google, writes fact-checked articles, and pitches BMB services in every post. Changes made here take effect after the next site rebuild &amp; deploy.
        </div>

        {notice && (
          <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '0.75rem', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#93c5fd' }}>
            {notice}
          </div>
        )}
        {loadError && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.75rem', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#fca5a5' }}>
            {loadError}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Published Posts', value: published.length, icon: '📰', color: '#22c55e' },
            { label: 'Drafts', value: drafts.length, icon: '📝', color: '#f59e0b' },
            { label: 'Keywords Tracked', value: keywordCount, icon: '🔍', color: '#60a5fa' },
            { label: 'Last Run', value: lastRun ? lastRun.status : '—', icon: lastRun?.status === 'ok' ? '✅' : '⏳', color: lastRun ? statusColor[lastRun.status] : 'rgba(255,255,255,0.4)' },
          ].map((s) => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: s.label === 'Last Run' ? '1.25rem' : '2rem', fontWeight: 800, color: s.color, lineHeight: 1, textTransform: 'capitalize' }}>{s.value}</div>
              <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Controls: generate + GitHub token */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700 }}>Generate Content</h3>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)' }}>
                Trigger the engine manually, or run locally: <code style={{ color: '#C8A97E' }}>npm run blog:run</code>
              </p>
            </div>
            <button onClick={generateNow} disabled={!ghToken || busy === 'generate'} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.625rem', background: ghToken ? 'linear-gradient(135deg, #C8A97E, #a07850)' : 'rgba(255,255,255,0.08)', border: 'none', color: ghToken ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: '0.875rem', fontWeight: 700, cursor: ghToken ? 'pointer' : 'not-allowed' }}>
              {busy === 'generate' ? '⏳ Starting…' : '⚡ Generate a Post Now'}
            </button>
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {ghToken && !showTokenInput ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8125rem', color: '#4ade80' }}>
                  🔑 GitHub connected{tokenSavedAt && <> · saved {new Date(tokenSavedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</>} · tokens live ~90 days, renew before expiry
                </span>
                <button onClick={() => setShowTokenInput(true)} style={btn('rgba(96,165,250,0.1)', 'rgba(96,165,250,0.25)', '#93c5fd')}>Renew token</button>
                <button onClick={clearToken} style={btn('rgba(239,68,68,0.1)', 'rgba(239,68,68,0.2)', '#f87171')}>Disconnect</button>
              </div>
            ) : (
              <div>
                <p style={{ margin: '0 0 0.625rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>
                  To publish, delete, change the schedule or trigger generation, paste a <strong style={{ color: '#C8A97E' }}>GitHub fine-grained personal access token</strong> for the <code>{GH_REPO}</code> repo with <strong>Contents: Read &amp; write</strong> and <strong>Actions: Read &amp; write</strong> permissions. It is remembered in this browser (localStorage) until you disconnect — renew it here before its 90-day expiry. Without it the panel is read-only.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <input
                    type="password"
                    value={ghInput}
                    onChange={(e) => setGhInput(e.target.value)}
                    placeholder="github_pat_…"
                    style={{ flex: 1, minWidth: '220px', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.8125rem', outline: 'none' }}
                  />
                  <button onClick={saveToken} disabled={!ghInput.trim()} style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', fontSize: '0.8125rem', fontWeight: 600, cursor: ghInput.trim() ? 'pointer' : 'not-allowed' }}>
                    {ghToken ? 'Save new token' : 'Connect'}
                  </button>
                  {ghToken && (
                    <button onClick={() => { setShowTokenInput(false); setGhInput('') }} style={btn('rgba(255,255,255,0.06)', 'rgba(255,255,255,0.12)', '#fff')}>Cancel</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 700 }}>Publishing Schedule</h3>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)' }}>
                The engine checks hourly and keeps posts evenly spaced through the day.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="number"
                min={0}
                max={24}
                value={freqInput}
                onChange={(e) => setFreqInput(e.target.value)}
                style={{ width: '72px', padding: '0.625rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '1rem', fontWeight: 700, textAlign: 'center', outline: 'none' }}
              />
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>posts / day</span>
              <button
                onClick={() => saveSettings({ postsPerDay: Math.min(24, Math.max(0, parseInt(freqInput, 10) || 0)) })}
                disabled={settingsBusy || !ghToken}
                style={{ padding: '0.625rem 1.25rem', borderRadius: '0.5rem', background: ghToken ? 'linear-gradient(135deg, #C8A97E, #a07850)' : 'rgba(255,255,255,0.08)', border: 'none', color: ghToken ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: '0.8125rem', fontWeight: 700, cursor: ghToken ? 'pointer' : 'not-allowed' }}
              >
                {settingsBusy ? 'Saving…' : 'Save schedule'}
              </button>
            </div>
          </div>
          <p style={{ margin: '0.875rem 0 0', fontSize: '0.8125rem', color: '#C8A97E' }}>
            {(() => {
              const n = Math.min(24, Math.max(0, parseInt(freqInput, 10) || 0))
              if (n === 0) return '⏸ Generation is paused — set above 0 to resume.'
              if (n === 1) return '▶ 1 post per day.'
              return `▶ ${n} posts per day — one roughly every ${(24 / n).toFixed(1)} hours.`
            })()}
          </p>
        </div>

        {/* Engine log */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700 }}>Engine Activity</h3>
          {runs.length === 0 ? (
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'rgba(255,255,255,0.35)' }}>No runs recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {runs.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.8125rem', padding: '0.625rem 0.875rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                  <span style={{ color: statusColor[r.status] ?? '#fff', fontWeight: 700, textTransform: 'capitalize', minWidth: '70px' }}>{r.status}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)' }}>{new Date(r.startedAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{r.mode}</span>
                  {r.keyword && <span style={{ color: '#C8A97E' }}>{r.keyword}</span>}
                  {r.error && <span style={{ color: '#fca5a5' }}>{r.error}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Performance */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700 }}>Performance</h3>
          <p style={{ margin: '0 0 1rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)' }}>
            Visit stats live in Google Analytics 4 + Looker Studio (both free). One-time setup:
            ① create a GA4 property at <a href="https://analytics.google.com" target="_blank" rel="noreferrer" style={{ color: '#C8A97E' }}>analytics.google.com</a> and paste its Measurement ID below — it goes live site-wide after the next build.
            ② build a report at <a href="https://lookerstudio.google.com" target="_blank" rel="noreferrer" style={{ color: '#C8A97E' }}>lookerstudio.google.com</a> (GA4 source; filter pages containing <code>/blog</code>; break down by source/medium to see search vs. own-site visits) → Share → Embed → paste the embed URL.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.625rem' }}>
            <input
              type="text"
              value={ga4Input}
              onChange={(e) => setGa4Input(e.target.value)}
              placeholder="GA4 Measurement ID (G-XXXXXXX)"
              style={{ flex: 1, minWidth: '200px', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.8125rem', outline: 'none' }}
            />
            <button onClick={() => saveSettings({ ga4MeasurementId: ga4Input.trim() })} disabled={settingsBusy || !ghToken} style={{ padding: '0.625rem 1rem', borderRadius: '0.5rem', background: 'rgba(200,169,126,0.15)', border: '1px solid rgba(200,169,126,0.35)', color: '#C8A97E', fontSize: '0.8125rem', fontWeight: 600, cursor: ghToken ? 'pointer' : 'not-allowed' }}>
              Save GA4 ID
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={embedInput}
              onChange={(e) => setEmbedInput(e.target.value)}
              placeholder="Looker Studio embed URL (https://lookerstudio.google.com/embed/…)"
              style={{ flex: 1, minWidth: '200px', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.8125rem', outline: 'none' }}
            />
            <button onClick={() => saveSettings({ analyticsEmbedUrl: embedInput.trim() })} disabled={settingsBusy || !ghToken} style={{ padding: '0.625rem 1rem', borderRadius: '0.5rem', background: 'rgba(200,169,126,0.15)', border: '1px solid rgba(200,169,126,0.35)', color: '#C8A97E', fontSize: '0.8125rem', fontWeight: 600, cursor: ghToken ? 'pointer' : 'not-allowed' }}>
              Save report
            </button>
          </div>
          {settings?.analyticsEmbedUrl && (
            <iframe
              src={settings.analyticsEmbedUrl}
              style={{ width: '100%', height: '420px', border: 'none', borderRadius: '0.75rem', marginTop: '1rem', background: '#fff' }}
              title="Blog performance report"
            />
          )}
        </div>

        {/* Search indexing */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700 }}>Search Indexing</h3>
          <p style={{ margin: '0 0 0.875rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)' }}>
            New posts typically take days to weeks to appear in Google. To speed it up, submit the sitemap once in <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" style={{ color: '#C8A97E' }}>Google Search Console</a> (free) — that is also the authoritative place to track impressions and clicks per post.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <a href="https://www.google.com/search?q=site%3Abmbrenovation.co.uk%2Fblog" target="_blank" rel="noreferrer" style={{ ...btn('rgba(96,165,250,0.1)', 'rgba(96,165,250,0.25)', '#93c5fd'), textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              🔎 Check all indexed posts on Google
            </a>
            <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" style={{ ...btn('rgba(255,255,255,0.06)', 'rgba(255,255,255,0.12)', '#fff'), textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
              Open Search Console
            </a>
          </div>
        </div>

        {/* Posts */}
        <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700 }}>Posts ({posts.length})</h3>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p style={{ fontSize: '1rem', margin: 0 }}>No posts yet. Run the engine or hit "Generate a Post Now".</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {posts.map((p) => (
              <div key={p.slug} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <h4 style={{ margin: '0 0 0.375rem', fontSize: '1rem', fontWeight: 700 }}>{p.title}</h4>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)' }}>
                      <span>🎯 {p.targetKeyword}</span>
                      <span>{new Date(p.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <span style={{ padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: p.status === 'published' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', color: statusColor[p.status], textTransform: 'capitalize' }}>
                    {p.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                  <button onClick={() => togglePreview(p.slug)} style={btn('rgba(255,255,255,0.06)', 'rgba(255,255,255,0.12)', '#fff')}>
                    {previewSlug === p.slug ? 'Hide' : 'Preview'}
                  </button>
                  {p.status === 'published' && (
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" style={{ ...btn('rgba(96,165,250,0.1)', 'rgba(96,165,250,0.25)', '#93c5fd'), textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                      View live →
                    </a>
                  )}
                  <a href={`https://www.google.com/search?q=site%3Abmbrenovation.co.uk%2Fblog%2F${p.slug}`} target="_blank" rel="noreferrer" title="Check if this exact post is indexed on Google" style={{ ...btn('rgba(255,255,255,0.06)', 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0.6)'), textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    🔎 Indexed?
                  </a>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                    {p.status === 'draft' ? (
                      <button onClick={() => setStatus(p.slug, 'published')} disabled={!ghToken || busy === p.slug} style={btn('rgba(34,197,94,0.12)', 'rgba(34,197,94,0.3)', '#4ade80')}>
                        {busy === p.slug ? '…' : '✓ Publish'}
                      </button>
                    ) : (
                      <button onClick={() => setStatus(p.slug, 'draft')} disabled={!ghToken || busy === p.slug} style={btn('rgba(245,158,11,0.1)', 'rgba(245,158,11,0.3)', '#fbbf24')}>
                        {busy === p.slug ? '…' : 'Unpublish'}
                      </button>
                    )}
                    <button onClick={() => deletePost(p.slug)} disabled={!ghToken || busy === p.slug} style={btn('rgba(239,68,68,0.08)', 'rgba(239,68,68,0.2)', '#f87171')}>
                      Delete
                    </button>
                  </div>
                </div>

                {previewSlug === p.slug && (
                  <div style={{ marginTop: '1rem', padding: '1.25rem', background: 'rgba(0,0,0,0.25)', borderRadius: '0.75rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, maxHeight: '400px', overflowY: 'auto' }}>
                    {!preview ? (
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)' }}>Loading…</p>
                    ) : preview.error ? (
                      <p style={{ margin: 0, color: '#fca5a5' }}>{preview.error}</p>
                    ) : (
                      <>
                        <p style={{ margin: '0 0 0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8125rem' }}>{preview.description}</p>
                        {(preview.blocks || []).map((b: any, i: number) => (
                          <div key={i} style={{ marginBottom: '0.625rem' }}>
                            {b.type === 'h2' && <strong style={{ color: '#C8A97E', fontSize: '1rem' }}>{b.text}</strong>}
                            {b.type === 'h3' && <strong style={{ color: 'rgba(255,255,255,0.9)' }}>{b.text}</strong>}
                            {b.type === 'p' && <p style={{ margin: 0 }}>{b.text}</p>}
                            {b.type === 'ul' && <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>{b.items.map((it: string, j: number) => <li key={j}>{it}</li>)}</ul>}
                            {b.type === 'cta' && <p style={{ margin: 0, color: '#4ade80' }}>📣 [CTA: {b.heading} → {b.href}]</p>}
                          </div>
                        ))}
                        {(preview.faq || []).length > 0 && (
                          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <strong style={{ color: '#C8A97E' }}>FAQ</strong>
                            {preview.faq.map((f: any, i: number) => (
                              <p key={i} style={{ margin: '0.5rem 0 0' }}><strong>Q:</strong> {f.q}<br /><strong>A:</strong> {f.a}</p>
                            ))}
                          </div>
                        )}
                        <p style={{ margin: '1rem 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                          Fact-check: {preview.factCheck?.claimsChecked ?? 0} claims checked, {preview.factCheck?.claimsRemoved ?? 0} removed/hedged · {preview.generatedBy}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
