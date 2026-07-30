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

export async function chatJson<T>(opts: ChatJsonOptions): Promise<T> {
  const { apiKey, model, system, user, temperature = 0.7, maxTokens = 4000 } = opts

  let lastError: Error | null = null
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature,
          max_tokens: maxTokens,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        }),
      })

      if (!res.ok) {
        const body = await res.text().catch(() => '')
        // Rate limits and 5xx are worth retrying; 4xx (auth etc.) are not.
        const retryable = res.status === 429 || res.status >= 500
        throw Object.assign(new Error(`OpenAI HTTP ${res.status}: ${body.slice(0, 300)}`), { retryable })
      }

      const data = (await res.json()) as any
      const content = data?.choices?.[0]?.message?.content
      if (typeof content !== 'string' || content.length === 0) {
        throw new Error('OpenAI returned an empty completion')
      }
      return extractJson(content) as T
    } catch (err: any) {
      lastError = err
      const retryable = err?.retryable !== false
      if (!retryable || attempt === MAX_RETRIES) break
      await sleep(1000 * attempt)
    } finally {
      clearTimeout(timer)
    }
  }
  throw lastError ?? new Error('OpenAI request failed')
}
