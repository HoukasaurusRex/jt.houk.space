import { Handler } from '@netlify/functions'

const KEILA_FORM_URL = 'https://mail.houk.space/forms/nfrm_dQ7Pd7Y2'

// hCaptcha staging site key (10000000-ffff-ffff-ffff-000000000001) accepts any response token
const HCAPTCHA_TEST_TOKEN = '10000000-aaaa-bbbb-cccc-000000000001'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const params = new URLSearchParams(event.body ?? '')
  const email = params.get('email')
  if (!email) {
    return { statusCode: 400, body: 'Email required' }
  }

  try {
    // Step 1: GET form page to obtain CSRF token and session cookie
    const getRes = await fetch(KEILA_FORM_URL)
    const html = await getRes.text()

    const csrfMatch =
      html.match(/name="csrf-token"\s+content="([^"]+)"/) ??
      html.match(/content="([^"]+)"\s+name="csrf-token"/)
    if (!csrfMatch) {
      console.error('CSRF token not found in form HTML')
      return { statusCode: 500, body: 'Could not obtain CSRF token' }
    }
    const csrfToken = csrfMatch[1]

    // Parse _keila_session cookie from Set-Cookie header
    // getSetCookie() is available in Node 18.14+; fall back to splitting set-cookie string
    const rawHeaders = getRes.headers as Headers & { getSetCookie?: () => string[] }
    const setCookies: string[] =
      typeof rawHeaders.getSetCookie === 'function'
        ? rawHeaders.getSetCookie()
        : (getRes.headers.get('set-cookie') ?? '').split(/,(?=\s*\w+=)/)
    const sessionEntry = setCookies.find((c) => c.includes('_keila_session'))
    const sessionCookie = sessionEntry ? sessionEntry.split(';')[0].trim() : ''

    // Step 2: POST subscription with CSRF token and session cookie
    const body = new URLSearchParams({
      _csrf_token: csrfToken,
      'contact[email]': email,
      'h-captcha-response': HCAPTCHA_TEST_TOKEN,
      'h[url]': '', // honeypot field
    })

    const postRes = await fetch(KEILA_FORM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: sessionCookie,
      },
      body: body.toString(),
      redirect: 'manual', // Keila returns 302 on success
    })

    if (postRes.status === 302 || postRes.status === 200) {
      return { statusCode: 200, body: 'OK' }
    }

    const responseText = await postRes.text()
    console.error('Keila responded with', postRes.status, responseText.slice(0, 500))
    return { statusCode: 502, body: 'Subscription failed' }
  } catch (err) {
    console.error('Subscribe function error:', err)
    return { statusCode: 500, body: 'Internal error' }
  }
}
