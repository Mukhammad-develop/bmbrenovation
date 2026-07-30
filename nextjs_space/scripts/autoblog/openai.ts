// Minimal OpenAI chat-completions client (plain fetch, no SDK dependency).
// Uses JSON mode: every prompt must ask for a JSON object back.

export interface ChatJsonOptions {
  apiKey: string
  model: string
  system: string
  user: string
  temperature?: number
  maxTokens?: number
}

const ENDPOINT = 'https://api.openai.com/v1/chat/completions'
const TIMEOUT_MS = 120_000
const MAX_RETRIES = 3

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function extractJson(text: string): unknown {
  // Tolerate models wrapping JSON in markdown fences despite JSON mode.
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
  return JSON.parse(cleaned)
}

// Newer model families reject `max_tokens` (want `max_completion_tokens`)
// and/or custom `temperature`. Adapt the payload based on the error message.
function adaptPayload(payload: Record<string, unknown>, errMsg: string): Record<string, unknown> | null {
  const next = { ...payload }
  let changed = false
  if (/max_tokens|max_completion_tokens/i.test(errMsg) && 'max_tokens' in next) {
    next.max_completion_tokens = next.max_tokens
    delete next.max_tokens
    changed = true
  }
  if (/temperature/i.test(errMsg) && 'temperature' in next) {
    delete next.temperature
    changed = true
  }
  if (/response_format/i.test(errMsg) && 'response_format' in next) {
    delete next.response_format
    changed = true
  }
  return changed ? next : null
}

async function postChat(apiKey: string, payload: Record<string, unknown>): Promise<{ ok: true; data: any } | { ok: false; status: number; body: string }> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(payload),
    })
    if (!res.ok) return { ok: false, status: res.status, body: await res.text().catch(() => '') }
    return { ok: true, data: await res.json() }
  } finally {
    clearTimeout(timer)
  }
}

export async function chatJson<T>(opts: ChatJsonOptions): Promise<T> {
  const { apiKey, model, system, user, temperature = 0.7, maxTokens = 4000 } = opts

  let payload: Record<string, unknown> = {
    model,
    temperature,
    max_tokens: maxTokens,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  }

  let lastError: Error | null = null
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await postChat(apiKey, payload)

      if (!result.ok) {
        // Adapt payload shape for model families with different param rules.
        const adapted = adaptPayload(payload, result.body)
        if (adapted && result.status === 400) {
          payload = adapted
          attempt-- // adaptation retries don't count against the budget
          continue
        }
        // Rate limits and 5xx are worth retrying; other 4xx (auth etc.) are not.
        const retryable = result.status === 429 || result.status >= 500
        throw Object.assign(new Error(`OpenAI HTTP ${result.status}: ${result.body.slice(0, 300)}`), { retryable })
      }

      const content = result.data?.choices?.[0]?.message?.content
      if (typeof content !== 'string' || content.length === 0) {
        throw new Error('OpenAI returned an empty completion')
      }
      return extractJson(content) as T
    } catch (err: any) {
      lastError = err
      const retryable = err?.retryable !== false
      if (!retryable || attempt === MAX_RETRIES) break
      await sleep(1000 * attempt)
    }
  }
  throw lastError ?? new Error('OpenAI request failed')
}
