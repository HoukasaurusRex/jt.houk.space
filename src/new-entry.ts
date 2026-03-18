import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'
import { loadTemplate } from './templates/loader.ts'
import { ARTICLE_TAGS } from './tags.ts'
import { complete } from './ai-provider.ts'

const TYPES = ['journal', 'article', 'project'] as const
type EntryType = (typeof TYPES)[number]

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

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
    const userMessage = loadTemplate('new-entry.user.md', {
      title,
      knownTags: ARTICLE_TAGS.join(', '),
    })

    const text = await complete({
      messages: [{ role: 'user', content: userMessage }],
      maxTokens: 1024,
      timeout: 10_000,
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

const buildJournalEntry = (isoDate: string, longDate: string) => ({
  dir: path.join(process.cwd(), 'content', 'journal'),
  fileName: `${isoDate.split('T')[0]}.draft.md`,
  content: `---
title: "${longDate}"
created_at: "${isoDate}"
updated_at: "${isoDate}"
tags:
  - ""
summary: ""
author: "JT Houk"
location: "Montreal"
image: ""
---

`,
})

const buildArticleEntry = (
  isoDate: string,
  title: string,
  scaffold?: { tags: string[]; summary: string; body: string } | null,
) => {
  const tags = scaffold?.tags?.length
    ? scaffold.tags.map((t) => `  - "${t}"`).join('\n')
    : '  - ""'
  const summary = scaffold?.summary || ''
  const body = scaffold?.body || ''

  return {
    dir: path.join(process.cwd(), 'content', 'articles'),
    fileName: `${slugify(title)}.draft.md`,
    content: `---
title: "${title}"
created_at: "${isoDate}"
updated_at: "${isoDate}"
tags:
${tags}
summary: "${summary}"
author: "JT Houk"
location: "Montreal"
---

${body}`,
  }
}

const buildProjectEntry = (isoDate: string, title: string) => ({
  dir: path.join(process.cwd(), 'content', 'projects'),
  fileName: `${slugify(title)}.md`,
  content: `---
title: "${title}"
created_at: "${isoDate}"
updated_at: "${isoDate}"
category: ""
language: ""
link: ""
technologies:
  databases: []
  languages: []
  frameworks: []
---

`,
})

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

  // Resolve output path early to avoid wasting an API call
  const baseDir =
    type === 'article'
      ? path.join(process.cwd(), 'content', 'articles')
      : type === 'project'
        ? path.join(process.cwd(), 'content', 'projects')
        : path.join(process.cwd(), 'content', 'journal')

  const baseFileName =
    type === 'journal'
      ? `${isoDate.split('T')[0]}.draft.md`
      : type === 'article'
        ? `${slugify(title)}.draft.md`
        : `${slugify(title)}.md`

  const filePath = path.join(baseDir, baseFileName)

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true })
  }

  if (fs.existsSync(filePath)) {
    console.warn(`Entry already exists: ${filePath}`)
    return
  }

  // Scaffold article content with AI if available
  let scaffold: { tags: string[]; summary: string; body: string } | null = null
  if (type === 'article') {
    console.log('Scaffolding article with AI...')
    scaffold = await scaffoldArticle(title)
    if (scaffold) {
      console.log('AI scaffolding applied.')
    }
  }

  const { content } =
    type === 'article'
      ? buildArticleEntry(isoDate, title, scaffold)
      : type === 'project'
        ? buildProjectEntry(isoDate, title)
        : buildJournalEntry(isoDate, longDate)

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`Created new ${type} entry: ${filePath}`)

  exec(`open "${filePath}"`)
}

createEntry()
