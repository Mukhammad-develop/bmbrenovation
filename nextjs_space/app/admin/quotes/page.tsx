'use client'

import { useState, useEffect, useCallback } from 'react'

export const dynamic = 'force-static'

const PASS = 'bmb2026'
const LS_KEY = 'bmb_quotes'
const SESSION_KEY = 'bmb_admin_auth'

interface Quote {
  id: string
  timestamp: string
  name: string
  phone: string
  email: string
  project: string
  postcode: string
  message: string
  contact_time: string
  page: string
  status: 'new' | 'contacted' | 'completed'
}

function getQuotes(): Quote[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]')
  } catch { return [] }
}

function saveQuotes(qs: Quote[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(qs))
}

function toCSV(quotes: Quote[]): string {
  const headers = ['Date', 'Name', 'Phone', 'Email', 'Project', 'Postcode', 'Message', 'Contact Time', 'Page', 'Status']
  const rows = quotes.map(q => [
    new Date(q.timestamp).toLocaleString('en-GB'),
    q.name, q.phone, q.email, q.project, q.postcode,
    q.message.replace(/,/g, ';'), q.contact_time, q.page, q.status
  ].map(v => `"${v}"`).join(','))
  return [headers.join(','), ...rows].join('\n')
}

export default function AdminQuotesPage() {
  const [authed, setAuthed] = useState(false)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'completed'>('all')
  const [mounted, setMounted] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Quote>>({})

  const startEdit = (q: Quote) => {
    setEditingId(q.id)
    setEditForm(q)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const saveEdit = () => {
    if (!editingId) return
    const updated = quotes.map(q => q.id === editingId ? { ...q, ...editForm } as Quote : q)
    setQuotes(updated)
    saveQuotes(updated)
    setEditingId(null)
  }

  useEffect(() => {
    setMounted(true)
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      setAuthed(true)
    }
  }, [])

  useEffect(() => {
    if (authed) setQuotes(getQuotes())
  }, [authed])

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

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthed(false)
    setCode('')
  }

  const updateStatus = useCallback((id: string, status: Quote['status']) => {
    const updated = quotes.map(q => q.id === id ? { ...q, status } : q)
    setQuotes(updated)
    saveQuotes(updated)
  }, [quotes])

  const deleteQuote = useCallback((id: string) => {
    if (!confirm('Delete this quote?')) return
    const updated = quotes.filter(q => q.id !== id)
    setQuotes(updated)
    saveQuotes(updated)
  }, [quotes])

  const clearAll = () => {
    if (!confirm('Delete ALL quotes? This cannot be undone.')) return
    localStorage.removeItem(LS_KEY)
    setQuotes([])
  }

  const exportCSV = () => {
    const blob = new Blob([toCSV(quotes)], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `bmb-quotes-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  const filtered = quotes
    .filter(q => filter === 'all' || q.status === filter)
    .filter(q => !search || [q.name, q.phone, q.email, q.project, q.postcode, q.message].join(' ').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const counts = {
    all: quotes.length,
    new: quotes.filter(q => q.status === 'new').length,
    contacted: quotes.filter(q => q.status === 'contacted').length,
    completed: quotes.filter(q => q.status === 'completed').length,
  }

  const today = quotes.filter(q => new Date(q.timestamp).toDateString() === new Date().toDateString()).length

  if (!mounted) return null

  // ── PASSWORD GATE ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        fontFamily: "'Inter', 'Segoe UI', sans-serif", padding: '1rem',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.5rem',
          padding: '3rem 2.5rem', width: '100%', maxWidth: '420px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '1rem',
              background: 'linear-gradient(135deg, #C8A97E, #a07850)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem', fontSize: '1.75rem',
            }}>🔐</div>
            <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.4rem', letterSpacing: '-0.03em' }}>BMB Renovation</h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', margin: 0 }}>Admin — Quotes Dashboard</p>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Access Code</label>
            <input
              type="password"
              value={code}
              onChange={e => { setCode(e.target.value); setCodeError(false) }}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="Enter access code"
              autoFocus
              style={{
                width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem',
                background: 'rgba(255,255,255,0.07)', border: `1.5px solid ${codeError ? '#f87171' : 'rgba(255,255,255,0.12)'}`,
                color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box',
              }}
            />
            {codeError && <p style={{ color: '#f87171', fontSize: '0.8125rem', margin: '0.5rem 0 0' }}>Incorrect access code. Please try again.</p>}
          </div>

          <button
            onClick={login}
            style={{
              width: '100%', padding: '0.875rem', borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #C8A97E, #a07850)', border: 'none',
              color: '#fff', fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            Enter Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const statusColor: Record<string, string> = {
    new: '#3b82f6', contacted: '#f59e0b', completed: '#22c55e',
  }
  const statusBg: Record<string, string> = {
    new: 'rgba(59,130,246,0.12)', contacted: 'rgba(245,158,11,0.12)', completed: 'rgba(34,197,94,0.12)',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', fontFamily: "'Inter','Segoe UI',sans-serif", color: '#fff' }}>

      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <span style={{ fontWeight: 900, fontSize: '1.125rem', letterSpacing: '-0.02em', color: '#C8A97E' }}>BMBRENOVATION</span>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginLeft: '1rem' }}>Quote Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a href="https://bmbrenovation.co.uk" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8125rem', textDecoration: 'none' }}>← Back to site</a>
          <button onClick={logout} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.8125rem' }}>Sign out</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Notice */}
        <div style={{ background: 'rgba(200,169,126,0.1)', border: '1px solid rgba(200,169,126,0.3)', borderRadius: '0.75rem', padding: '0.875rem 1.25rem', marginBottom: '2rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
          📧 All quote submissions are also emailed to <strong style={{ color: '#C8A97E' }}>contact@bmbrenovation.co.uk</strong>. This dashboard shows quotes submitted from this browser.
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Quotes', value: counts.all, icon: '📋', color: '#C8A97E' },
            { label: 'Today', value: today, icon: '📅', color: '#60a5fa' },
            { label: 'New', value: counts.new, icon: '🔵', color: '#3b82f6' },
            { label: 'Contacted', value: counts.contacted, icon: '🟡', color: '#f59e0b' },
            { label: 'Completed', value: counts.completed, icon: '🟢', color: '#22c55e' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by name, phone, postcode…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: '1', minWidth: '200px', padding: '0.75rem 1rem', borderRadius: '0.625rem',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', fontSize: '0.875rem', outline: 'none',
            }}
          />
          {(['all','new','contacted','completed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.625rem 1rem', borderRadius: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
              background: filter === f ? '#C8A97E' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${filter === f ? '#C8A97E' : 'rgba(255,255,255,0.1)'}`,
              color: filter === f ? '#fff' : 'rgba(255,255,255,0.6)',
              textTransform: 'capitalize',
            }}>
              {f} {f === 'all' ? `(${counts.all})` : f === 'new' ? `(${counts.new})` : f === 'contacted' ? `(${counts.contacted})` : `(${counts.completed})`}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <button onClick={exportCSV} style={{ padding: '0.625rem 1rem', borderRadius: '0.5rem', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
              ↓ Export CSV
            </button>
            <button onClick={clearAll} style={{ padding: '0.625rem 1rem', borderRadius: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}>
              🗑 Clear All
            </button>
          </div>
        </div>

        {/* Quotes */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p style={{ fontSize: '1rem', margin: 0 }}>{quotes.length === 0 ? 'No quotes yet. Submissions will appear here after forms are submitted on this device.' : 'No quotes match your filter.'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map(q => (
              <div key={q.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.5rem', position: 'relative' }}>
                {editingId === q.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#C8A97E' }}>Edit Quote</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <input style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="Name" />
                      <input style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} value={editForm.phone || ''} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} placeholder="Phone" />
                      <input style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} placeholder="Email" />
                      <input style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} value={editForm.project || ''} onChange={e => setEditForm({ ...editForm, project: e.target.value })} placeholder="Project" />
                      <input style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} value={editForm.postcode || ''} onChange={e => setEditForm({ ...editForm, postcode: e.target.value })} placeholder="Postcode" />
                      <input style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} value={editForm.contact_time || ''} onChange={e => setEditForm({ ...editForm, contact_time: e.target.value })} placeholder="Contact Time" />
                    </div>
                    <textarea style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', minHeight: '80px' }} value={editForm.message || ''} onChange={e => setEditForm({ ...editForm, message: e.target.value })} placeholder="Message" />
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={cancelEdit} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}>Cancel</button>
                      <button onClick={saveEdit} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#22c55e', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.0625rem', fontWeight: 700 }}>{q.name}</h3>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                          <a href={`tel:${q.phone}`} style={{ color: '#C8A97E', fontSize: '0.875rem', textDecoration: 'none' }}>📞 {q.phone}</a>
                          {q.email && q.email !== '(not provided)' && <a href={`mailto:${q.email}`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', textDecoration: 'none' }}>✉ {q.email}</a>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: statusBg[q.status], color: statusColor[q.status], textTransform: 'capitalize' }}>{q.status}</span>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{new Date(q.timestamp).toLocaleDateString('en-GB', { day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit' })}</span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '0.625rem', marginBottom: '1rem', fontSize: '0.8125rem' }}>
                      {[
                        { label: 'Project', value: q.project },
                        { label: 'Postcode', value: q.postcode },
                        { label: 'Contact Time', value: q.contact_time },
                        { label: 'Page', value: q.page },
                      ].map(item => (
                        <div key={item.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem', padding: '0.5rem 0.75rem' }}>
                          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>{item.label}</div>
                          <div style={{ color: 'rgba(255,255,255,0.8)' }}>{item.value || '—'}</div>
                        </div>
                      ))}
                    </div>

                    {q.message && q.message !== '(no message)' && (
                      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                        "{q.message}"
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {(['new','contacted','completed'] as const).map(s => (
                        <button key={s} onClick={() => updateStatus(q.id, s)} style={{
                          padding: '0.4rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
                          background: q.status === s ? statusBg[s] : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${q.status === s ? statusColor[s] : 'rgba(255,255,255,0.08)'}`,
                          color: q.status === s ? statusColor[s] : 'rgba(255,255,255,0.4)',
                        }}>
                          {s === 'new' ? '🔵' : s === 'contacted' ? '🟡' : '🟢'} {s}
                        </button>
                      ))}
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => startEdit(q)} style={{ padding: '0.4rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>Edit</button>
                        <button onClick={() => deleteQuote(q.id)} style={{ padding: '0.4rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}>Delete</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
