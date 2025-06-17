
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/utils/currency'

interface CategoryExpense {
  categoria: string
  valor: number
}

interface GastosPorCategoriaProps {
  data: CategoryExpense[]
}

export function GastosPorCategoria({ data }: GastosPorCategoriaProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Gastos por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="categoria" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Valor']}
                labelStyle={{ color: '#000' }}
              />
              <Bar dataKey="valor" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>Nenhum dado de categoria disponível para o período selecionado</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
