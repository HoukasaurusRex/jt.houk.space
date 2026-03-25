import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const SLACK_API_BASE = 'https://slack.com/api'
const CREDENTIALS_PATH = join(homedir(), '.slack', 'credentials.json')
const REQUEST_TIMEOUT_MS = 30_000

interface SlackMessage {
  text: string
  channel: { name: string }
  ts: string
}

interface SearchResponse {
  ok: boolean
  error?: string
  messages?: {
    matches: SlackMessage[]
    total: number
  }
}

const resolveToken = (): string | null => {
  if (process.env.SLACK_USER_TOKEN) return process.env.SLACK_USER_TOKEN

  if (!existsSync(CREDENTIALS_PATH)) return null

  try {
    const creds: Record<string, { token: string; team_domain?: string }> =
      JSON.parse(readFileSync(CREDENTIALS_PATH, 'utf-8'))
    const teamIds = Object.keys(creds)
    if (teamIds.length === 0) return null

    if (teamIds.length === 1) return creds[teamIds[0]].token

    const teamId = process.env.SLACK_TEAM_ID
    if (teamId && creds[teamId]) return creds[teamId].token

    console.warn(
      `Multiple Slack teams found. Set SLACK_TEAM_ID to one of: ${teamIds.join(', ')}`,
    )
    return null
  } catch {
    return null
  }
}

const tsToDate = (ts: string): string =>
  new Date(Number(ts) * 1000).toISOString().split('T')[0]

export const searchSlack = async (
  query: string,
  count = 20,
): Promise<string> => {
  const token = resolveToken()
  if (!token) {
    console.warn('Slack token not set, skipping Slack context.')
    return ''
  }

  const url = new URL(`${SLACK_API_BASE}/search.messages`)
  url.searchParams.set('query', query)
  url.searchParams.set('count', String(count))
  url.searchParams.set('sort', 'timestamp')
  url.searchParams.set('sort_dir', 'desc')

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (res.status === 429) {
      console.warn('Slack rate limited, skipping.')
      return ''
    }

    const data = (await res.json()) as SearchResponse
    if (!data.ok) {
      console.warn(`Slack search failed: ${data.error}`)
      return ''
    }

    const matches = data.messages?.matches ?? []
    if (matches.length === 0) return ''

    return matches
      .map(
        (m) =>
          `[#${m.channel.name}] (${tsToDate(m.ts)}): ${m.text.replace(/\n/g, ' ').slice(0, 300)}`,
      )
      .join('\n')
  } catch (err) {
    console.warn(
      `Slack fetch failed: ${err instanceof Error ? err.message : 'unknown'}`,
    )
    return ''
  }
}
