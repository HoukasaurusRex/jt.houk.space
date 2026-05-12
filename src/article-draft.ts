import * as fs from 'fs/promises'
import * as path from 'path'
import { loadTemplate } from './templates/loader.ts'
import { complete } from './ai-provider.ts'

const VALID_TONES = ['balanced', 'serious', 'wry', 'absurdist'] as const
const VALID_POVS = ['I', 'we', 'you'] as const
const VALID_ENTRIES = [
  'auto',
  'in-medias-res',
  'direct-challenge',
  'statistic',
  'honest-question',
  'epigraph-and-scene',
] as const

type Tone = (typeof VALID_TONES)[number]
type Pov = (typeof VALID_POVS)[number]
type Entry = (typeof VALID_ENTRIES)[number]

const parseArgs = (): {
  notesFile: string
  tone: Tone
  pov: Pov
  entry: Entry
  stdout: boolean
} => {
  const args = process.argv.slice(2)
  const notesFile = args.find((a) => !a.startsWith('--'))

  if (!notesFile) {
    console.error('Usage: yarn article-draft <notes-file> [--tone balanced|serious|wry|absurdist] [--pov I|we|you] [--entry auto|in-medias-res|direct-challenge|statistic|honest-question|epigraph-and-scene] [--stdout]')
    process.exit(1)
  }

  const flagValue = (flag: string): string | undefined => {
    const i = args.indexOf(`--${flag}`)
    return i !== -1 ? args[i + 1] : undefined
  }

  const toneArg = flagValue('tone') ?? 'balanced'
  const povArg = flagValue('pov') ?? 'I'
  const entryArg = flagValue('entry') ?? 'auto'

  if (!VALID_TONES.includes(toneArg as Tone)) {
    console.error(`Invalid --tone. Valid values: ${VALID_TONES.join(', ')}`)
    process.exit(1)
  }
  if (!VALID_POVS.includes(povArg as Pov)) {
    console.error(`Invalid --pov. Valid values: ${VALID_POVS.join(', ')}`)
    process.exit(1)
  }
  if (!VALID_ENTRIES.includes(entryArg as Entry)) {
    console.error(`Invalid --entry. Valid values: ${VALID_ENTRIES.join(', ')}`)
    process.exit(1)
  }

  return {
    notesFile,
    tone: toneArg as Tone,
    pov: povArg as Pov,
    entry: entryArg as Entry,
    stdout: args.includes('--stdout'),
  }
}

const draftArticle = async () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is required. Set it in .env.defaults or environment.')
    process.exit(1)
  }

  const { notesFile, tone, pov, entry, stdout } = parseArgs()

  const notesPath = path.resolve(process.cwd(), notesFile)
  const notes = await fs.readFile(notesPath, 'utf-8')

  console.error(`Drafting article from ${path.basename(notesPath)}...`)
  console.error(`  tone=${tone}  pov=${pov}  entry=${entry}  model=claude-opus-4-6`)

  const system = await loadTemplate('article-draft.system.md', {
    tone,
    pov,
    entry_point: entry,
  })

  const userMessage = await loadTemplate('article-draft.user.md', { notes })

  const draft = await complete({
    system,
    messages: [{ role: 'user', content: userMessage }],
    maxTokens: 16000,
    timeout: 180_000,
    model: 'claude-opus-4-6',
    thinking: { type: 'enabled', budget_tokens: 10000 },
  })

  if (stdout) {
    process.stdout.write(draft + '\n')
    return
  }

  const basename = path.basename(notesPath).replace(/\.draft\.md$/, '').replace(/\.md$/, '')
  const outputPath = path.join(path.dirname(notesPath), `${basename}-draft-output.md`)
  await fs.writeFile(outputPath, draft + '\n', 'utf-8')
  console.error(`\nOutput written to ${outputPath}`)
}

draftArticle()
