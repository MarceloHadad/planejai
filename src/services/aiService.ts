interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
    }
  }[]
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: {
    content: string
  }
  suggestions: {
    items: string[]
  }
  extraIncome: {
    items: string[]
  }
  investment: {
    items: string[]
  }
  motivation: {
    content: string
  }
}

export interface ChatMessage {
  id: string
  role: 'user' | 'model'
  content: string
  createdAt: string
}

const API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY)
const MODEL_NAME = 'gemini-flash-latest'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

export class QuotaExceededError extends Error {
  isDaily: boolean

  constructor(isDaily: boolean) {
    super('Limite de uso da API atingido')
    this.isDaily = isDaily
  }
}

// A API informa o limite apenas no texto do erro
// ("... requests per day limit exceeded on Free Tier")
const isDailyQuota = async (response: Response) => {
  const body = (await response.json().catch(() => null)) as {
    error?: { message?: string }
  } | null

  return body?.error?.message?.toLowerCase().includes('per day') ?? false
}

const callGeminiAPI = async (body: object) => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (response.status === 429) {
    throw new QuotaExceededError(await isDailyQuota(response))
  }

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`)
  }

  return (await response.json()) as GeminiResponse
}

export const getInsight = async (prompt: string) => {
  const response = await callGeminiAPI({
    contents: [{ parts: [{ text: prompt }] }],
  })
  const json = response.candidates[0].content.parts[0].text
  return JSON.parse(json) as InsightData
}

// Perguntas sem resposta ficam seguidas no histórico, mas a API exige
// que os papéis se alternem: junta mensagens consecutivas do mesmo papel
const mergeConsecutiveMessages = (messages: ChatMessage[]) =>
  messages.reduce<{ role: ChatMessage['role']; parts: { text: string }[] }[]>(
    (contents, { role, content }) => {
      const last = contents.at(-1)

      if (last?.role === role) {
        last.parts[0].text += `\n${content}`
      } else {
        contents.push({ role, parts: [{ text: content }] })
      }

      return contents
    },
    [],
  )

export const getChatAnswer = async (
  systemPrompt: string,
  messages: ChatMessage[],
) => {
  const response = await callGeminiAPI({
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: mergeConsecutiveMessages(messages),
  })

  return response.candidates[0].content.parts[0].text.trim()
}
