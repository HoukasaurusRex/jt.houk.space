import * as fs from 'fs'
import * as path from 'path'

const TEMPLATES_DIR = path.join(import.meta.dirname, 'templates')

export const loadTemplate = (
  filename: string,
  vars: Record<string, string> = {},
): string => {
  const filePath = path.join(TEMPLATES_DIR, filename)
  let content = fs.readFileSync(filePath, 'utf-8').trim()

  // Resolve includes (recursive, so templates can include templates)
  content = content.replace(/\{\{include:([^}]+)\}\}/g, (_, file: string) =>
    loadTemplate(file.trim(), vars),
  )

  // Resolve variables
  content = content.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? '')

  return content
}
