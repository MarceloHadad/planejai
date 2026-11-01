import type { ChatMessage } from '@/services/aiService'

interface MessageProps {
  message: ChatMessage
}

export function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={['flex', isUser ? 'justify-end' : 'justify-start'].join(' ')}
    >
      <p
        className={[
          'max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary-button text-foreground',
        ].join(' ')}
      >
        {message.content}
      </p>
    </div>
  )
}
