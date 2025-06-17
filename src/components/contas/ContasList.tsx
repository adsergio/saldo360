
import { useState } from 'react'
import { ContasCard } from './ContasCard'
import { ContasFilters } from './ContasFilters'
import { useContas } from '@/hooks/useContas'

interface ContasListProps {
  tipo: 'pagar' | 'receber'
}

export function ContasList({ tipo }: ContasListProps) {
  const { contas, isLoading } = useContas(tipo)
  const [filtros, setFiltros] = useState({
    status: 'todos',
    categoria: 'todas',
    periodo: 'todos'
  })

  const contasFiltradas = contas.filter(conta => {
    if (filtros.status !== 'todos' && conta.status !== filtros.status) {
      return false
    }
    if (filtros.categoria !== 'todas' && conta.categoria_id !== filtros.categoria) {
      return false
    }
    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ContasFilters 
        filtros={filtros} 
        onFiltrosChange={setFiltros}
      />
      
      {contasFiltradas.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Nenhuma conta encontrada com os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contasFiltradas.map((conta) => (
            <ContasCard key={conta.id} conta={conta} />
          ))}
        </div>
      )}
    </div>
  )
}
