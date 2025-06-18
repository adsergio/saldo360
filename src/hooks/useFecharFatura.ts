
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { calcularDataLimiteCiclo, filtrarTransacoesValidas, calcularResumoCartao } from '@/utils/cartaoUtils'

export function useFecharFatura() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const fecharFaturaMutation = useMutation({
    mutationFn: async (cartaoId: string) => {
      if (!user?.id) throw new Error('Usuário não autenticado')

      console.log('🔒 Fechando fatura do cartão:', cartaoId)

      // Buscar dados do cartão da tabela correta
      const { data: cartao, error: cartaoError } = await supabase
        .from('cartoes_credito')
        .select('nome, data_vencimento')
        .eq('id', cartaoId)
        .single()

      if (cartaoError) throw cartaoError

      // Converter data_vencimento para número
      const diaVencimento = parseInt(cartao.data_vencimento, 10)

      // Calcular a data limite do ciclo (mesma lógica do resumo - mês atual)
      const dataLimiteCiclo = calcularDataLimiteCiclo(diaVencimento)

      console.log('📅 Data limite para fechamento:', dataLimiteCiclo.toLocaleDateString('pt-BR'))

      // Buscar todas as transações do ciclo atual (mesma lógica do resumo)
      const { data: todasTransacoes, error: transacoesError } = await supabase
        .from('transacoes')
        .select('*')
        .eq('cartao_id', cartaoId)
        .eq('tipo', 'despesa')
        .lte('quando', dataLimiteCiclo.toISOString())

      if (transacoesError) throw transacoesError

      // Aplicar o mesmo filtro do resumo
      const transacoesValidas = filtrarTransacoesValidas(todasTransacoes || [], dataLimiteCiclo)

      console.log('💰 Transações encontradas para fechamento:', transacoesValidas?.length || 0)

      const { gastos_pendentes: valorTotal } = calcularResumoCartao(transacoesValidas)

      console.log('💰 Valor total da fatura:', valorTotal)

      if (valorTotal === 0) {
        throw new Error('Não há transações pendentes para fechar neste cartão')
      }

      // Criar uma transação de pagamento da fatura
      const dataVencimento = new Date(dataLimiteCiclo)
      dataVencimento.setDate(dataVencimento.getDate() + 30) // 30 dias após o fechamento

      const { error: faturaError } = await supabase
        .from('transacoes')
        .insert({
          userId: user.id,
          tipo: 'despesa',
          valor: valorTotal,
          detalhes: `Fatura ${cartao.nome} - ${dataLimiteCiclo.toLocaleDateString('pt-BR')}`,
          quando: dataVencimento.toISOString().split('T')[0], // Formato YYYY-MM-DD
          category_id: null, // Fatura não tem categoria específica
          cartao_id: null, // A fatura em si não é vinculada ao cartão
        })

      if (faturaError) throw faturaError

      return { valorTotal, cartaoNome: cartao.nome }
    },
    onSuccess: (data) => {
      toast({
        title: 'Fatura fechada com sucesso!',
        description: `Fatura do ${data.cartaoNome} no valor de R$ ${data.valorTotal.toFixed(2)} foi criada.`,
      })
      queryClient.invalidateQueries({ queryKey: ['cartao-resumos'] })
      queryClient.invalidateQueries({ queryKey: ['transacoes'] })
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao fechar fatura',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  return {
    fecharFatura: fecharFaturaMutation.mutate,
    isClosingFatura: fecharFaturaMutation.isPending,
  }
}
