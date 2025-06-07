
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'

export interface Cartao {
  id: string
  nome: string
  numero?: string
  bandeira?: string
  data_vencimento: string
}

export function useCartoes() {
  const { user } = useAuth()

  const { data: cartoes, isLoading, error } = useQuery({
    queryKey: ['cartoes', user?.id],
    queryFn: async () => {
      if (!user) return []

      const { data, error } = await supabase
        .from('cartoes_credito')
        .select('*')
        .eq('user_id', user.id)
        .order('nome')

      if (error) {
        console.error('Error fetching cartões:', error)
        throw error
      }

      return data as Cartao[]
    },
    enabled: !!user?.id,
  })

  return {
    cartoes: cartoes || [],
    isLoading,
    error
  }
}
