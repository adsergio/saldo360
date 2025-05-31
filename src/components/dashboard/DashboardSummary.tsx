
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Lightbulb } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

interface Lembrete {
  id: number
  created_at: string
  userId: string | null
  descricao: string | null
  data: string | null
  valor: number | null
}

interface DashboardSummaryProps {
  stats: {
    totalReceitas: number
    totalDespesas: number
    saldo: number
    transacoesCount: number
    lembretesCount: number
  }
  proximoLembrete: Lembrete | undefined
  dicaDoDia: string
}

export function DashboardSummary({ stats, proximoLembrete, dicaDoDia }: DashboardSummaryProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

      <Card className="md:col-span-2">
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
  )
}
