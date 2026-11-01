import { SendHorizontal } from 'lucide-react'
import { type FormEvent, useState } from 'react'

import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'

interface FormProps {
  isDisabled: boolean
  onSubmit: (question: string) => void
}

export function Form({ isDisabled, onSubmit }: FormProps) {
  const [question, setQuestion] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    const trimmedQuestion = question.trim()

    if (!trimmedQuestion || isDisabled) {
      return
    }

    onSubmit(trimmedQuestion)
    setQuestion('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="flex-1">
        <Input
          autoFocus={false}
          aria-label="Pergunte algo sobre sua simulação"
          placeholder="Pergunte algo sobre sua simulação"
          maxLength={300}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        icon={SendHorizontal}
        aria-label="Enviar pergunta"
        disabled={isDisabled || !question.trim()}
        className="h-full"
      />
    </form>
  )
}
