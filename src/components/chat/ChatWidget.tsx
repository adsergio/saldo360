
import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, Send, Image, Mic, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useChatMessages } from '@/hooks/useChatMessages'
import { ChatMessage } from './ChatMessage'
import { MediaUpload } from './MediaUpload'
import { VoiceRecorder } from './VoiceRecorder'

export function ChatWidget() {
  const { user } = useAuth()
  const { messages, sendMessage, isLoading } = useChatMessages()
  const [isOpen, setIsOpen] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [showMediaUpload, setShowMediaUpload] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendText = async () => {
    if (!messageText.trim()) return
    
    await sendMessage({
      type: 'text',
      content: messageText,
      userId: user?.id || '',
    })
    setMessageText('')
  }

  const handleSendMedia = async (file: File, type: 'image' | 'audio') => {
    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result as string
      await sendMessage({
        type,
        content: base64,
        userId: user?.id || '',
        fileName: file.name,
      })
    }
    reader.readAsDataURL(file)
    setShowMediaUpload(false)
    setShowVoiceRecorder(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendText()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-12 w-12 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-96">
      <Card className="h-full flex flex-col shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Chat Financeiro</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-3 py-2">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1"
                disabled={isLoading}
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMediaUpload(true)}
                disabled={isLoading}
              >
                <Image className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVoiceRecorder(true)}
                disabled={isLoading}
              >
                <Mic className="h-4 w-4" />
              </Button>
              
              <Button
                onClick={handleSendText}
                size="sm"
                disabled={!messageText.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showMediaUpload && (
        <MediaUpload
          onUpload={handleSendMedia}
          onClose={() => setShowMediaUpload(false)}
        />
      )}

      {showVoiceRecorder && (
        <VoiceRecorder
          onRecordingComplete={(file) => handleSendMedia(file, 'audio')}
          onClose={() => setShowVoiceRecorder(false)}
        />
      )}
    </div>
  )
}
