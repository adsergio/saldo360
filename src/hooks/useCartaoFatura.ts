
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'

export interface CartaoResumo {
  cartao_id: string
  nome_cartao: string
  gastos_pendentes: number
  vencimento: number
}

export function useCartaoFatura() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

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
        
        // Calcular a data limite do ciclo (sempre o próximo vencimento)
        const hoje = new Date()
        const mesAtual = hoje.getMonth()
        const anoAtual = hoje.getFullYear()
        
        // Sempre usar o próximo vencimento (mês seguinte)
        const dataLimiteCiclo = new Date(anoAtual, mesAtual + 1, diaVencimento, 23, 59, 59)
        
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
        const transacoesValidas = todasTransacoes?.filter(transacao => {
          if (!transacao.quando) return false
          
          // Normalizar a data da transação
          let dataTransacao: Date
          if (transacao.quando.includes('T')) {
            dataTransacao = new Date(transacao.quando)
          } else {
            dataTransacao = new Date(transacao.quando + 'T00:00:00')
          }
          
          // Verificar se está dentro do ciclo
          const dentoDoCiclo = dataTransacao <= dataLimiteCiclo
          if (!dentoDoCiclo) {
            console.log(`📝 Transação ${transacao.quando}: ❌ Fora do ciclo`)
            return false
          }

          // Se é uma parcela, incluir
          if (transacao.is_installment) {
            console.log(`📝 Parcela ${transacao.installment_number}/${transacao.total_installments}: ✅ Incluída`)
            return true
          }

          // Se não é parcela, verificar se não foi parcelada
          const foiParcelada = todasTransacoes?.some(t => 
            t.installment_group_id && 
            t.is_installment && 
            Math.abs(new Date(t.quando).getTime() - dataTransacao.getTime()) < 24 * 60 * 60 * 1000 // mesmo dia
          )

          if (foiParcelada) {
            console.log(`📝 Transação ${transacao.quando}: ❌ Foi parcelada (excluída)`)
            return false
          }

          console.log(`📝 Transação ${transacao.quando}: ✅ Incluída`)
          return true
        }) || []

        console.log(`💰 Transações válidas para ${cartao.nome}:`, transacoesValidas?.length || 0)
        console.log(`💰 Valores das transações:`, transacoesValidas?.map(t => `R$ ${t.valor} (${t.is_installment ? 'parcela' : 'normal'})`) || [])

        const gastosPendentes = transacoesValidas?.reduce((acc, transacao) => acc + (transacao.valor || 0), 0) || 0

        console.log(`💳 ${cartao.nome}: Gastos pendentes = R$ ${gastosPendentes.toFixed(2)}`)

        resumos.push({
          cartao_id: cartao.id,
          nome_cartao: cartao.nome,
          gastos_pendentes: gastosPendentes,
          vencimento: diaVencimento
        })
      }

      console.log('✅ Resumos finais:', resumos)
      return resumos
    },
    enabled: !!user?.id,
  })

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

      // Calcular a data limite do ciclo (mesma lógica do resumo)
      const hoje = new Date()
      const mesAtual = hoje.getMonth()
      const anoAtual = hoje.getFullYear()
      
      const dataLimiteCiclo = new Date(anoAtual, mesAtual + 1, diaVencimento, 23, 59, 59)

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
      const transacoesValidas = todasTransacoes?.filter(transacao => {
        if (!transacao.quando) return false
        
        let dataTransacao: Date
        if (transacao.quando.includes('T')) {
          dataTransacao = new Date(transacao.quando)
        } else {
          dataTransacao = new Date(transacao.quando + 'T00:00:00')
        }
        
        const dentoDoCiclo = dataTransacao <= dataLimiteCiclo
        if (!dentoDoCiclo) return false

        // Se é uma parcela, incluir
        if (transacao.is_installment) return true

        // Se não é parcela, verificar se não foi parcelada
        const foiParcelada = todasTransacoes?.some(t => 
          t.installment_group_id && 
          t.is_installment && 
          Math.abs(new Date(t.quando).getTime() - dataTransacao.getTime()) < 24 * 60 * 60 * 1000
        )

        return !foiParcelada
      }) || []

      console.log('💰 Transações encontradas para fechamento:', transacoesValidas?.length || 0)

      const valorTotal = transacoesValidas?.reduce((acc, transacao) => acc + (transacao.valor || 0), 0) || 0

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
    resumos,
    isLoading,
    fecharFatura: fecharFaturaMutation.mutate,
    isClosingFatura: fecharFaturaMutation.isPending,
  }
}
