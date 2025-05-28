
import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

export function useWhatsAppValidation() {
  const [isValidating, setIsValidating] = useState(false)

  const validateWhatsAppNumber = async (phoneNumber: string): Promise<{ isValid: boolean; jid?: string }> => {
    setIsValidating(true)
    
    try {
      const { data, error } = await supabase.functions.invoke('validate-whatsapp', {
        body: { phoneNumber }
      })

      if (error) {
        throw new Error(error.message)
      }

      if (data.isValid) {
        return { isValid: true, jid: data.jid }
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
