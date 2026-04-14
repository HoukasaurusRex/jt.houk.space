import { parseArgs } from 'node:util'
import * as fs from 'fs/promises'
import * as path from 'path'
import { loadTemplate } from './templates/loader.ts'
import { complete } from './ai-provider.ts'
import { ensureJournalEntry } from './entries.ts'
import { searchSlack } from './slack.ts'

const JOURNAL_DIR = path.join(process.cwd(), 'content', 'journal')

const { values } = parseArgs({
  options: {
    name: { type: 'string' },
    start: { type: 'string', default: '2025-09-18' },
    end: { type: 'string', default: '2026-04-14' },
    'slack-chat': { type: 'string' },
  },
})

if (!values.name) {
  console.error('Usage: peer-feedback --name <FirstName> [--start YYYY-MM-DD] [--end YYYY-MM-DD] [--slack-chat <file>]')
  process.exit(1)
}

const name = values.name
const periodStart = values.start!
const periodEnd = values.end!
const slackChatFile = values['slack-chat']

const readFilteredJournals = async (start: string, end: string, filterName: string): Promise<string> => {
  const allFiles = await fs.readdir(JOURNAL_DIR)
  const files = allFiles
    .filter((f) => f.endsWith('.md') && !f.endsWith('.draft.md'))
    .filter((f) => {
      const date = f.replace('.md', '')
      return date >= start && date <= end
    })
    .sort()

  const nameRegex = new RegExp(filterName, 'i')
  const matchingContents: string[] = []

  for (const f of files) {
    const content = await fs.readFile(path.join(JOURNAL_DIR, f), 'utf-8')
    if (nameRegex.test(content)) {
      matchingContents.push(content)
    }
  }

  return matchingContents.join('\n---\n')
}

const readSlackChat = async (filePath: string): Promise<string> => {
  try {
    return await fs.readFile(filePath, 'utf-8')
  } catch {
    console.warn(`Warning: could not read slack-chat file at ${filePath}, continuing without it`)
    return ''
  }
}

const peerFeedback = async () => {
  console.log(`Gathering evidence for ${name} from ${periodStart} to ${periodEnd}...\n`)

  const [journals, slackFromMe, slackFromThem, slackChat] = await Promise.all([
    readFilteredJournals(periodStart, periodEnd, name),
    searchSlack(`"${name}" from:@me after:${periodStart} before:${periodEnd}`, 30),
    searchSlack(`from:${name} after:${periodStart} before:${periodEnd}`, 30),
    slackChatFile ? readSlackChat(slackChatFile) : Promise.resolve(''),
  ])

  const slackSearch = [slackFromMe, slackFromThem].filter(Boolean).join('\n')

  const journalMatchCount = journals ? journals.split('\n---\n').filter((s) => s.trim()).length : 0
  console.log(`Found ${journalMatchCount} journal entries mentioning ${name}`)

  if (slackSearch) {
    const slackCount = slackSearch.split('\n').filter((s) => s.trim()).length
    console.log(`Found ${slackCount} Slack messages`)
  }

  if (slackChatFile && slackChat) {
    console.log(`Loaded Slack chat from ${slackChatFile}`)
  }

  console.log(`\nGenerating peer feedback for ${name} with Claude...\n`)

  const system = await loadTemplate('peer-feedback.system.md', {
    name,
    periodStart,
    periodEnd,
  })

  const userMessage = await loadTemplate('peer-feedback.user.md', {
    name,
    periodStart,
    periodEnd,
    journals: journals || '',
    slackSearch: slackSearch || '',
    slackChat: slackChat || '',
  })

  const text = await complete({
    system,
    messages: [{ role: 'user', content: userMessage }],
    maxTokens: 4096,
    timeout: 90_000,
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
  const section = `## Peer Feedback - ${name}\n\n${cleaned}\n`
  const sectionRegex = new RegExp(`## Peer Feedback - ${name}\\n[\\s\\S]*?(?=\\n## |$)`)
  const updated = sectionRegex.test(existing)
    ? existing.replace(sectionRegex, section.trimEnd())
    : existing.trimEnd() + '\n\n' + section
  await fs.writeFile(journalPath, updated, 'utf-8')
  console.log(`\nWritten to ${journalPath}`)
}

peerFeedback().catch((err) => {
  console.error(err)
  process.exit(1)
})
