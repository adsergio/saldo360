
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'

interface ChatMessage {
  id: string
  type: 'text' | 'image' | 'audio'
  content: string
  userId: string
  fileName?: string
  created_at: string
  isBot?: boolean
}

interface SendMessageData {
  type: 'text' | 'image' | 'audio'
  content: string
  userId: string
  fileName?: string
}

export function useChatMessages() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchMessages()
    }
  }, [user?.id])

  const fetchMessages = async () => {
    if (!user?.id) return

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('userId', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error

      setMessages(data || [])
    } catch (error: any) {
      console.error('Erro ao buscar mensagens:', error)
      toast({
        title: "Erro ao carregar mensagens",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const sendMessage = async (messageData: SendMessageData) => {
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          type: messageData.type,
          content: messageData.content,
          userId: messageData.userId,
          fileName: messageData.fileName,
          isBot: false
        }])
        .select()
        .single()

      if (error) throw error

      setMessages(prev => [...prev, data])

      // Simular resposta automática para demonstração
      if (messageData.type === 'text') {
        setTimeout(() => {
          sendBotResponse(messageData.content)
        }, 1000)
      }

    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error)
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendBotResponse = async (userMessage: string) => {
    let botResponse = "Obrigado pela sua mensagem! Como posso ajudá-lo com suas finanças?"

    // Simples lógica de resposta baseada em palavras-chave
    if (userMessage.toLowerCase().includes('gasto') || userMessage.toLowerCase().includes('despesa')) {
      botResponse = "Entendi que você quer falar sobre gastos. Posso ajudá-lo a categorizar suas despesas ou criar um orçamento!"
    } else if (userMessage.toLowerCase().includes('receita') || userMessage.toLowerCase().includes('ganho')) {
      botResponse = "Ótimo! Vamos falar sobre suas receitas. Você gostaria de registrar uma nova entrada ou revisar seus ganhos?"
    } else if (userMessage.toLowerCase().includes('relatório') || userMessage.toLowerCase().includes('relatorio')) {
      botResponse = "Posso ajudá-lo a gerar relatórios financeiros detalhados. Que período você gostaria de analisar?"
    }

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          type: 'text',
          content: botResponse,
          userId: user?.id || '',
          isBot: true
        }])
        .select()
        .single()

      if (error) throw error

      setMessages(prev => [...prev, data])
    } catch (error) {
      console.error('Erro ao enviar resposta do bot:', error)
    }
  }

  return {
    messages,
    sendMessage,
    isLoading,
    fetchMessages
  }
}
