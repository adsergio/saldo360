
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { CartaoResumo } from '@/types/cartao'
import { calcularPeriodoCiclo } from '@/utils/cartaoUtils'

export function useCartaoResumos() {
  const { user } = useAuth()

  // Buscar resumo de gastos por cartão considerando apenas o ciclo atual
  const { data: resumosCartao = [], isLoading } = useQuery({
    queryKey: ['cartao-resumos', user?.id],
    queryFn: async () => {
      if (!user) return []

      // Primeiro, buscar os cartões com suas datas de vencimento
      const { data: cartoes, error: cartoesError } = await supabase
        .from('cartoes_credito')
        .select('id, nome, data_vencimento')
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
        
        console.log(`=== CARTÃO: ${cartao.nome} (${cartao.id}) ===`)
        console.log(`Data de vencimento: ${cartao.data_vencimento}`)
        console.log(`Data limite do ciclo: ${dataLimiteCiclo}`)
        console.log(`Hoje: ${new Date().toISOString().split('T')[0]}`)
        
        const { data: transacoes, error: transacoesError } = await supabase
          .from('transacoes')
          .select('valor, quando, estabelecimento')
          .eq('userId', user.id)
          .eq('cartao_id', cartao.id)
          .eq('tipo', 'despesa')
          .eq('incluida_na_fatura', false)
          .lte('quando', dataLimiteCiclo) // Transações ATÉ a data limite do ciclo

        if (transacoesError) {
          console.error('Error fetching transações for cartão:', cartao.id, transacoesError)
          continue
        }

        console.log(`Transações encontradas: ${transacoes?.length || 0}`)
        if (transacoes && transacoes.length > 0) {
          transacoes.forEach((t, i) => {
            console.log(`  ${i + 1}. ${t.quando} - ${t.estabelecimento} - R$ ${t.valor}`)
          })
          
          const totalGastos = transacoes.reduce((acc, t) => acc + (Number(t.valor) || 0), 0)
          console.log(`Total calculado: R$ ${totalGastos}`)
          
          resumos.push({
            cartao_id: cartao.id,
            total_gastos: totalGastos,
            quantidade_transacoes: transacoes.length
          })
        } else {
          console.log('Nenhuma transação encontrada para este cartão')
        }
        console.log('===============================')
      }

      return resumos
    },
    enabled: !!user?.id,
  })

  return {
    resumosCartao,
    isLoading
  }
}
