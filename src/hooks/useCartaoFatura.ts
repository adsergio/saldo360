
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
        
        // Calcular a data limite do ciclo atual
        const hoje = new Date()
        const diaHoje = hoje.getDate()
        const mesAtual = hoje.getMonth()
        const anoAtual = hoje.getFullYear()
        
        let dataLimiteCiclo: Date
        
        if (diaHoje <= diaVencimento) {
          // Se ainda não passou do vencimento, usar o vencimento do mês atual
          dataLimiteCiclo = new Date(anoAtual, mesAtual, diaVencimento, 23, 59, 59)
        } else {
          // Se já passou do vencimento, usar o vencimento do próximo mês
          dataLimiteCiclo = new Date(anoAtual, mesAtual + 1, diaVencimento, 23, 59, 59)
        }
        
        console.log(`📅 Data limite do ciclo: ${dataLimiteCiclo.toLocaleDateString('pt-BR')}`)
        
        // Buscar transações pendentes do ciclo atual
        const { data: transacoes, error: transacoesError } = await supabase
          .from('transacoes')
          .select('valor, quando')
          .eq('cartao_id', cartao.id)
          .eq('tipo', 'despesa')
          .lte('quando', dataLimiteCiclo.toISOString())
          .order('quando', { ascending: false })

        if (transacoesError) {
          console.error(`❌ Erro ao buscar transações do cartão ${cartao.nome}:`, transacoesError)
          continue
        }

        // Filtrar transações por data para garantir que estão dentro do ciclo
        const transacoesFiltradas = transacoes?.filter(transacao => {
          if (!transacao.quando) return false
          
          // Normalizar a data da transação (pode vir como string simples ou ISO)
          let dataTransacao: Date
          if (transacao.quando.includes('T')) {
            // Data ISO completa
            dataTransacao = new Date(transacao.quando)
          } else {
            // Data simples (YYYY-MM-DD)
            dataTransacao = new Date(transacao.quando + 'T00:00:00')
          }
          
          // Verificar se a transação está dentro do ciclo
          const dentoDoCiclo = dataTransacao <= dataLimiteCiclo
          
          console.log(`📝 Transação ${transacao.quando}: ${dentoDoCiclo ? '✅ Incluída' : '❌ Excluída'} (limite: ${dataLimiteCiclo.toLocaleDateString('pt-BR')})`)
          
          return dentoDoCiclo
        }) || []

        console.log(`💰 Transações válidas para ${cartao.nome}:`, transacoesFiltradas?.length || 0)
        console.log(`💰 Valores das transações:`, transacoesFiltradas?.map(t => t.valor) || [])

        const gastosPendentes = transacoesFiltradas?.reduce((acc, transacao) => acc + (transacao.valor || 0), 0) || 0

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

      // Calcular a data limite do ciclo atual (mesma lógica do resumo)
      const hoje = new Date()
      const diaHoje = hoje.getDate()
      const mesAtual = hoje.getMonth()
      const anoAtual = hoje.getFullYear()
      
      let dataLimiteCiclo: Date
      
      if (diaHoje <= diaVencimento) {
        dataLimiteCiclo = new Date(anoAtual, mesAtual, diaVencimento, 23, 59, 59)
      } else {
        dataLimiteCiclo = new Date(anoAtual, mesAtual + 1, diaVencimento, 23, 59, 59)
      }

      console.log('📅 Data limite para fechamento:', dataLimiteCiclo.toLocaleDateString('pt-BR'))

      // Buscar transações do ciclo atual (mesma lógica do resumo)
      const { data: transacoes, error: transacoesError } = await supabase
        .from('transacoes')
        .select('*')
        .eq('cartao_id', cartaoId)
        .eq('tipo', 'despesa')
        .lte('quando', dataLimiteCiclo.toISOString())

      if (transacoesError) throw transacoesError

      // Filtrar transações por data
      const transacoesFiltradas = transacoes?.filter(transacao => {
        if (!transacao.quando) return false
        
        let dataTransacao: Date
        if (transacao.quando.includes('T')) {
          dataTransacao = new Date(transacao.quando)
        } else {
          dataTransacao = new Date(transacao.quando + 'T00:00:00')
        }
        
        return dataTransacao <= dataLimiteCiclo
      }) || []

      console.log('💰 Transações encontradas para fechamento:', transacoesFiltradas?.length || 0)

      const valorTotal = transacoesFiltradas?.reduce((acc, transacao) => acc + (transacao.valor || 0), 0) || 0

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
