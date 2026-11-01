import { useState } from 'react'

import { buildChatPrompt } from '@/data/aiPrompt'
import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { type ChatMessage, getChatAnswer } from '@/services/aiService'
import { getAIErrorMessage } from '@/utils/aiError'

const createMessage = (
  role: ChatMessage['role'],
  content: string,
): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
  createdAt: new Date().toISOString(),
})

const ANSWER_ERROR = 'Erro ao obter a resposta. Tente novamente.'

export const useChat = (simulationId: string) => {
  const { getFormData, updateSimulation } = useSimulationStorage()

  const [messages, setMessages] = useState<ChatMessage[]>(
    () => getFormData(simulationId)?.chat ?? [],
  )
  const [isLoading, setIsLoading] = useState(false)
  // Uma pergunta salva sem resposta (ex.: página recarregada após falha)
  // volta com a opção de tentar novamente
  const [error, setError] = useState<string | null>(() =>
    messages.at(-1)?.role === 'user' ? ANSWER_ERROR : null,
  )

  // Lê a simulação de novo para não sobrescrever o insight salvo
  const saveMessages = (updatedMessages: ChatMessage[]) => {
    const simulation = getFormData(simulationId)

    if (simulation) {
      updateSimulation(simulationId, {
        ...simulation,
        chat: updatedMessages,
      } as SimulationRecord)
    }

    setMessages(updatedMessages)
  }

  const requestAnswer = async (history: ChatMessage[]) => {
    const simulation = getFormData(simulationId)

    if (!simulation) {
      setError('Simulação não encontrada.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const answer = await getChatAnswer(buildChatPrompt(simulation), history)
      saveMessages([...history, createMessage('model', answer)])
    } catch (error) {
      setError(getAIErrorMessage(error, ANSWER_ERROR))
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (question: string) => {
    const history = [...messages, createMessage('user', question)]

    saveMessages(history)
    await requestAnswer(history)
  }

  const retry = () => requestAnswer(messages)

  return { messages, isLoading, error, sendMessage, retry }
}
