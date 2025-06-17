
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export interface Cartao {
  id: string
  nome: string
  numero?: string
  bandeira?: string
  data_vencimento: string
}

export interface FaturaFechada {
  id: string
  cartao_id: string
  valor_total: number
  data_fechamento: string
  descricao: string
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

  // Query separada para buscar faturas fechadas
  const { data: faturasFechadas } = useQuery({
    queryKey: ['faturas-fechadas', user?.id],
    queryFn: async () => {
      if (!user) return []

      const { data, error } = await supabase
        .from('faturas_fechadas')
        .select('*')
        .eq('user_id', user.id)
        .order('data_fechamento', { ascending: false })

      if (error) {
        console.error('Error fetching faturas fechadas:', error)
        throw error
      }

      return data as FaturaFechada[]
    },
    enabled: !!user?.id,
  })

  return {
    cartoes: cartoes || [],
    faturasFechadas: faturasFechadas || [],
    isLoading,
    error
  }
}
