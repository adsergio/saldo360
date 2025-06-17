
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { useCategories } from '@/hooks/useCategories'

interface ContasFiltersProps {
  filtros: {
    status: string
    categoria: string
    periodo: string
  }
  onFiltrosChange: (filtros: any) => void
}

export function ContasFilters({ filtros, onFiltrosChange }: ContasFiltersProps) {
  const { categories } = useCategories()

  const handleStatusChange = (value: string) => {
    onFiltrosChange({ ...filtros, status: value })
  }

  const handleCategoriaChange = (value: string) => {
    onFiltrosChange({ ...filtros, categoria: value })
  }

  const handlePeriodoChange = (value: string) => {
    onFiltrosChange({ ...filtros, periodo: value })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={filtros.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select value={filtros.categoria} onValueChange={handleCategoriaChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {categories.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <Select value={filtros.periodo} onValueChange={handlePeriodoChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="vencendo">Vencendo (próximos 7 dias)</SelectItem>
                <SelectItem value="mes_atual">Mês atual</SelectItem>
                <SelectItem value="mes_passado">Mês passado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
