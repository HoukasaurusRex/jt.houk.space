import { parseArgs } from 'node:util'
import * as fs from 'fs/promises'
import * as path from 'path'
import { loadTemplate } from './templates/loader.ts'
import { complete } from './ai-provider.ts'
import { ensureJournalEntry } from './entries.ts'
import { searchJira } from './jira.ts'
import { searchSlack } from './slack.ts'

const JOURNAL_DIR = path.join(process.cwd(), 'content', 'journal')

const { values } = parseArgs({
  options: {
    start: { type: 'string', default: '2025-04-01' },
    end: { type: 'string', default: '2026-03-31' },
    questions: { type: 'string', default: 'self-eval.questions.md' },
    'self-eval': { type: 'string', default: '2026-02-17.md' },
  },
})

const periodStart = values.start!
const periodEnd = values.end!
const questionsFile = values.questions!
const selfEvalFile = values['self-eval']!

const readJournals = async (start: string, end: string): Promise<string> => {
  const allFiles = await fs.readdir(JOURNAL_DIR)
  const files = allFiles
    .filter((f) => f.endsWith('.md') && !f.endsWith('.draft.md'))
    .filter((f) => {
      const date = f.replace('.md', '')
      return date >= start && date <= end
    })
    .sort()

  const contents = await Promise.all(
    files.map((f) => fs.readFile(path.join(JOURNAL_DIR, f), 'utf-8')),
  )
  return contents.join('\n---\n')
}

const readSelfEval = async (filename: string): Promise<string> => {
  const raw = await fs.readFile(path.join(JOURNAL_DIR, filename), 'utf-8')
  const selfEvalStart = raw.indexOf('## Self Evaluation')
  if (selfEvalStart === -1) {
    console.error(`Could not find ## Self Evaluation section in ${filename}`)
    process.exit(1)
  }
  return raw.slice(selfEvalStart)
}

const searchIncidents = async (start: string, end: string): Promise<string> => {
  const jql = `project = IR AND created >= "${start}" AND created <= "${end}" AND (summary ~ "Sales History" OR summary ~ "consumer lag" OR summary ~ "cash movement" OR summary ~ "reporting" OR summary ~ "swiper") ORDER BY created DESC`
  const incidents = await searchJira(jql)
  if (incidents.length === 0) return ''
  return incidents
    .map((i) => `- **${i.key}**: ${i.fields.summary} [${i.fields.status.name}]`)
    .join('\n')
}

const selfEval = async () => {
  console.log(`Gathering journal entries from ${periodStart} to ${periodEnd}...\n`)

  const [journals, existingSelfEval, incidents, slackIncidents, slackTeam] =
    await Promise.all([
      readJournals(periodStart, periodEnd),
      readSelfEval(selfEvalFile),
      searchIncidents(periodStart, periodEnd),
      searchSlack(
        `from:@me in:#inc after:${periodStart} before:${periodEnd}`,
      ),
      searchSlack(
        `from:@me in:#selling-experience after:${periodStart} before:${periodEnd}`,
      ),
    ])
  const slackContext = [slackIncidents, slackTeam].filter(Boolean).join('\n')
  const questions = await loadTemplate(questionsFile)

  const entryCount = journals.split('\n---\n').filter((s) => s.trim()).length
  console.log(`Found ${entryCount} journal entries`)
  console.log(`Loaded existing self-evaluation from ${selfEvalFile}`)
  if (incidents) {
    const incidentCount = incidents.split('\n').length
    console.log(`Found ${incidentCount} Jira incidents`)
  }
  if (slackContext) {
    const slackCount = slackContext.split('\n').length
    console.log(`Found ${slackCount} Slack messages`)
  }
  console.log(`Using questions template: ${questionsFile}\n`)

  const system = await loadTemplate('self-eval.system.md', {
    periodStart,
    periodEnd,
  })

  const userMessage = await loadTemplate('self-eval.user.md', {
    questions,
    selfEval: existingSelfEval,
    journals,
    incidents: incidents || 'No Jira incidents found. Use journal entries for incident context.',
    slackContext: slackContext || 'No Slack messages found.',
  })

  console.log('Generating self-evaluation answers with Claude Sonnet...\n')

  const text = await complete({
    system,
    messages: [{ role: 'user', content: userMessage }],
    maxTokens: 8192,
    timeout: 120_000,
  })

  const planningMatch = text.match(/<planning>([\s\S]*?)<\/planning>/)
  if (planningMatch) {
    console.error('--- Evidence Planning ---')
    console.error(planningMatch[1].trim())
    console.error('---\n')
  }
  const cleaned = text.replace(/<planning>[\s\S]*?<\/planning>\s*/g, '').trim()
  console.log(cleaned)

  const journalPath = await ensureJournalEntry()
  const existing = await fs.readFile(journalPath, 'utf-8')
  const section = `## Self Evaluation\n\nReview period: ${periodStart} to ${periodEnd}\n\n${cleaned}\n`
  const selfEvalHeadingRegex = /## Self Evaluation\n[\s\S]*$/
  const updated = selfEvalHeadingRegex.test(existing)
    ? existing.replace(selfEvalHeadingRegex, section)
    : existing.trimEnd() + '\n\n' + section
  await fs.writeFile(journalPath, updated, 'utf-8')
  console.log(`\nWritten to ${journalPath}`)
}

selfEval().catch((err) => {
  console.error(err)
  process.exit(1)
})
