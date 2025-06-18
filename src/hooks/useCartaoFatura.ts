
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'

export interface CartaoResumo {
  cartao_id: string
  nome_cartao: string
  gastos_pendentes: number
  limite_disponivel: number
  vencimento: number
  limite_total: number
}

export function useCartaoFatura() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: resumos = [], isLoading } = useQuery({
    queryKey: ['cartao-resumos', user?.id],
    queryFn: async () => {
      if (!user?.id) return []

      console.log('🔍 Buscando resumos dos cartões...')

      // Primeiro, buscar todos os cartões do usuário
      const { data: cartoes, error: cartoesError } = await supabase
        .from('cartoes')
        .select('id, nome, limite, vencimento')
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
        
        // Calcular a data limite do ciclo atual
        const hoje = new Date()
        const diaHoje = hoje.getDate()
        const mesAtual = hoje.getMonth()
        const anoAtual = hoje.getFullYear()
        
        let dataLimiteCiclo: Date
        
        if (diaHoje <= cartao.vencimento) {
          // Se ainda não passou do vencimento, usar o vencimento do mês atual
          dataLimiteCiclo = new Date(anoAtual, mesAtual, cartao.vencimento)
        } else {
          // Se já passou do vencimento, usar o vencimento do próximo mês
          dataLimiteCiclo = new Date(anoAtual, mesAtual + 1, cartao.vencimento)
        }
        
        console.log(`📅 Data limite do ciclo: ${dataLimiteCiclo.toLocaleDateString('pt-BR')}`)
        
        // Buscar transações pendentes do ciclo atual
        const { data: transacoes, error: transacoesError } = await supabase
          .from('transacoes')
          .select('valor')
          .eq('cartao_id', cartao.id)
          .eq('tipo', 'despesa')
          .lte('quando', dataLimiteCiclo.toISOString())
          .order('quando', { ascending: false })

        if (transacoesError) {
          console.error(`❌ Erro ao buscar transações do cartão ${cartao.nome}:`, transacoesError)
          continue
        }

        console.log(`💰 Transações encontradas para ${cartao.nome}:`, transacoes?.length || 0)
        console.log(`💰 Valores das transações:`, transacoes?.map(t => t.valor) || [])

        const gastosPendentes = transacoes?.reduce((acc, transacao) => acc + transacao.valor, 0) || 0
        const limiteDisponivel = cartao.limite - gastosPendentes

        console.log(`💳 ${cartao.nome}: Gastos pendentes = R$ ${gastosPendentes.toFixed(2)}`)
        console.log(`💳 ${cartao.nome}: Limite disponível = R$ ${limiteDisponivel.toFixed(2)}`)

        resumos.push({
          cartao_id: cartao.id,
          nome_cartao: cartao.nome,
          gastos_pendentes: gastosPendentes,
          limite_disponivel: limiteDisponivel,
          vencimento: cartao.vencimento,
          limite_total: cartao.limite
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

      // Buscar dados do cartão
      const { data: cartao, error: cartaoError } = await supabase
        .from('cartoes')
        .select('nome, vencimento')
        .eq('id', cartaoId)
        .single()

      if (cartaoError) throw cartaoError

      // Calcular a data limite do ciclo atual (mesmo cálculo do resumo)
      const hoje = new Date()
      const diaHoje = hoje.getDate()
      const mesAtual = hoje.getMonth()
      const anoAtual = hoje.getFullYear()
      
      let dataLimiteCiclo: Date
      
      if (diaHoje <= cartao.vencimento) {
        dataLimiteCiclo = new Date(anoAtual, mesAtual, cartao.vencimento)
      } else {
        dataLimiteCiclo = new Date(anoAtual, mesAtual + 1, cartao.vencimento)
      }

      console.log('📅 Data limite para fechamento:', dataLimiteCiclo.toLocaleDateString('pt-BR'))

      // Buscar transações do ciclo atual
      const { data: transacoes, error: transacoesError } = await supabase
        .from('transacoes')
        .select('*')
        .eq('cartao_id', cartaoId)
        .eq('tipo', 'despesa')
        .lte('quando', dataLimiteCiclo.toISOString())

      if (transacoesError) throw transacoesError

      console.log('💰 Transações encontradas para fechamento:', transacoes?.length || 0)

      const valorTotal = transacoes?.reduce((acc, transacao) => acc + transacao.valor, 0) || 0

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
          user_id: user.id,
          tipo: 'despesa',
          valor: valorTotal,
          descricao: `Fatura ${cartao.nome} - ${dataLimiteCiclo.toLocaleDateString('pt-BR')}`,
          quando: dataVencimento.toISOString(),
          categoria_id: null, // Fatura não tem categoria específica
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
