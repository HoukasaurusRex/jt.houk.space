import * as fs from 'fs/promises'
import * as path from 'path'

const TEMPLATES_DIR = import.meta.dirname

export const loadTemplate = async (
  filename: string,
  vars: Record<string, string> = {},
): Promise<string> => {
  const filePath = path.join(TEMPLATES_DIR, filename)
  let content = (await fs.readFile(filePath, 'utf-8')).trim()

  // Resolve includes (recursive, so templates can include templates)
  const includePattern = /\{\{include:([^}]+)\}\}/g
  let match
  while ((match = includePattern.exec(content)) !== null) {
    const included = await loadTemplate(match[1].trim(), vars)
    content = content.slice(0, match.index) + included + content.slice(match.index + match[0].length)
    includePattern.lastIndex = match.index + included.length
  }

  // Resolve variables
  content = content.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? '')

  return content
}
