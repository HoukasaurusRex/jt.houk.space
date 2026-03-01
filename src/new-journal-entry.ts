import * as fs from 'fs'
import * as path from 'path'
import dayjs from 'dayjs'
import { exec } from 'child_process'

const createNewJournalEntry = () => {
  const today = dayjs()
  const fileName = `${today.format('YYYY-MM-DD')}.md`
  const dirPath = path.join(process.cwd(), 'content', 'dev-log')
  const filePath = path.join(dirPath, fileName)

  // Ensure directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.warn(`Journal entry for ${today.format('YYYY-MM-DD')} already exists.`)
    return
  }

  // Create file with basic frontmatter
  const content = `---
title: "${today.format('dddd MMMM D, YYYY')}"
category: "Software Development"
created_at: "${today.toISOString()}"
updated_at: "${today.toISOString()}"
date: "${today.format('YYYY-MM-DD')}"
tags:
  - ""
status: "draft"
summary: ""
author: "JT Houk"
location: "Montreal"
images: []
---

`

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`Created new journal entry: ${filePath}`)

  exec(`open "${filePath}"`)
}

createNewJournalEntry()