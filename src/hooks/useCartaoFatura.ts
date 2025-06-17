
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

export interface FaturaFechada {
  id: string
  cartao_id: string
  user_id: string
  valor_total: number
  data_fechamento: string
  descricao: string
}

export interface CartaoResumo {
  cartao_id: string
  total_gastos: number
  quantidade_transacoes: number
}

// Função para calcular o período do ciclo atual baseado na data de vencimento
const calcularPeriodoCiclo = (dataVencimento: string) => {
  const hoje = new Date()
  const diaVencimento = parseInt(dataVencimento)
  
  let dataLimite: Date
  
  // Se ainda não passou do dia de vencimento no mês atual, o ciclo vai até o vencimento do mês atual
  if (hoje.getDate() <= diaVencimento) {
    dataLimite = new Date(hoje.getFullYear(), hoje.getMonth(), diaVencimento)
  } else {
    // Se já passou do dia de vencimento, o próximo ciclo vai até o vencimento do próximo mês
    dataLimite = new Date(hoje.getFullYear(), hoje.getMonth() + 1, diaVencimento)
  }
  
  return dataLimite.toISOString().split('T')[0] // Retorna no formato YYYY-MM-DD
}

export function useCartaoFatura() {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Buscar resumo de gastos por cartão considerando apenas o ciclo atual
  const { data: resumosCartao = [], isLoading } = useQuery({
    queryKey: ['cartao-resumos', user?.id],
    queryFn: async () => {
      if (!user) return []

      // Primeiro, buscar os cartões com suas datas de vencimento
      const { data: cartoes, error: cartoesError } = await supabase
        .from('cartoes_credito')
        .select('id, data_vencimento')
        .eq('user_id', user.id)

      if (cartoesError) {
        console.error('Error fetching cartões:', cartoesError)
        throw cartoesError
      }

      if (!cartoes || cartoes.length === 0) {
        return []
      }

      const resumos: CartaoResumo[] = []

      // Para cada cartão, buscar transações do ciclo atual
      for (const cartao of cartoes) {
        const dataLimiteCiclo = calcularPeriodoCiclo(cartao.data_vencimento)
        
        const { data: transacoes, error: transacoesError } = await supabase
          .from('transacoes')
          .select('valor')
          .eq('userId', user.id)
          .eq('cartao_id', cartao.id)
          .eq('tipo', 'despesa')
          .eq('incluida_na_fatura', false)
          .lte('quando', dataLimiteCiclo)

        if (transacoesError) {
          console.error('Error fetching transações for cartão:', cartao.id, transacoesError)
          continue
        }

        if (transacoes && transacoes.length > 0) {
          const totalGastos = transacoes.reduce((acc, t) => acc + (Number(t.valor) || 0), 0)
          
          resumos.push({
            cartao_id: cartao.id,
            total_gastos: totalGastos,
            quantidade_transacoes: transacoes.length
          })
        }
      }

      return resumos
    },
    enabled: !!user?.id,
  })

  // Mutation para fechar fatura
  const fecharFaturaMutation = useMutation({
    mutationFn: async ({ cartaoId, nomeCartao }: { cartaoId: string; nomeCartao: string }) => {
      if (!user) throw new Error('Usuário não autenticado')

      // 1. Buscar a data de vencimento do cartão
      const { data: cartao, error: cartaoError } = await supabase
        .from('cartoes_credito')
        .select('data_vencimento')
        .eq('id', cartaoId)
        .single()

      if (cartaoError) {
        console.error('Error fetching cartão:', cartaoError)
        throw cartaoError
      }

      const dataLimiteCiclo = calcularPeriodoCiclo(cartao.data_vencimento)

      // 2. Buscar todas as transações pendentes do cartão no ciclo atual
      const { data: transacoesPendentes, error: transacoesError } = await supabase
        .from('transacoes')
        .select('id, valor')
        .eq('userId', user.id)
        .eq('cartao_id', cartaoId)
        .eq('tipo', 'despesa')
        .eq('incluida_na_fatura', false)
        .lte('quando', dataLimiteCiclo)

      if (transacoesError) {
        console.error('Error fetching pending transactions:', transacoesError)
        throw transacoesError
      }

      if (!transacoesPendentes || transacoesPendentes.length === 0) {
        throw new Error('Não há transações pendentes para este cartão no ciclo atual')
      }

      // 3. Calcular valor total
      const valorTotal = transacoesPendentes.reduce((acc, t) => acc + (Number(t.valor) || 0), 0)

      // 4. Criar registro de fatura fechada
      const descricao = `Fatura ${nomeCartao}`
      const { data: faturaFechada, error: faturaError } = await supabase
        .from('faturas_fechadas')
        .insert({
          cartao_id: cartaoId,
          user_id: user.id,
          valor_total: valorTotal,
          descricao: descricao
        })
        .select()
        .single()

      if (faturaError) {
        console.error('Error creating fatura fechada:', faturaError)
        throw faturaError
      }

      // 5. Marcar transações como incluídas na fatura
      const { error: updateError } = await supabase
        .from('transacoes')
        .update({
          incluida_na_fatura: true,
          fatura_fechada_id: faturaFechada.id
        })
        .in('id', transacoesPendentes.map(t => t.id))

      if (updateError) {
        console.error('Error updating transactions:', updateError)
        throw updateError
      }

      // 6. Criar transação consolidada representando a fatura
      const { error: insertError } = await supabase
        .from('transacoes')
        .insert({
          userId: user.id,
          cartao_id: cartaoId,
          category_id: '00000000-0000-0000-0000-000000000000', // Categoria padrão, ajustar conforme necessário
          tipo: 'despesa',
          valor: valorTotal,
          estabelecimento: descricao,
          detalhes: `Fatura consolidada - ${transacoesPendentes.length} transações`,
          quando: new Date().toISOString().split('T')[0],
          incluida_na_fatura: false // Esta é a transação consolidada, não deve ser incluída novamente
        })

      if (insertError) {
        console.error('Error creating consolidated transaction:', insertError)
        throw insertError
      }

      return { valorTotal, quantidadeTransacoes: transacoesPendentes.length }
    },
    onSuccess: (data) => {
      toast({
        title: 'Fatura fechada com sucesso',
        description: `${data.quantidadeTransacoes} transações consolidadas no valor de R$ ${data.valorTotal.toFixed(2)}`,
      })
      
      // Invalidar queries para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ['cartao-resumos'] })
      queryClient.invalidateQueries({ queryKey: ['cartoes'] })
    },
    onError: (error) => {
      console.error('Error closing fatura:', error)
      toast({
        title: 'Erro ao fechar fatura',
        description: error.message || 'Erro inesperado ao fechar fatura',
        variant: 'destructive',
      })
    }
  })

  return {
    resumosCartao,
    isLoading,
    fecharFatura: fecharFaturaMutation.mutate,
    isClosingFatura: fecharFaturaMutation.isPending
  }
}
