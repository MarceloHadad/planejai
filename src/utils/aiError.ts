import { QuotaExceededError } from '@/services/aiService'

const DAILY_QUOTA_ERROR =
  'Limite diário de uso da IA atingido. Tente novamente mais tarde.'
const QUOTA_ERROR = 'Limite de uso da IA atingido. Tente novamente mais tarde.'

export const getAIErrorMessage = (error: unknown, fallback: string) => {
  if (!(error instanceof QuotaExceededError)) {
    return fallback
  }

  return error.isDaily ? DAILY_QUOTA_ERROR : QUOTA_ERROR
}
