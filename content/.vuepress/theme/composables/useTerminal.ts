import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { Router } from 'vue-router'

export interface OutputSegment {
  text: string
  style: 'error' | 'success' | 'info' | 'string'
}

export interface CommandResult {
  segments: OutputSegment[]
}

type CommandHandler = (args: string[]) => CommandResult

interface JournalUnlock {
  unlock: () => void
}

const DIR_MAP: Record<string, string> = {
  articles: '/articles/',
  about: '/about/',
  journal: '/journal/',
}

function stripQuotes(s: string): string {
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    return s.slice(1, -1)
  }
  return s
}

export function useTerminal(router: Router, journalUnlock: JournalUnlock) {
  const inputText = ref('')
  const outputResult: Ref<CommandResult | null> = ref(null)
  const isEditing = ref(false)
  const echoLaserActive = ref(false)
  const echoText = ref('')

  let dismissTimer: ReturnType<typeof setTimeout> | undefined

  const commands = new Map<string, CommandHandler>()

  commands.set('help', () => ({
    segments: [{ text: 'Available commands: help, ls, cd, echo', style: 'info' }],
  }))

  commands.set('ls', () => ({
    segments: [{ text: 'articles  about  journal', style: 'info' }],
  }))

  commands.set('cd', (args) => {
    const raw = args[0]
    if (!raw) {
      return { segments: [{ text: 'usage: cd <directory>', style: 'info' }] }
    }
    const dir = stripQuotes(raw).toLowerCase()
    const path = DIR_MAP[dir]
    if (!path) {
      return {
        segments: [
          { text: 'cd: no such directory: ', style: 'info' },
          { text: `"${dir}"`, style: 'error' },
        ],
      }
    }
    if (dir === 'journal') {
      journalUnlock.unlock()
    }
    router.push(path)
    return { segments: [{ text: `Navigating to ${path}`, style: 'success' }] }
  })

  commands.set('echo', (args) => {
    const text = args.map(stripQuotes).join(' ')
    echoText.value = text
    echoLaserActive.value = true
    setTimeout(() => {
      echoLaserActive.value = false
      echoText.value = ''
    }, 2200)
    return { segments: [] }
  })

  function execute() {
    const trimmed = inputText.value.trim()
    if (!trimmed) return

    const parts = trimmed.split(/\s+/)
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)

    const handler = commands.get(cmd)
    if (handler) {
      outputResult.value = handler(args)
    } else {
      outputResult.value = {
        segments: [
          { text: 'unknown command ', style: 'info' },
          { text: `"${cmd}"`, style: 'error' },
        ],
      }
    }

    inputText.value = ''

    if (dismissTimer) clearTimeout(dismissTimer)
    dismissTimer = setTimeout(() => {
      outputResult.value = null
    }, 5000)
  }

  function resetToDefault() {
    isEditing.value = false
    inputText.value = ''
    outputResult.value = null
    if (dismissTimer) clearTimeout(dismissTimer)
  }

  function parseCommand(raw: string): OutputSegment[] {
    if (!raw) return []

    const firstSpace = raw.indexOf(' ')
    const cmd = firstSpace === -1 ? raw : raw.slice(0, firstSpace)
    const rest = firstSpace === -1 ? '' : raw.slice(firstSpace)

    const segments: OutputSegment[] = []

    const cmdStyle = commands.has(cmd.toLowerCase()) ? 'success' : 'error'
    segments.push({ text: cmd, style: cmdStyle })

    if (rest) {
      const quotedPattern = /^(\s+)(['"])(.*?)\2(.*)$/
      const match = rest.match(quotedPattern)
      if (match) {
        segments.push({ text: match[1], style: 'info' })
        segments.push({ text: `${match[2]}${match[3]}${match[2]}`, style: 'string' })
        if (match[4]) {
          segments.push({ text: match[4], style: 'info' })
        }
      } else {
        segments.push({ text: rest, style: 'info' })
      }
    }

    return segments
  }

  const parsedInput: ComputedRef<OutputSegment[]> = computed(() => parseCommand(inputText.value))

  return {
    inputText,
    outputResult,
    isEditing,
    echoLaserActive,
    echoText,
    parseCommand,
    parsedInput,
    execute,
    resetToDefault,
    commands,
  }
}
