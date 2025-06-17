
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '@/utils/currency'

interface DashboardBottomSectionProps {
  receitas: number
  despesas: number
  totalTransacoes: number
}

export function DashboardBottomSection({ receitas, despesas, totalTransacoes }: DashboardBottomSectionProps) {
  const chartData = [
    { name: 'Receitas', value: receitas, color: '#22c55e' },
    { name: 'Despesas', value: despesas, color: '#ef4444' }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Receitas vs Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          {receitas > 0 || despesas > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              <p>Nenhum dado disponível para o período selecionado</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo do Período</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total de Transações:</span>
            <span className="font-semibold">{totalTransacoes}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Maior Entrada:</span>
            <span className="font-semibold text-green-600">{formatCurrency(receitas)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Maior Saída:</span>
            <span className="font-semibold text-red-600">{formatCurrency(despesas)}</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Resultado:</span>
              <span className={`font-bold ${receitas - despesas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(receitas - despesas)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
