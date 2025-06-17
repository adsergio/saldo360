
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { 
  fetchContas, 
  createConta as createContaApi, 
  updateConta as updateContaApi, 
  markContaAsPaid as markContaAsPaidApi, 
  deleteConta as deleteContaApi 
} from '@/services/contasApi'
import type { Conta, ContaFormData } from '@/types/conta'

export type { Conta, ContaFormData }

export function useContas(tipo?: 'pagar' | 'receber') {
  const { user, session } = useAuth()
  const queryClient = useQueryClient()

  const { data: contas = [], isLoading } = useQuery({
    queryKey: ['contas', user?.id, tipo],
    queryFn: async () => {
      if (!user) {
        console.log('📊 No user found, returning empty array')
        return []
      }
      
      console.log('📊 Session valid:', !!session?.access_token)
      return fetchContas(user.id, tipo)
    },
    enabled: !!user,
  })

  const createConta = useMutation({
    mutationFn: async (contaData: ContaFormData) => {
      if (!user) {
        console.error('💰 User not authenticated')
        throw new Error('Usuário não autenticado. Faça login novamente.')
      }

      if (!session?.access_token) {
        console.error('💰 No valid session found')
        throw new Error('Sessão inválida. Faça login novamente.')
      }

      // Teste de autenticação simples antes de prosseguir
      console.log('💰 Testing authentication with simple query...')
      try {
        const { data: authTest, error: authError } = await supabase
          .from('categorias')
          .select('count(*)')
          .limit(1)
        
        if (authError) {
          console.error('💰 Auth test failed:', authError)
          throw new Error('Falha na autenticação. Faça login novamente.')
        }
        console.log('💰 Auth test passed:', authTest)
      } catch (error) {
        console.error('💰 Auth test exception:', error)
        throw new Error('Erro de autenticação. Verifique sua conexão.')
      }

      return createContaApi(contaData, user.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] })
      toast({
        title: 'Conta criada com sucesso!',
        description: 'A conta foi adicionada ao sistema.',
      })
    },
    onError: (error) => {
      console.error('💰 Error creating conta:', error)
      toast({
        title: 'Erro ao criar conta',
        description: error instanceof Error ? error.message : 'Não foi possível criar a conta. Tente novamente.',
        variant: 'destructive',
      })
    },
  })

  const updateConta = useMutation({
    mutationFn: async ({ id, ...contaData }: Partial<Conta> & { id: string }) => {
      return updateContaApi(id, contaData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] })
      toast({
        title: 'Conta atualizada com sucesso!',
      })
    },
    onError: (error) => {
      console.error('Error updating conta:', error)
      toast({
        title: 'Erro ao atualizar conta',
        description: 'Não foi possível atualizar a conta. Tente novamente.',
        variant: 'destructive',
      })
    },
  })

  const marcarComoPago = useMutation({
    mutationFn: markContaAsPaidApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] })
      toast({
        title: 'Conta marcada como paga!',
      })
    },
    onError: (error) => {
      console.error('Error marking conta as paid:', error)
      toast({
        title: 'Erro ao marcar conta como paga',
        description: 'Não foi possível atualizar o status da conta.',
        variant: 'destructive',
      })
    },
  })

  const deleteConta = useMutation({
    mutationFn: deleteContaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] })
      toast({
        title: 'Conta excluída com sucesso!',
      })
    },
    onError: (error) => {
      console.error('Error deleting conta:', error)
      toast({
        title: 'Erro ao excluir conta',
        description: 'Não foi possível excluir a conta. Tente novamente.',
        variant: 'destructive',
      })
    },
  })

  return {
    contas,
    isLoading,
    createConta,
    updateConta,
    marcarComoPago,
    deleteConta,
  }
}
