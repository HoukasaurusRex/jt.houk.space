import { execSync } from 'child_process'
import * as fs from 'fs/promises'
import { loadTemplate } from './templates/loader.ts'
import { complete } from './ai-provider.ts'
import { ensureJournalEntry } from './entries.ts'
import { searchJira, type JiraIssue } from './jira.ts'

const SPRINT_DAYS = 14
const JIRA_PROJECT = 'LRX'

interface PR {
  number: number
  title: string
  url: string
  closedAt: string
  state: string
  repository: { name: string; nameWithOwner: string }
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

const searchOpenPRs = (since: string): PR[] => {
  try {
    const raw = run(
      `gh search prs --author=@me --state=open --created=">${since}" --limit 50 --json repository,title,number,url,closedAt`,
    )
    return (JSON.parse(raw) as PR[]).map((pr) => ({ ...pr, state: 'open' }))
  } catch {
    return []
  }
}

const searchJiraTickets = async (since: string): Promise<JiraIssue[]> =>
  searchJira(
    `project = ${JIRA_PROJECT} AND assignee = currentUser() AND updated >= "${since}" ORDER BY updated DESC`,
  )

const getCommits = (since: string): string => {
  try {
    return run(`git log --since="${since}" --oneline --no-merges`)
  } catch {
    return ''
  }
}

const sprintRetro = async () => {
  const sinceDate = new Date()
  sinceDate.setDate(sinceDate.getDate() - SPRINT_DAYS)
  const since = sinceDate.toISOString().split('T')[0]

  console.log(`Gathering sprint data from ${since} to today...\n`)

  const mergedPRs = searchMergedPRs(since)
  const openPRs = searchOpenPRs(since)
  const jiraTickets = await searchJiraTickets(since)
  const commits = getCommits(since)

  console.log(`  Merged PRs: ${mergedPRs.length}`)
  console.log(`  Open PRs: ${openPRs.length}`)
  console.log(`  Jira tickets updated: ${jiraTickets.length}`)

  if (mergedPRs.length === 0 && jiraTickets.length === 0 && !commits) {
    console.log('No sprint data found.')
    return
  }

  const formatPR = (pr: PR) =>
    `- **${pr.title}** ([#${pr.number}](${pr.url})) ${pr.closedAt ? `closed ${pr.closedAt.split('T')[0]}` : '(open)'}`

  const mergedSummary = mergedPRs.length > 0
    ? `### Merged\n${mergedPRs.map(formatPR).join('\n')}`
    : ''

  const openSummary = openPRs.length > 0
    ? `### Still Open\n${openPRs.map(formatPR).join('\n')}`
    : ''

  const prSummary = [mergedSummary, openSummary].filter(Boolean).join('\n\n')

  const jiraSummary = jiraTickets.length > 0
    ? jiraTickets
        .map(
          (t: JiraIssue) =>
            `- **${t.key}**: ${t.fields.summary} [${t.fields.status.name}] (${t.fields.issuetype.name}, ${t.fields.priority.name})`,
        )
        .join('\n')
    : 'No Jira tickets found.'

  const system = await loadTemplate('sprint-retro.system.md')
  const userMessage = await loadTemplate('sprint-retro.user.md', {
    since,
    jiraSummary,
    prSummary: prSummary || 'No PRs found.',
    commits: commits || 'No commits found.',
  })

  console.log('\nGenerating retrospective with Claude Sonnet...\n')

  const text = await complete({
    system,
    messages: [{ role: 'user', content: userMessage }],
  })

  console.log(text)

  const journalPath = await ensureJournalEntry()
  const existing = await fs.readFile(journalPath, 'utf-8')
  const section = `## Sprint Retro\n\n${text}\n`
  const retroHeadingRegex = /## Sprint Retro\n[\s\S]*$/
  const updated = retroHeadingRegex.test(existing)
    ? existing.replace(retroHeadingRegex, section)
    : existing.trimEnd() + '\n\n' + section
  await fs.writeFile(journalPath, updated, 'utf-8')
  console.log(`\nWritten to ${journalPath}`)
}

sprintRetro().catch((err) => {
  console.error(err)
  process.exit(1)
})
