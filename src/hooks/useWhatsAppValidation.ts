
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useWhatsAppValidation() {
  const [isValidating, setIsValidating] = useState(false)

  const validateWhatsAppNumber = async (phoneNumber: string, showToast: boolean = true): Promise<{ isValid: boolean; jid?: string; error?: string }> => {
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
        return { 
          isValid: false, 
          error: showToast ? "Este número não possui WhatsApp ativo" : undefined 
        }
      }
    } catch (error: any) {
      console.error('WhatsApp validation error:', error)
      return { 
        isValid: false, 
        error: showToast ? (error.message || "Erro ao validar número do WhatsApp") : undefined 
      }
    } finally {
      setIsValidating(false)
    }
  }

  return { validateWhatsAppNumber, isValidating }
}
