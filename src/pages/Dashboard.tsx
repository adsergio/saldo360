
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDashboardData } from '@/hooks/useDashboardData'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardStatsCards } from '@/components/dashboard/DashboardStatsCards'
import { GastosPorCategoria } from '@/components/dashboard/GastosPorCategoria'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { DashboardBottomSection } from '@/components/dashboard/DashboardBottomSection'

export default function Dashboard() {
  const { user } = useAuth()
  const [periodo, setPeriodo] = useState('mes_atual')
  const { summaryData, isLoading } = useDashboardData(periodo)

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Acesso restrito</h2>
          <p className="text-muted-foreground">Faça login para acessar o dashboard</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardHeader periodo={periodo} onPeriodoChange={setPeriodo} />
      
      <DashboardStatsCards
        receitas={summaryData.receitas}
        despesas={summaryData.despesas}
        saldo={summaryData.saldo}
        lembretes={summaryData.totalLembretes}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <GastosPorCategoria data={summaryData.gastosPorCategoria} />
          <DashboardBottomSection
            receitas={summaryData.receitas}
            despesas={summaryData.despesas}
            totalTransacoes={summaryData.totalTransacoes}
          />
        </div>
        
        <div className="lg:col-span-1">
          <DashboardSidebar proximoLembrete={summaryData.proximoLembrete} />
        </div>
      </div>
    </div>
  )
}
