
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'

interface TransactionFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  typeFilter: string
  onTypeFilterChange: (value: string) => void
  categoryFilter: string
  onCategoryFilterChange: (value: string) => void
  onClearFilters: () => void
}

export function TransactionFilters({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  onClearFilters
}: TransactionFiltersProps) {
  const hasFilters = searchTerm || typeFilter || categoryFilter

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Pesquisar por estabelecimento..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos os tipos</SelectItem>
          <SelectItem value="receita">Receitas</SelectItem>
          <SelectItem value="despesa">Despesas</SelectItem>
        </SelectContent>
      </Select>

      <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas categorias</SelectItem>
          <SelectItem value="alimentacao">Alimentação</SelectItem>
          <SelectItem value="transporte">Transporte</SelectItem>
          <SelectItem value="moradia">Moradia</SelectItem>
          <SelectItem value="saude">Saúde</SelectItem>
          <SelectItem value="educacao">Educação</SelectItem>
          <SelectItem value="lazer">Lazer</SelectItem>
          <SelectItem value="salario">Salário</SelectItem>
          <SelectItem value="investimentos">Investimentos</SelectItem>
          <SelectItem value="outros">Outros</SelectItem>
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="outline" onClick={onClearFilters} size="icon">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
