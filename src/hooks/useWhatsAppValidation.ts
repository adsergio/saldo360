
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'

interface WhatsAppResponse {
  exists: boolean
  jid: string
  number: string
}

export function useWhatsAppValidation() {
  const [isValidating, setIsValidating] = useState(false)

  const validateWhatsAppNumber = async (phoneNumber: string): Promise<{ isValid: boolean; jid?: string }> => {
    setIsValidating(true)
    
    try {
      // Obter a API key do localStorage
      const apiKey = localStorage.getItem('evolution-api-key')
      const serverUrl = localStorage.getItem('evolution-server-url')
      const instance = localStorage.getItem('evolution-instance')

      if (!apiKey || !serverUrl || !instance) {
        toast({
          title: "Configuração necessária",
          description: "Configure suas credenciais da Evolution API nas configurações",
          variant: "destructive",
        })
        return { isValid: false }
      }

      const options = {
        method: 'POST',
        headers: {
          'apikey': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ numbers: [phoneNumber] })
      }

      const response = await fetch(`${serverUrl}/chat/whatsappNumbers/${instance}`, options)
      
      if (!response.ok) {
        throw new Error('Erro na validação do WhatsApp')
      }

      const data: WhatsAppResponse[] = await response.json()
      
      if (data.length > 0 && data[0].exists) {
        return { isValid: true, jid: data[0].jid }
      } else {
        toast({
          title: "Número não encontrado",
          description: "Este número não possui WhatsApp ativo",
          variant: "destructive",
        })
        return { isValid: false }
      }
    } catch (error: any) {
      toast({
        title: "Erro na validação",
        description: error.message || "Erro ao validar número do WhatsApp",
        variant: "destructive",
      })
      return { isValid: false }
    } finally {
      setIsValidating(false)
    }
  }

  return { validateWhatsAppNumber, isValidating }
}
