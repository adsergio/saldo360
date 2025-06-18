
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { calcularPeriodoCiclo } from '@/utils/cartaoUtils'

export function useFecharFatura() {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

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
        .lte('quando', dataLimiteCiclo) // Transações ATÉ a data limite do ciclo

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
    fecharFatura: fecharFaturaMutation.mutate,
    isClosingFatura: fecharFaturaMutation.isPending
  }
}
