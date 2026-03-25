import * as fs from 'fs/promises'
import * as path from 'path'
import { exec } from 'child_process'
import { loadTemplate } from './templates/loader.ts'
import { ARTICLE_TAGS } from './tags.ts'
import { complete } from './ai-provider.ts'
import {
  buildJournalEntry,
  buildArticleEntry,
  buildProjectEntry,
} from './entries.ts'

const TYPES = ['journal', 'article', 'project'] as const
type EntryType = (typeof TYPES)[number]

const usage = () => {
  console.log(`Usage:
  yarn new-entry                          # new journal entry (today)
  yarn new-entry journal                  # new journal entry (today)
  yarn new-entry article "My Title"       # new draft article
  yarn new-entry project "My Title"       # new project page`)
  process.exit(1)
}

const scaffoldArticle = async (
  title: string,
): Promise<{ tags: string[]; summary: string; body: string } | null> => {
  if (!process.env.ANTHROPIC_API_KEY) return null

  try {
    const userMessage = await loadTemplate('new-entry.user.md', {
      title,
      knownTags: ARTICLE_TAGS.join(', '),
    })

    const text = await complete({
      messages: [{ role: 'user', content: userMessage }],
      maxTokens: 1024,
      timeout: 30_000,
    })

    const tagsMatch = text.match(/^TAGS:\s*(.+)$/m)
    const summaryMatch = text.match(/^SUMMARY:\s*(.+)$/m)
    const sectionsMatch = text.match(/SECTIONS:\n([\s\S]+)$/)

    const tags = tagsMatch
      ? tagsMatch[1].split(',').map((t: string) => t.trim())
      : []
    const summary = summaryMatch ? summaryMatch[1].trim() : ''
    const body = sectionsMatch ? sectionsMatch[1].trim() + '\n' : ''

    return { tags, summary, body }
  } catch (err) {
    console.warn(
      `AI scaffolding skipped: ${err instanceof Error ? err.message : 'unknown error'}`,
    )
    return null
  }
}

const createEntry = async () => {
  const args = process.argv.slice(2)
  const type: EntryType = TYPES.includes(args[0] as EntryType)
    ? (args[0] as EntryType)
    : 'journal'

  const titleArgs = TYPES.includes(args[0] as EntryType) ? args.slice(1) : args
  const title = titleArgs.join(' ')

  if ((type === 'article' || type === 'project') && !title) {
    console.error(`Error: ${type} requires a title.`)
    usage()
  }

  const today = new Date()
  const isoDate = today.toISOString()
  const longDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(today)

  // Scaffold article content with AI if available
  let scaffold: { tags: string[]; summary: string; body: string } | null = null
  if (type === 'article') {
    console.log('Scaffolding article with AI...')
    scaffold = await scaffoldArticle(title)
    if (scaffold) {
      console.log('AI scaffolding applied.')
    }
  }

  const { dir, fileName, content } =
    type === 'article'
      ? buildArticleEntry(isoDate, title, scaffold)
      : type === 'project'
        ? buildProjectEntry(isoDate, title)
        : buildJournalEntry(isoDate, longDate)

  const filePath = path.join(dir, fileName)

  await fs.mkdir(dir, { recursive: true })

  try {
    await fs.access(filePath)
    console.warn(`Entry already exists: ${filePath}`)
    return
  } catch {
    // File doesn't exist, proceed with creation
  }

  await fs.writeFile(filePath, content, 'utf-8')
  console.log(`Created new ${type} entry: ${filePath}`)

  exec(`open "${filePath}"`)
}

createEntry()
