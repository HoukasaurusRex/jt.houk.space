import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'

const createNewJournalEntry = () => {
  const today = new Date()
  const isoDate = today.toISOString()
  const dateSlug = isoDate.split('T')[0]
  const longDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  }).format(today)

  const fileName = `${dateSlug}.md`
  const dirPath = path.join(process.cwd(), 'content', 'journal')
  const filePath = path.join(dirPath, fileName)

  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.warn(`Journal entry for ${dateSlug} already exists.`)
    return
  }

  // Create file with basic frontmatter
  const content = `---
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

`

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`Created new journal entry: ${filePath}`)

  exec(`open "${filePath}"`)
}

createNewJournalEntry()