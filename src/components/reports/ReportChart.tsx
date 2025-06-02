
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'

interface ChartData {
  name: string
  value: number
  color: string
}

interface CategoryData {
  [key: string]: {
    receitas: number
    despesas: number
    total: number
  }
}

interface ReportChartProps {
  chartData: ChartData[]
  categoryData: CategoryData
}

const chartConfig = {
  receitas: {
    label: "Receitas",
    color: "#22c55e",
  },
  despesas: {
    label: "Despesas", 
    color: "#ef4444",
  },
}

export function ReportChart({ chartData, categoryData }: ReportChartProps) {
  // Prepare category chart data - filter out empty categories
  const categoryChartData = Object.entries(categoryData)
    .filter(([name, data]) => data.despesas > 0 || data.receitas > 0)
    .map(([name, data]) => ({
      category: name,
      receitas: data.receitas,
      despesas: Math.abs(data.despesas), // Ensure positive values for display
    }))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Tipo</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
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
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Receitas vs Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryChartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={categoryChartData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                >
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="receitas" fill="#22c55e" name="Receitas" />
                  <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p>Nenhum dado de categoria disponível para o período selecionado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
