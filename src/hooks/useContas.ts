
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
      if (!user) {
        console.log('No user found, returning empty array')
        return []
      }
      
      console.log('Fetching contas for user:', user.id, 'tipo:', tipo)
      
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

      console.log('Fetched contas:', data?.length || 0, 'records')

      // Garantir que o tipo seja corretamente tipado
      return (data || []).map(conta => ({
        ...conta,
        tipo: conta.tipo as 'pagar' | 'receber',
        status: conta.status as 'pendente' | 'pago' | 'vencido',
        frequencia_recorrencia: conta.frequencia_recorrencia as 'mensal' | 'trimestral' | 'anual' | undefined
      }))
    },
    enabled: !!user,
  })

  const createConta = useMutation({
    mutationFn: async (contaData: ContaFormData) => {
      if (!user) {
        console.error('User not authenticated')
        throw new Error('Usuário não autenticado')
      }

      console.log('Creating conta with data:', contaData)
      console.log('User ID:', user.id)

      // Validações antes de enviar
      if (!contaData.descricao || contaData.descricao.trim() === '') {
        throw new Error('Descrição é obrigatória')
      }

      if (!contaData.valor || contaData.valor <= 0) {
        throw new Error('Valor deve ser maior que zero')
      }

      if (!contaData.data_vencimento) {
        throw new Error('Data de vencimento é obrigatória')
      }

      if (!contaData.categoria_id) {
        throw new Error('Categoria é obrigatória')
      }

      // Verificar se a categoria existe e pertence ao usuário
      const { data: categoria, error: categoriaError } = await supabase
        .from('categorias')
        .select('id')
        .eq('id', contaData.categoria_id)
        .eq('userid', user.id)
        .single()

      if (categoriaError || !categoria) {
        console.error('Categoria validation error:', categoriaError)
        throw new Error('Categoria selecionada não é válida')
      }

      const insertData = {
        ...contaData,
        user_id: user.id,
      }

      console.log('Inserting data:', insertData)

      const { data, error } = await supabase
        .from('contas')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Database error creating conta:', error)
        console.error('Error details:', error.message, error.details, error.hint)
        throw new Error(`Erro ao criar conta: ${error.message}`)
      }

      console.log('Conta created successfully:', data)
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
        description: error instanceof Error ? error.message : 'Não foi possível criar a conta. Tente novamente.',
        variant: 'destructive',
      })
    },
  })

  const updateConta = useMutation({
    mutationFn: async ({ id, ...contaData }: Partial<Conta> & { id: string }) => {
      console.log('Updating conta:', id, contaData)
      
      const { data, error } = await supabase
        .from('contas')
        .update(contaData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating conta:', error)
        throw error
      }
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
      console.log('Marking conta as paid:', id)
      
      const { data, error } = await supabase
        .from('contas')
        .update({
          status: 'pago',
          data_pagamento: new Date().toISOString().split('T')[0]
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error marking conta as paid:', error)
        throw error
      }
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
      console.log('Deleting conta:', id)
      
      const { error } = await supabase
        .from('contas')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting conta:', error)
        throw error
      }
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
