
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { CartaoResumo } from '@/types/cartao'
import { calcularDataLimiteCiclo, filtrarTransacoesValidas, calcularResumoCartao } from '@/utils/cartaoUtils'

export function useCartaoResumos() {
  const { user } = useAuth()

  const { data: resumos = [], isLoading } = useQuery({
    queryKey: ['cartao-resumos', user?.id],
    queryFn: async () => {
      if (!user?.id) return []

      console.log('🔍 Buscando resumos dos cartões...')

      // Buscar todos os cartões do usuário da tabela correta
      const { data: cartoes, error: cartoesError } = await supabase
        .from('cartoes_credito')
        .select('id, nome, data_vencimento')
        .eq('user_id', user.id)

      if (cartoesError) {
        console.error('❌ Erro ao buscar cartões:', cartoesError)
        throw cartoesError
      }

      console.log('📋 Cartões encontrados:', cartoes)

      // Para cada cartão, calcular os gastos pendentes
      const resumos: CartaoResumo[] = []
      
      for (const cartao of cartoes) {
        console.log(`\n💳 Processando cartão: ${cartao.nome}`)
        
        // Converter data_vencimento (string) para número
        const diaVencimento = parseInt(cartao.data_vencimento, 10)
        
        // Calcular a data limite do ciclo (sempre o mês atual)
        const dataLimiteCiclo = calcularDataLimiteCiclo(diaVencimento)
        
        console.log(`📅 Data limite do ciclo: ${dataLimiteCiclo.toLocaleDateString('pt-BR')}`)
        
        // Buscar todas as transações do cartão até a data limite
        const { data: todasTransacoes, error: transacoesError } = await supabase
          .from('transacoes')
          .select('*')
          .eq('cartao_id', cartao.id)
          .eq('tipo', 'despesa')
          .lte('quando', dataLimiteCiclo.toISOString())
          .order('quando', { ascending: false })

        if (transacoesError) {
          console.error(`❌ Erro ao buscar transações do cartão ${cartao.nome}:`, transacoesError)
          continue
        }

        console.log(`📝 Total de transações encontradas: ${todasTransacoes?.length || 0}`)

        // Filtrar transações válidas (excluir originais que foram parceladas)
        const transacoesValidas = filtrarTransacoesValidas(todasTransacoes || [], dataLimiteCiclo)

        console.log(`💰 Transações válidas para ${cartao.nome}:`, transacoesValidas?.length || 0)
        console.log(`💰 Valores das transações:`, transacoesValidas?.map(t => `R$ ${t.valor} (${t.is_installment ? 'parcela' : 'normal'})`) || [])

        const { gastos_pendentes, quantidade_transacoes } = calcularResumoCartao(transacoesValidas)

        console.log(`💳 ${cartao.nome}: Gastos pendentes = R$ ${gastos_pendentes.toFixed(2)}, Transações = ${quantidade_transacoes}`)

        resumos.push({
          cartao_id: cartao.id,
          nome_cartao: cartao.nome,
          gastos_pendentes,
          quantidade_transacoes,
          vencimento: diaVencimento
        })
      }

      console.log('✅ Resumos finais:', resumos)
      return resumos
    },
    enabled: !!user?.id,
  })

  return {
    resumos,
    isLoading
  }
}
