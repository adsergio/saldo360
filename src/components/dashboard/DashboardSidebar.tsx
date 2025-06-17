
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Lightbulb } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

interface ProximoLembrete {
  descricao: string
  valor: number
  data: string
}

interface DashboardSidebarProps {
  proximoLembrete?: ProximoLembrete
}

export function DashboardSidebar({ proximoLembrete }: DashboardSidebarProps) {
  const dicasDoDia = [
    "Revise seus gastos semanalmente para manter o controle financeiro.",
    "Configure lembretes para contas importantes e evite atrasos.",
    "Separe uma porcentagem da renda para emergências.",
    "Compare preços antes de fazer compras grandes.",
    "Monitore suas categorias de gastos mensalmente."
  ]

  const dicaAleatoria = dicasDoDia[Math.floor(Math.random() * dicasDoDia.length)]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-orange-600" />
            Próximo Lembrete
          </CardTitle>
        </CardHeader>
        <CardContent>
          {proximoLembrete ? (
            <div className="space-y-2">
              <h4 className="font-semibold">{proximoLembrete.descricao}</h4>
              <p className="text-lg font-bold text-orange-600">
                {formatCurrency(proximoLembrete.valor)}
              </p>
              <p className="text-sm text-muted-foreground">
                Vencimento: {new Date(proximoLembrete.data).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum lembrete pendente</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Dica do Dia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {dicaAleatoria}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
