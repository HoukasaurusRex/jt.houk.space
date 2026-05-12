import Anthropic from '@anthropic-ai/sdk'

const DEFAULT_MODEL = 'claude-sonnet-4-6'

const client = new Anthropic()

export const complete = async (opts: {
  system?: string
  messages: { role: 'user' | 'assistant'; content: string }[]
  maxTokens?: number
  timeout?: number
  model?: string
  thinking?: { type: 'enabled'; budget_tokens: number } | { type: 'disabled' } | { type: 'adaptive' }
}): Promise<string> => {
  const response = await client.messages.create(
    {
      model: opts.model ?? DEFAULT_MODEL,
      max_tokens: opts.maxTokens ?? 2048,
      system: opts.system,
      messages: opts.messages,
      ...(opts.thinking ? { thinking: opts.thinking } : {}),
    },
    opts.timeout ? { timeout: opts.timeout } : undefined,
  )
  return response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
}
