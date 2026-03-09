import { Handler } from '@netlify/functions'

const KEILA_API_URL = 'https://mail.houk.space/api/v1/contacts'
const KEILA_API_KEY = process.env.KEILA_API_KEY ?? ''

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const params = new URLSearchParams(event.body ?? '')
  const email = params.get('email')
  if (!email) {
    return { statusCode: 400, body: 'Email required' }
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
          data: { source },
        },
      }),
    })

    if (res.status === 201 || res.status === 200) {
      return { statusCode: 200, body: 'OK' }
    }

    // Contact may already exist — try updating their data
    if (res.status === 422) {
      const updateRes = await fetch(`${KEILA_API_URL}/${encodeURIComponent(email)}/data?id_type=email`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${KEILA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: { source } }),
      })

      if (updateRes.ok) {
        return { statusCode: 200, body: 'OK' }
      }

      const updateText = await updateRes.text()
      console.error('Keila update responded with', updateRes.status, updateText.slice(0, 500))
      return { statusCode: 502, body: 'Subscription failed' }
    }

    const responseText = await res.text()
    console.error('Keila responded with', res.status, responseText.slice(0, 500))
    return { statusCode: 502, body: 'Subscription failed' }
  } catch (err) {
    console.error('Subscribe function error:', err)
    return { statusCode: 500, body: 'Internal error' }
  }
}
