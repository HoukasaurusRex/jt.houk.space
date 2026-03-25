import * as fs from 'fs/promises'
import * as path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export interface EntryResult {
  dir: string
  fileName: string
  content: string
}

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const buildJournalEntry = (isoDate: string, longDate: string): EntryResult => ({
  dir: path.join(CONTENT_DIR, 'journal'),
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

export const buildArticleEntry = (
  isoDate: string,
  title: string,
  scaffold?: { tags: string[]; summary: string; body: string } | null,
): EntryResult => {
  const tags = scaffold?.tags?.length
    ? scaffold.tags.map((t) => `  - "${t}"`).join('\n')
    : '  - ""'
  const summary = scaffold?.summary || ''
  const body = scaffold?.body || ''

  return {
    dir: path.join(CONTENT_DIR, 'articles'),
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

export const buildProjectEntry = (isoDate: string, title: string): EntryResult => ({
  dir: path.join(CONTENT_DIR, 'projects'),
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

/**
 * Ensures today's journal draft exists. Creates it if missing.
 * Returns the absolute path to the draft file.
 */
export const ensureJournalEntry = async (): Promise<string> => {
  const today = new Date()
  const isoDate = today.toISOString()
  const longDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(today)

  const { dir, fileName, content } = buildJournalEntry(isoDate, longDate)
  const filePath = path.join(dir, fileName)

  try {
    await fs.access(filePath)
  } catch {
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(filePath, content, 'utf-8')
    console.log(`Created journal entry: ${filePath}`)
  }

  return filePath
}
