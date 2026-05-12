import * as fs from 'fs/promises'
import * as path from 'path'
import { loadTemplate } from './templates/loader.ts'
import { complete } from './ai-provider.ts'

const VALID_TONES = ['balanced', 'serious', 'wry', 'absurdist'] as const
type Tone = (typeof VALID_TONES)[number]

const parseArgs = (): { draftFile: string; tone: Tone } => {
  const args = process.argv.slice(2)
  const draftFile = args.find((a) => !a.startsWith('--'))

  if (!draftFile) {
    console.error('Usage: yarn article-review <draft-file> [--tone balanced|serious|wry|absurdist]')
    process.exit(1)
  }

  const toneIndex = args.indexOf('--tone')
  const toneArg = toneIndex !== -1 ? args[toneIndex + 1] : 'balanced'

  if (!VALID_TONES.includes(toneArg as Tone)) {
    console.error(`Invalid --tone. Valid values: ${VALID_TONES.join(', ')}`)
    process.exit(1)
  }

  return { draftFile, tone: toneArg as Tone }
}

const reviewArticle = async () => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is required. Set it in .env.defaults or environment.')
    process.exit(1)
  }

  const { draftFile, tone } = parseArgs()

  const draftPath = path.resolve(process.cwd(), draftFile)
  const draft = await fs.readFile(draftPath, 'utf-8')

  console.error(`Reviewing ${path.basename(draftPath)} (tone=${tone})...\n`)

  const system = await loadTemplate('article-review.system.md', { tone })

  const review = await complete({
    system,
    messages: [{ role: 'user', content: draft }],
    maxTokens: 2048,
    timeout: 60_000,
  })

  process.stdout.write(review + '\n')
}

reviewArticle()
