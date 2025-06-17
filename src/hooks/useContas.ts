
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'

export interface Conta {
  id: string
  user_id: string
  tipo: 'pagar' | 'receber'
  descricao: string
  valor: number
  data_vencimento: string
  data_pagamento?: string
  status: 'pendente' | 'pago' | 'vencido'
  categoria_id: string
  observacoes?: string
  recorrente: boolean
  frequencia_recorrencia?: 'mensal' | 'trimestral' | 'anual'
  created_at: string
  updated_at: string
}

export interface ContaFormData {
  tipo: 'pagar' | 'receber'
  descricao: string
  valor: number
  data_vencimento: string
  categoria_id: string
  observacoes?: string
  recorrente: boolean
  frequencia_recorrencia?: 'mensal' | 'trimestral' | 'anual'
}

export function useContas(tipo?: 'pagar' | 'receber') {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: contas = [], isLoading } = useQuery({
    queryKey: ['contas', user?.id, tipo],
    queryFn: async () => {
      if (!user) return []
      
      let query = supabase
        .from('contas')
        .select(`
          *,
          categorias (
            id,
            nome
          )
        `)
        .eq('user_id', user.id)
        .order('data_vencimento', { ascending: true })

      if (tipo) {
        query = query.eq('tipo', tipo)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching contas:', error)
        throw error
      }

      return data || []
    },
    enabled: !!user,
  })

  const createConta = useMutation({
    mutationFn: async (contaData: ContaFormData) => {
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('contas')
        .insert({
          ...contaData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] })
      toast({
        title: 'Conta criada com sucesso!',
        description: 'A conta foi adicionada ao sistema.',
      })
    },
    onError: (error) => {
      console.error('Error creating conta:', error)
      toast({
        title: 'Erro ao criar conta',
        description: 'Não foi possível criar a conta. Tente novamente.',
        variant: 'destructive',
      })
    },
  })

  const updateConta = useMutation({
    mutationFn: async ({ id, ...contaData }: Partial<Conta> & { id: string }) => {
      const { data, error } = await supabase
        .from('contas')
        .update(contaData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
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
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('contas')
        .update({
          status: 'pago',
          data_pagamento: new Date().toISOString().split('T')[0]
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
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
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contas')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
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
