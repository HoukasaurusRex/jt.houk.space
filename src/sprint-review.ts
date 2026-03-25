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

const searchJiraTickets = async (since: string): Promise<JiraIssue[]> =>
  searchJira(
    `project = ${JIRA_PROJECT} AND assignee = currentUser() AND status changed to ("Done", "Closed", "Resolved") AFTER "${since}" ORDER BY resolved DESC`,
  )

const getCommits = (since: string): string => {
  try {
    return run(`git log --since="${since}" --oneline --no-merges`)
  } catch {
    return ''
  }
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

  const system = await loadTemplate('sprint-review.system.md')
  const userMessage = await loadTemplate('sprint-review.user.md', {
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
  const journalPath = await ensureJournalEntry()
  const existing = await fs.readFile(journalPath, 'utf-8')
  const section = `## Sprint Review\n\n${text}\n`
  const sprintHeadingRegex = /## Sprint Review\n[\s\S]*$/
  const updated = sprintHeadingRegex.test(existing)
    ? existing.replace(sprintHeadingRegex, section)
    : existing.trimEnd() + '\n\n' + section
  await fs.writeFile(journalPath, updated, 'utf-8')
  console.log(`\nWritten to ${journalPath}`)
}

sprintReview().catch((err) => {
  console.error(err)
  process.exit(1)
})
