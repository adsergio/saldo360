
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { TrendingUp, TrendingDown, DollarSign, Calendar, Filter, Lightbulb } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface DashboardStats {
  totalReceitas: number
  totalDespesas: number
  saldo: number
  transacoesCount: number
  lembretesCount: number
}

interface Transacao {
  id: number
  created_at: string
  quando: string | null
  estabelecimento: string | null
  valor: number | null
  detalhes: string | null
  tipo: string | null
  categoria: string | null
  userId: string | null
}

interface Lembrete {
  id: number
  created_at: string
  userId: string | null
  descricao: string | null
  data: string | null
  valor: number | null
}

const COLORS = ['#4361ee', '#7209b7', '#f72585', '#4cc9f0', '#4895ef', '#4361ee']

const dicas = [
  "💡 Sempre registre suas despesas no mesmo dia para não esquecer",
  "💡 Defina metas mensais de economia e acompanhe seu progresso",
  "💡 Categorize suas despesas para identificar onde gasta mais",
  "💡 Configure lembretes para não perder datas de pagamento",
  "💡 Revise seus gastos semanalmente para manter o controle",
  "💡 Separe uma quantia fixa para emergências todo mês"
]

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalReceitas: 0,
    totalDespesas: 0,
    saldo: 0,
    transacoesCount: 0,
    lembretesCount: 0,
  })
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [lembretes, setLembretes] = useState<Lembrete[]>([])
  const [loading, setLoading] = useState(true)
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth().toString())
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString())
  const [dicaDoDia] = useState(dicas[new Date().getDate() % dicas.length])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user, filterMonth, filterYear])

  const fetchDashboardData = async () => {
    try {
      // Buscar transações com filtro
      const startDate = new Date(parseInt(filterYear), parseInt(filterMonth), 1)
      const endDate = new Date(parseInt(filterYear), parseInt(filterMonth) + 1, 0)

      const { data: transacoes, error: transacoesError } = await supabase
        .from('transacoes')
        .select('*')
        .eq('userId', user?.id)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      if (transacoesError) throw transacoesError

      // Buscar lembretes
      const { data: lembretes, error: lembretesError } = await supabase
        .from('lembretes')
        .select('*')
        .eq('userId', user?.id)
        .gte('data', startDate.toISOString().split('T')[0])
        .lte('data', endDate.toISOString().split('T')[0])

      if (lembretesError) throw lembretesError

      setTransacoes(transacoes || [])
      setLembretes(lembretes || [])

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

  const getChartData = () => {
    const categorias: { [key: string]: number } = {}
    
    transacoes.forEach(t => {
      if (t.categoria && t.valor) {
        categorias[t.categoria] = (categorias[t.categoria] || 0) + Math.abs(t.valor)
      }
    })

    return Object.entries(categorias).map(([categoria, valor]) => ({
      categoria,
      valor
    }))
  }

  const getPieData = () => {
    const receitas = transacoes.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + (t.valor || 0), 0)
    const despesas = transacoes.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + (t.valor || 0), 0)

    return [
      { name: 'Receitas', value: receitas },
      { name: 'Despesas', value: despesas }
    ]
  }

  const proximoLembrete = lembretes
    .filter(l => l.data && new Date(l.data) >= new Date())
    .sort((a, b) => new Date(a.data!).getTime() - new Date(b.data!).getTime())[0]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-24 mb-2"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral das suas finanças pessoais</p>
        </div>
        
        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {new Date(0, i).toLocaleDateString('pt-BR', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
              Total de Receitas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {formatCurrency(stats.totalReceitas)}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Mês atual
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
              Total de Despesas
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              {formatCurrency(stats.totalDespesas)}
            </div>
            <p className="text-xs text-red-600 dark:text-red-400">
              Mês atual
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Saldo Atual
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.saldo >= 0 ? 'text-primary' : 'text-red-700 dark:text-red-400'}`}>
              {formatCurrency(stats.saldo)}
            </div>
            <p className="text-xs text-primary">
              Receitas - Despesas
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Lembretes Ativos
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {stats.lembretesCount}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Este mês
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>
              Distribuição dos seus gastos no período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="valor" fill="#4361ee" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximo Lembrete
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proximoLembrete ? (
                <div className="space-y-2">
                  <p className="font-medium">{proximoLembrete.descricao}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(proximoLembrete.data!).toLocaleDateString('pt-BR')}
                  </p>
                  {proximoLembrete.valor && (
                    <p className="text-sm font-medium text-primary">
                      {formatCurrency(proximoLembrete.valor)}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum lembrete próximo</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Dica do Dia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{dicaDoDia}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receitas vs Despesas</CardTitle>
            <CardDescription>
              Proporção entre receitas e despesas do período
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getPieData()}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  >
                    {getPieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Período</CardTitle>
            <CardDescription>
              Estatísticas detalhadas do período selecionado
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
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span>Total de Transações</span>
                  <span className="font-semibold">{stats.transacoesCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span>Lembretes Ativos</span>
                  <span className="font-semibold">{stats.lembretesCount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
