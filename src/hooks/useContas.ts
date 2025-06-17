
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { fetchContas, createConta, updateConta, markContaAsPaid, deleteConta } from '@/services/contasApi'
import { toast } from '@/hooks/use-toast'
import type { ContaFormData } from '@/types/conta'

export function useContas(tipo?: 'pagar' | 'receber') {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const contasQuery = useQuery({
    queryKey: ['contas', user?.id, tipo],
    queryFn: () => {
      if (!user?.id) {
        console.error('📊 No user ID available for fetching contas')
        throw new Error('Usuário não autenticado')
      }
      console.log('📊 Fetching contas with unified client, user:', user.id, 'tipo:', tipo)
      return fetchContas(user.id, tipo)
    },
    enabled: !!user?.id,
  })

  const createContaMutation = useMutation({
    mutationFn: (contaData: ContaFormData) => {
      if (!user?.id) {
        console.error('💰 No user ID available for creating conta')
        throw new Error('Usuário não autenticado')
      }
      console.log('💰 Creating conta with unified client, user:', user.id)
      return createConta(contaData, user.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] })
      toast({
        title: "Conta criada com sucesso!",
        description: "A conta foi adicionada à sua lista.",
      })
    },
    onError: (error: Error) => {
      console.error('💰 Error creating conta:', error)
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const updateContaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContaFormData> }) => {
      console.log('💰 Updating conta with unified client:', id)
      return updateConta(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] })
      toast({
        title: "Conta atualizada com sucesso!",
      })
    },
    onError: (error: Error) => {
      console.error('💰 Error updating conta:', error)
      toast({
        title: "Erro ao atualizar conta",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const markAsPaidMutation = useMutation({
    mutationFn: (id: string) => {
      console.log('💰 Marking conta as paid with unified client:', id)
      return markContaAsPaid(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] })
      toast({
        title: "Conta marcada como paga!",
      })
    },
    onError: (error: Error) => {
      console.error('💰 Error marking conta as paid:', error)
      toast({
        title: "Erro ao marcar conta como paga",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const deleteContaMutation = useMutation({
    mutationFn: (id: string) => {
      console.log('💰 Deleting conta with unified client:', id)
      return deleteConta(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] })
      toast({
        title: "Conta excluída com sucesso!",
      })
    },
    onError: (error: Error) => {
      console.error('💰 Error deleting conta:', error)
      toast({
        title: "Erro ao excluir conta",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  return {
    contas: contasQuery.data || [],
    isLoading: contasQuery.isLoading,
    error: contasQuery.error,
    createConta: createContaMutation.mutate,
    updateConta: updateContaMutation.mutate,
    markAsPaid: markAsPaidMutation.mutate,
    deleteConta: deleteContaMutation.mutate,
    isCreating: createContaMutation.isPending,
    isUpdating: updateContaMutation.isPending,
    isMarkingAsPaid: markAsPaidMutation.isPending,
    isDeleting: deleteContaMutation.isPending,
  }
}
