import * as fs from 'fs'
import * as path from 'path'
import Anthropic from '@anthropic-ai/sdk'

const JOURNAL_DIR = path.join(process.cwd(), 'content', 'journal')

const KNOWN_TAGS = [
  'sales-history',
  'incident-response',
  'code-review',
  'team',
  'investigations',
  'search-indexing',
  'reporting',
  'docker',
  'localization',
  'sprint-retro',
  'onboarding',
  'documentation',
  'testing',
]

const SYSTEM_PROMPT = `You are a writing assistant helping format a software engineer's daily work journal.
The journal belongs to JT Houk, a Senior Software Developer on the Selling Experience
team at a retail commerce platform in Montreal. Manager: Samy K.

Teammates: Dania, Zhijie, Vikki (internal team), Juliana, Daniela, Sylvie, Kapil (cross-team).
Systems: GraphQL service, search indexing service, Kafka, Elasticsearch, BigQuery, Datadog,
Docker, Transifex, retail POS.

TASK: Convert the bullet-point draft into polished prose.

RULES:
- Preserve all ## section headers exactly as they appear (e.g. ## Projects, ## Incidents,
  ## Team, ## Code Reviews, ## Investigations, ## Journal, ## Self Evaluation).
- Convert bullet points within each section into flowing prose paragraphs.
- Use first person. Use "we" for team efforts, "I" for personal work.
- Keep technical specifics: PR numbers, service names, teammate names, tool names.
- Write 1-3 paragraphs per section. Professional but conversational tone.
- Do NOT add information that is not in the bullets. Expand and connect, do not invent.
- Do NOT use em dashes or double hyphens. Restructure sentences to avoid them.
- Write naturally without worrying about line length.
- Do NOT include the frontmatter. Output ONLY the markdown body starting with the first ## header.

ALSO: Generate metadata for the frontmatter.
On the VERY FIRST LINE of your response, output:
TAGS: tag1, tag2
SUMMARY: One sentence summary

Pick tags from this list when possible: ${KNOWN_TAGS.join(', ')}.
If none fit, suggest a new lowercase hyphenated tag.
The summary should be a concise description of the day's main activities (under 100 chars).
Then output a blank line, followed by the formatted markdown body.`

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
  const client = new Anthropic()

  const contextBlock = contextEntries.length
    ? `PREVIOUS ENTRIES (for context on ongoing projects and writing style):\n\n${contextEntries.map((e) => `---\n${e}\n---`).join('\n\n')}\n\n`
    : ''

  const response = await client.messages.create(
    {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `${contextBlock}DRAFT TO FORMAT:\n\n${draftBody}`,
        },
      ],
    },
    { timeout: 30_000 },
  )

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  const tagsMatch = text.match(/^TAGS:\s*(.+)$/m)
  const summaryMatch = text.match(/^SUMMARY:\s*(.+)$/m)

  const summaryLineEnd = text.indexOf('\n', text.indexOf('SUMMARY:'))
  const body = summaryLineEnd > -1 ? text.slice(summaryLineEnd).trim() + '\n' : ''

  const tags = tagsMatch
    ? tagsMatch[1].split(',').map((t) => t.trim())
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
