import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { loadTemplate } from './templates/loader.ts'
import { complete } from './ai-provider.ts'

const SPRINT_DAYS = 14
const JIRA_PROJECT = 'LRX'

interface PR {
  number: number
  title: string
  url: string
  closedAt: string
  repository: { name: string; nameWithOwner: string }
}

interface JiraIssue {
  key: string
  fields: {
    summary: string
    status: { name: string }
    issuetype: { name: string }
    priority: { name: string }
    resolutiondate: string | null
  }
}

const run = (cmd: string): string =>
  execSync(cmd, { encoding: 'utf-8' }).trim()

const searchMergedPRs = (since: string): PR[] => {
  try {
    const raw = run(
      `gh search prs --author=@me --merged --merged-at=">${since}" --limit 100 --json repository,title,number,url,closedAt`,
    )
    return JSON.parse(raw)
  } catch {
    console.warn('Could not search GitHub PRs.')
    return []
  }
}

const groupPRsByRepo = (prs: PR[]): Map<string, PR[]> => {
  const grouped = new Map<string, PR[]>()
  for (const pr of prs) {
    const key = pr.repository.nameWithOwner
    const list = grouped.get(key) || []
    list.push(pr)
    grouped.set(key, list)
  }
  return grouped
}

const searchJiraTickets = async (since: string): Promise<JiraIssue[]> => {
  const { ATLASSIAN_DOMAIN, ATLASSIAN_EMAIL, ATLASSIAN_API_TOKEN } = process.env
  if (!ATLASSIAN_DOMAIN || !ATLASSIAN_EMAIL || !ATLASSIAN_API_TOKEN) {
    console.warn('Jira env vars not set, skipping Jira tickets.')
    return []
  }

  const jql = `project = ${JIRA_PROJECT} AND assignee = currentUser() AND status changed to ("Done", "Closed", "Resolved") AFTER "${since}" ORDER BY resolved DESC`
  const url = `https://${ATLASSIAN_DOMAIN}/rest/api/3/search/jql`
  const auth = `Basic ${Buffer.from(`${ATLASSIAN_EMAIL}:${ATLASSIAN_API_TOKEN}`).toString('base64')}`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: auth,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jql,
        fields: ['key', 'summary', 'status', 'issuetype', 'priority', 'resolutiondate'],
        maxResults: 50,
      }),
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

const getCommits = (since: string): string => {
  try {
    return run(`git log --since="${since}" --oneline --no-merges`)
  } catch {
    return ''
  }
}

const ensureJournalEntry = (): string => {
  const today = new Date().toISOString().split('T')[0]
  const journalPath = path.join(
    process.cwd(),
    'content',
    'journal',
    `${today}.draft.md`,
  )

  if (!fs.existsSync(journalPath)) {
    console.log('Creating today\'s journal entry...')
    run('yarn new-entry journal')
  }

  return journalPath
}

const isOrgRepo = (nameWithOwner: string): boolean =>
  !nameWithOwner.startsWith('HoukasaurusRex/')

const sprintReview = async () => {
  const sinceDate = new Date()
  sinceDate.setDate(sinceDate.getDate() - SPRINT_DAYS)
  const since = sinceDate.toISOString().split('T')[0]

  console.log(`Gathering work from ${since} to today...\n`)

  // GitHub PRs across all orgs and personal repos
  const allPRs = searchMergedPRs(since)
  const grouped = groupPRsByRepo(allPRs)

  for (const [repo, prs] of grouped) {
    console.log(`  ${repo}: ${prs.length} merged PR(s)`)
  }

  // Jira tickets
  const jiraTickets = await searchJiraTickets(since)
  if (jiraTickets.length > 0) {
    console.log(`  Jira (${JIRA_PROJECT}): ${jiraTickets.length} completed ticket(s)`)
  }

  // Local commits
  const commits = getCommits(since)

  if (grouped.size === 0 && jiraTickets.length === 0 && !commits) {
    console.log('No work found in the last two weeks.')
    return
  }

  // Build PR summary, org repos first
  const orgRepos = [...grouped.entries()].filter(([key]) => isOrgRepo(key))
  const personalRepos = [...grouped.entries()].filter(([key]) => !isOrgRepo(key))
  const sortedEntries = [...orgRepos, ...personalRepos]

  const prSummary = sortedEntries
    .map(
      ([repo, prs]) =>
        `### ${repo}\n${prs
          .map(
            (pr) =>
              `- **${pr.title}** ([#${pr.number}](${pr.url})) merged ${pr.closedAt.split('T')[0]}`,
          )
          .join('\n')}`,
    )
    .join('\n\n')

  const jiraSummary = jiraTickets.length > 0
    ? `### Jira (${JIRA_PROJECT})\n${jiraTickets
        .map(
          (t) =>
            `- **${t.key}**: ${t.fields.summary} [${t.fields.status.name}] (${t.fields.issuetype.name}, ${t.fields.priority.name})`,
        )
        .join('\n')}`
    : ''

  const system = loadTemplate('sprint-review.system.md')
  const userMessage = loadTemplate('sprint-review.user.md', {
    since,
    jiraSummary: jiraSummary || 'No Jira tickets found.',
    prSummary: prSummary || 'No PRs found.',
    commits: commits || 'No commits found.',
  })

  console.log('\nGenerating summary with Claude Sonnet...\n')

  const text = await complete({
    system,
    messages: [{ role: 'user', content: userMessage }],
  })

  console.log(text)

  // Write to today's journal entry (replace existing Sprint Review section or append)
  const journalPath = ensureJournalEntry()
  const existing = fs.readFileSync(journalPath, 'utf-8')
  const section = `## Sprint Review\n\n${text}\n`
  const sprintHeadingRegex = /## Sprint Review\n[\s\S]*$/
  const updated = sprintHeadingRegex.test(existing)
    ? existing.replace(sprintHeadingRegex, section)
    : existing.trimEnd() + '\n\n' + section
  fs.writeFileSync(journalPath, updated, 'utf-8')
  console.log(`\nWritten to ${journalPath}`)
}

sprintReview().catch((err) => {
  console.error(err)
  process.exit(1)
})
