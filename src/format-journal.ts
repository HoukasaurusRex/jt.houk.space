import * as fs from 'fs'
import * as path from 'path'
import { loadTemplate } from './templates/loader.ts'
import { JOURNAL_TAGS } from './tags.ts'
import { complete } from './ai-provider.ts'

const JOURNAL_DIR = path.join(process.cwd(), 'content', 'journal')

const findDrafts = (): string[] =>
  fs.readdirSync(JOURNAL_DIR)
    .filter((f) => f.endsWith('.draft.md'))
    .sort()
    .map((f) => path.join(JOURNAL_DIR, f))

const loadContext = (draftDate: string): string[] => {
  const finished = fs.readdirSync(JOURNAL_DIR)
    .filter((f) => f.endsWith('.md') && !f.endsWith('.draft.md'))
    .sort()
    .reverse()

  const contextFiles = finished
    .filter((f) => f.replace('.md', '') < draftDate)
    .slice(0, 2)

  return contextFiles.map((f) =>
    fs.readFileSync(path.join(JOURNAL_DIR, f), 'utf-8'),
  )
}

const parseFrontmatter = (raw: string): { frontmatter: string; body: string } => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { frontmatter: '', body: raw }
  return { frontmatter: match[1], body: match[2].trim() }
}

const patchFrontmatter = (
  rawFrontmatter: string,
  tags: string[],
  summary: string,
): string => {
  const tagYaml = tags.map((t) => `  - "${t}"`).join('\n')
  let patched = rawFrontmatter.replace(
    /tags:\n(?:\s+-\s*"[^"]*"\n?)*/,
    `tags:\n${tagYaml}\n`,
  )
  patched = patched.replace(
    /summary:\s*"[^"]*"/,
    `summary: "${summary.replace(/"/g, '\\"')}"`,
  )
  return patched
}

const formatDraft = async (
  draftBody: string,
  contextEntries: string[],
): Promise<{ tags: string[]; summary: string; body: string } | null> => {
  const contextBlock = contextEntries.length
    ? `PREVIOUS ENTRIES (for context on ongoing projects and writing style):\n\n${contextEntries.map((e) => `---\n${e}\n---`).join('\n\n')}\n\n`
    : ''

  const system = await loadTemplate('format-journal.system.md', {
    knownTags: JOURNAL_TAGS.join(', '),
  })

  const text = await complete({
    system,
    messages: [
      {
        role: 'user',
        content: `${contextBlock}DRAFT TO FORMAT:\n\n${draftBody}`,
      },
    ],
    maxTokens: 2048,
    timeout: 60_000,
  })

  const tagsMatch = text.match(/^TAGS:\s*(.+)$/m)
  const summaryMatch = text.match(/^SUMMARY:\s*(.+)$/m)

  const summaryLineEnd = text.indexOf('\n', text.indexOf('SUMMARY:'))
  const body = summaryLineEnd > -1 ? text.slice(summaryLineEnd).trim() + '\n' : ''

  const tags = tagsMatch
    ? tagsMatch[1].split(',').map((t: string) => t.trim())
    : []
  const summary = summaryMatch ? summaryMatch[1].trim() : ''

  return { tags, summary, body }
}

const processDraft = async (draftPath: string) => {
  const raw = fs.readFileSync(draftPath, 'utf-8')
  const { frontmatter, body } = parseFrontmatter(raw)
  const draftDate = path.basename(draftPath).replace('.draft.md', '')

  if (!frontmatter) {
    console.warn(`  Skipped ${path.basename(draftPath)} (malformed frontmatter)`)
    return
  }

  const contextEntries = loadContext(draftDate)

  console.log(`Formatting ${path.basename(draftPath)}...`)

  try {
    const result = await formatDraft(body, contextEntries)

    if (!result || !result.body) {
      console.warn('  Skipped (empty API response)')
      return
    }

    const newFrontmatter = patchFrontmatter(frontmatter, result.tags, result.summary)
    const fm = newFrontmatter.endsWith('\n') ? newFrontmatter : newFrontmatter + '\n'
    const output = `---\n${fm}---\n\n${result.body}`

    fs.writeFileSync(draftPath, output, 'utf-8')

    const finalPath = draftPath.replace('.draft.md', '.md')
    fs.renameSync(draftPath, finalPath)
    console.log(`  -> ${path.basename(finalPath)}`)
  } catch (err) {
    console.warn(`  Skipped (${err instanceof Error ? err.message : 'unknown error'})`)
  }
}

const formatJournals = async () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is required. Set it in .env.defaults or environment.')
    process.exit(1)
  }

  const drafts = findDrafts()
  if (drafts.length === 0) {
    console.log('No draft journal entries found.')
    return
  }

  console.log(`Found ${drafts.length} draft(s) to format.\n`)

  for (const draft of drafts) {
    await processDraft(draft)
  }

  console.log('\nDone. Review changes with: git diff content/journal/')
}

formatJournals()
