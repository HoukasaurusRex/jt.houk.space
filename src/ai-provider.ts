import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-sonnet-4-6' as const

const client = new Anthropic()

export const complete = async (opts: {
  system?: string
  messages: { role: 'user' | 'assistant'; content: string }[]
  maxTokens?: number
  timeout?: number
}): Promise<string> => {
  const response = await client.messages.create(
    {
      model: MODEL,
      max_tokens: opts.maxTokens ?? 2048,
      system: opts.system,
      messages: opts.messages,
    },
    opts.timeout ? { timeout: opts.timeout } : undefined,
  )
  return response.content[0].type === 'text' ? response.content[0].text : ''
}
