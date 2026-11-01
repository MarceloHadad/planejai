import { RefreshCw } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { Button } from '@/components/shared/Button'
import { Divider } from '@/components/shared/Divider'
import { useChat } from '@/hooks/useChat'

import { Form } from './Form'
import { Message } from './Message'

interface ChatProps {
  simulationId: string
}

export function Chat({ simulationId }: ChatProps) {
  const { messages, isLoading, error, sendMessage, retry } =
    useChat(simulationId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, isLoading, error])

  return (
    <section>
      <Divider />
      <h3 className="text-foreground mb-3 text-sm leading-relaxed font-semibold">
        💬 Converse com o Educador Financeiro
      </h3>

      <div className="mb-4 flex max-h-72 scrollbar-thin [scrollbar-color:var(--border)_transparent] flex-col gap-3 overflow-y-auto pr-2 lg:max-h-90">
        {messages.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Tem alguma dúvida sobre sua simulação? Pergunte abaixo.
          </p>
        )}
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isLoading && (
          <p className="text-muted-foreground animate-pulse text-sm">
            O educador está respondendo...
          </p>
        )}
        {error && (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-red-500">⚠️ {error}</p>
            <Button variant="secondary" icon={RefreshCw} onClick={retry}>
              Tentar novamente
            </Button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <Form isDisabled={isLoading} onSubmit={sendMessage} />
    </section>
  )
}
