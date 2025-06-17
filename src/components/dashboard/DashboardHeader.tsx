
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from 'lucide-react'

interface DashboardHeaderProps {
  periodo: string
  onPeriodoChange: (periodo: string) => void
}

export function DashboardHeader({ periodo, onPeriodoChange }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta! Aqui está um resumo das suas finanças.
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Select value={periodo} onValueChange={onPeriodoChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mes_atual">Este mês</SelectItem>
            <SelectItem value="mes_passado">Mês passado</SelectItem>
            <SelectItem value="trimestre">Trimestre</SelectItem>
            <SelectItem value="ano">Este ano</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
