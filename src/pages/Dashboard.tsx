
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'

interface DashboardStats {
  totalReceitas: number
  totalDespesas: number
  saldo: number
  transacoesCount: number
  lembretesCount: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0,
    transacoesCount: 0,
    lembretesCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Buscar transações
      const { data: transacoes, error: transacoesError } = await supabase
        .from('transacoes')
        .select('*')
        .eq('userId', user?.id)

      if (transacoesError) throw transacoesError

      // Buscar lembretes
      const { data: lembretes, error: lembretesError } = await supabase
        .from('lembretes')
        .select('*')
        .eq('userId', user?.id)

      if (lembretesError) throw lembretesError

      // Calcular estatísticas
      const receitas = transacoes?.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + (t.valor || 0), 0) || 0
      const despesas = transacoes?.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + (t.valor || 0), 0) || 0

      setStats({
        totalReceitas: receitas,
        totalDespesas: despesas,
        saldo: receitas - despesas,
        transacoesCount: transacoes?.length || 0,
        lembretesCount: lembretes?.length || 0,
      })
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Visão geral das suas finanças pessoais</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Total de Receitas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              {formatCurrency(stats.totalReceitas)}
            </div>
            <p className="text-xs text-green-600">
              +20.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Total de Despesas
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {formatCurrency(stats.totalDespesas)}
            </div>
            <p className="text-xs text-red-600">
              +5.2% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Saldo Atual
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.saldo >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              {formatCurrency(stats.saldo)}
            </div>
            <p className="text-xs text-blue-600">
              Receitas - Despesas
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Lembretes Ativos
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {stats.lembretesCount}
            </div>
            <p className="text-xs text-purple-600">
              Pagamentos pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Mensal</CardTitle>
            <CardDescription>
              Visão geral das suas transações este mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Receitas</span>
                <span className="text-green-600 font-semibold">
                  {formatCurrency(stats.totalReceitas)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Despesas</span>
                <span className="text-red-600 font-semibold">
                  {formatCurrency(stats.totalDespesas)}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Saldo</span>
                  <span className={`font-bold ${stats.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(stats.saldo)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Suas últimas transações e lembretes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total de Transações</span>
                <span className="font-semibold">{stats.transacoesCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Lembretes Ativos</span>
                <span className="font-semibold">{stats.lembretesCount}</span>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  Mantenha suas finanças em dia! Adicione suas transações e configure lembretes para não perder prazos importantes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
