import { Handler } from '@netlify/functions'

const KEILA_API_URL = 'https://mail.houk.space/api/v1/contacts'
const KEILA_API_KEY = process.env.KEILA_API_KEY ?? ''

const ALLOWED_ORIGINS = [
  'https://jt.houk.space',
  'https://rulesaswrittenshow.com',
]

const corsHeaders = (origin: string) => {
  const allowed = ALLOWED_ORIGINS.includes(origin) || origin.startsWith('http://localhost')
  return {
    'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

const mergeSources = (existing: Record<string, unknown>, newSource: string): string[] => {
  const prev = Array.isArray(existing?.sources)
    ? existing.sources
    : typeof existing?.source === 'string' && existing.source
      ? [existing.source]
      : []
  return [...new Set([...prev, newSource])]
}

export const handler: Handler = async (event) => {
  const origin = event.headers?.origin ?? ''
  const headers = corsHeaders(origin)

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' }
  }

  const params = new URLSearchParams(event.body ?? '')
  const email = params.get('email')
  if (!email) {
    return { statusCode: 400, headers, body: 'Email required' }
  }

  const source = params.get('source') ?? ''

  try {
    const res = await fetch(KEILA_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KEILA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          email,
          data: { sources: [source] },
        },
      }),
    })

    if (res.status === 201 || res.status === 200) {
      return { statusCode: 200, headers, body: 'OK' }
    }

    const responseText = await res.text()

    // Check if this is a duplicate contact (Keila returns 400 or 422 with "email" error)
    const isDuplicate = (res.status === 400 || res.status === 422) && responseText.includes('email')
    if (isDuplicate) {
      // GET existing contact, merge sources, then PATCH
      try {
        const getRes = await fetch(
          `${KEILA_API_URL}/${encodeURIComponent(email)}?id_type=email`,
          { headers: { Authorization: `Bearer ${KEILA_API_KEY}` } },
        )
        const contact = getRes.ok ? await getRes.json() : null
        const existingData = contact?.data?.data ?? {}
        const merged = mergeSources(existingData, source)

        await fetch(`${KEILA_API_URL}/${encodeURIComponent(email)}/data?id_type=email`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${KEILA_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: { sources: merged } }),
        })
      } catch { /* best-effort merge */ }

      return { statusCode: 200, headers, body: JSON.stringify({ already_subscribed: true }) }
    }

    // Client errors (validation failures) pass through as 400
    // Server/upstream errors pass through as 502
    const statusCode = res.status >= 400 && res.status < 500 ? 400 : 502
    console.error('Keila responded with', res.status, responseText.slice(0, 500))
    return { statusCode, headers, body: JSON.stringify({ error: 'Subscription failed', status: res.status }) }
  } catch (err) {
    console.error('Subscribe function error:', err)
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) }
  }
}
