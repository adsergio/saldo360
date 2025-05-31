
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { User, Bot } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ChatMessageData {
  id: string
  type: 'text' | 'image' | 'audio'
  content: string
  userId: string
  fileName?: string
  created_at: string
  isBot?: boolean
}

interface ChatMessageProps {
  message: ChatMessageData
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = !message.isBot
  
  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <p className="text-sm">{message.content}</p>
      
      case 'image':
        return (
          <div className="max-w-48">
            <img
              src={message.content}
              alt={message.fileName || 'Imagem'}
              className="rounded-md max-w-full h-auto"
            />
            {message.fileName && (
              <p className="text-xs text-muted-foreground mt-1">{message.fileName}</p>
            )}
          </div>
        )
      
      case 'audio':
        return (
          <div className="flex flex-col gap-2">
            <audio controls className="max-w-48">
              <source src={message.content} type="audio/webm" />
              <source src={message.content} type="audio/mp3" />
              Seu navegador não suporta áudio.
            </audio>
            {message.fileName && (
              <p className="text-xs text-muted-foreground">{message.fileName}</p>
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[70%] ${isUser ? 'order-first' : ''}`}>
        <Card className={`p-3 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
          {renderContent()}
        </Card>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(message.created_at), {
            addSuffix: true,
            locale: ptBR
          })}
        </p>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
