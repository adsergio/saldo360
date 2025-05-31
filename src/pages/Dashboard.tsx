
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDashboardData } from '@/hooks/useDashboardData'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { DashboardSummary } from '@/components/dashboard/DashboardSummary'
import { ChatWidget } from '@/components/chat/ChatWidget'

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
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth().toString())
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString())
  const [dicaDoDia] = useState(dicas[new Date().getDate() % dicas.length])

  const { stats, transacoes, proximoLembrete, loading } = useDashboardData(filterMonth, filterYear)

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Carregando suas finanças pessoais...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-muted rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    )
  }

  // Show error state if no user
  if (!user?.id) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">Usuário não encontrado</h2>
          <p className="text-muted-foreground">Faça login para visualizar seu dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral das suas finanças pessoais
            {transacoes.length > 0 && ` • ${transacoes.length} transações encontradas`}
          </p>
        </div>
        
        <DashboardFilters
          filterMonth={filterMonth}
          filterYear={filterYear}
          setFilterMonth={setFilterMonth}
          setFilterYear={setFilterYear}
        />
      </div>

      <DashboardStats stats={stats} />

      <DashboardCharts transacoes={transacoes} />

      <DashboardSummary 
        stats={stats} 
        proximoLembrete={proximoLembrete} 
        dicaDoDia={dicaDoDia} 
      />

      <ChatWidget />
    </div>
  )
}
