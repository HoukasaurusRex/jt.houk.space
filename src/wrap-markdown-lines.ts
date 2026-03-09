import * as fs from 'fs'
import * as path from 'path'

const MAX_LINE_LENGTH = 150
const PUNCTUATION_WINDOW = 30
const CONTENT_DIR = path.resolve(import.meta.dirname, '../content')

function findMarkdownFiles(dir: string): string[] {
  const results: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory() && entry.name !== '.vuepress' && entry.name !== 'node_modules') {
      results.push(...findMarkdownFiles(full))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(full)
    }
  }
  return results
}

function wrapLine(line: string): string[] {
  if (line.length <= MAX_LINE_LENGTH) return [line]

  const results: string[] = []
  let remaining = line

  while (remaining.length > MAX_LINE_LENGTH) {
    const limit = MAX_LINE_LENGTH
    let breakAt = -1

    // Look for a punctuation-followed-by-space break within the window
    const windowStart = Math.max(0, limit - PUNCTUATION_WINDOW)
    let punctBreak = -1
    for (let i = limit; i >= windowStart; i--) {
      if (
        i < remaining.length &&
        remaining[i] === ' ' &&
        i > 0 &&
        /[.,;:?!)]/.test(remaining[i - 1])
      ) {
        punctBreak = i
        break
      }
    }

    if (punctBreak > 0) {
      breakAt = punctBreak
    } else {
      // Fall back to last space before the limit
      for (let i = limit; i >= 0; i--) {
        if (remaining[i] === ' ') {
          breakAt = i
          break
        }
      }
    }

    // No space found at all, look for first space after limit
    if (breakAt <= 0) {
      breakAt = remaining.indexOf(' ', limit)
      if (breakAt === -1) break // No break possible, keep as-is
    }

    results.push(remaining.slice(0, breakAt))
    remaining = remaining.slice(breakAt + 1)
  }

  if (remaining.length > 0) results.push(remaining)
  return results
}

function processFile(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const output: string[] = []
  let modified = false
  let inFrontmatter = false
  let frontmatterCount = 0
  let inCodeBlock = false

  for (const line of lines) {
    // Track frontmatter (between --- delimiters at start of file)
    if (line.trimEnd() === '---') {
      frontmatterCount++
      inFrontmatter = frontmatterCount === 1
      if (frontmatterCount === 2) inFrontmatter = false
      output.push(line)
      continue
    }

    // Track fenced code blocks
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      output.push(line)
      continue
    }

    // Skip: frontmatter, code blocks, tables, short lines
    if (
      inFrontmatter ||
      inCodeBlock ||
      line.trimStart().startsWith('|') ||
      line.length <= MAX_LINE_LENGTH
    ) {
      output.push(line)
      continue
    }

    // Skip lines that are just URLs or markdown images/links on their own
    const trimmed = line.trim()
    if (/^!\[.*\]\(.*\)$/.test(trimmed) || /^https?:\/\/\S+$/.test(trimmed)) {
      output.push(line)
      continue
    }

    const wrapped = wrapLine(line)
    if (wrapped.length > 1) modified = true
    output.push(...wrapped)
  }

  if (modified) {
    fs.writeFileSync(filePath, output.join('\n'), 'utf-8')
  }
  return modified
}

const files = findMarkdownFiles(CONTENT_DIR)
let count = 0
for (const file of files) {
  if (processFile(file)) {
    count++
    console.log(`Wrapped: ${path.relative(CONTENT_DIR, file)}`)
  }
}
if (count > 0) {
  console.log(`\n${count} file(s) modified`)
} else {
  console.log('All lines within limit')
}
