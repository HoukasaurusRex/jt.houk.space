export interface JiraIssue {
  key: string
  fields: {
    summary: string
    status: { name: string }
    issuetype: { name: string }
    priority: { name: string }
    resolutiondate: string | null
    description?: unknown
  }
}

const getAuth = (): { domain: string; auth: string } | null => {
  const { ATLASSIAN_DOMAIN, ATLASSIAN_EMAIL, ATLASSIAN_API_TOKEN } = process.env
  if (!ATLASSIAN_DOMAIN || !ATLASSIAN_EMAIL || !ATLASSIAN_API_TOKEN) return null
  return {
    domain: ATLASSIAN_DOMAIN,
    auth: `Basic ${Buffer.from(`${ATLASSIAN_EMAIL}:${ATLASSIAN_API_TOKEN}`).toString('base64')}`,
  }
}

export const searchJira = async (
  jql: string,
  fields: string[] = ['key', 'summary', 'status', 'issuetype', 'priority', 'resolutiondate'],
  maxResults = 50,
): Promise<JiraIssue[]> => {
  const creds = getAuth()
  if (!creds) {
    console.warn('Jira env vars not set, skipping Jira search.')
    return []
  }

  const url = `https://${creds.domain}/rest/api/3/search/jql`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: creds.auth,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jql, fields, maxResults }),
    })
    if (!res.ok) {
      console.warn(`Jira API returned ${res.status}: ${await res.text()}`)
      return []
    }
    const data = await res.json()
    return (data as { issues: JiraIssue[] }).issues || []
  } catch (err) {
    console.warn(`Jira fetch failed: ${err instanceof Error ? err.message : 'unknown'}`)
    return []
  }
}
