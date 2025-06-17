
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export function useDashboardData(periodo: string) {
  const { user } = useAuth()

  // Calcular datas baseado no período
  const { startDate, endDate } = useMemo(() => {
    const now = new Date()
    let start: Date
    let end: Date = now

    switch (periodo) {
      case 'mes_passado':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        end = new Date(now.getFullYear(), now.getMonth(), 0)
        break
      case 'trimestre':
        start = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        break
      case 'ano':
        start = new Date(now.getFullYear(), 0, 1)
        break
      default: // mes_atual
        start = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    }
  }, [periodo])

  // Buscar transações
  const { data: transacoes = [] } = useQuery({
    queryKey: ['dashboard-transacoes', user?.id, startDate, endDate],
    queryFn: async () => {
      if (!user?.id) return []
      
      const { data, error } = await supabase
        .from('transacoes')
        .select(`
          *,
          categorias (
            id,
            nome
          )
        `)
        .eq('userId', user.id)
        .gte('quando', startDate)
        .lte('quando', endDate)

      if (error) {
        console.error('Erro ao buscar transações:', error)
        return []
      }

      return data || []
    },
    enabled: !!user?.id,
  })

  // Buscar lembretes
  const { data: lembretes = [] } = useQuery({
    queryKey: ['dashboard-lembretes', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      
      const { data, error } = await supabase
        .from('lembretes')
        .select('*')
        .eq('userId', user.id)
        .gte('data', new Date().toISOString())
        .order('data', { ascending: true })

      if (error) {
        console.error('Erro ao buscar lembretes:', error)
        return []
      }

      return data || []
    },
    enabled: !!user?.id,
  })

  // Calcular dados resumidos
  const summaryData = useMemo(() => {
    const receitas = transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => {
        const valor = Number(t.valor) || 0
        return acc + valor
      }, 0)
    
    const despesas = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => {
        const valor = Number(t.valor) || 0
        return acc + valor
      }, 0)
    
    const saldo = receitas - despesas

    // Agrupar por categoria (apenas despesas)
    const gastosPorCategoria = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, transaction) => {
        const categoryName = transaction.categorias?.nome || 'Sem categoria'
        const valor = Number(transaction.valor) || 0
        
        if (!acc[categoryName]) {
          acc[categoryName] = 0
        }
        
        acc[categoryName] += valor
        
        return acc
      }, {} as Record<string, number>)

    const categoryData = Object.entries(gastosPorCategoria)
      .map(([categoria, valor]) => ({ categoria, valor: Number(valor) }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 10) // Top 10 categorias

    return {
      receitas,
      despesas,
      saldo,
      totalTransacoes: transacoes.length,
      gastosPorCategoria: categoryData,
      proximoLembrete: lembretes[0] ? {
        descricao: lembretes[0].descricao || '',
        valor: Number(lembretes[0].valor) || 0,
        data: lembretes[0].data || ''
      } : undefined,
      totalLembretes: lembretes.length
    }
  }, [transacoes, lembretes])

  return {
    summaryData,
    isLoading: false
  }
}
