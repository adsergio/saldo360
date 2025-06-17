
import { UseFormSetValue } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ContaFormData } from '@/types/conta'

interface ContasFormRecurrenceProps {
  recorrente: boolean
  setValue: UseFormSetValue<ContaFormData>
}

export function ContasFormRecurrence({ recorrente, setValue }: ContasFormRecurrenceProps) {
  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id="recorrente"
          checked={recorrente}
          onCheckedChange={(checked) => setValue('recorrente', checked)}
        />
        <Label htmlFor="recorrente">Conta recorrente</Label>
      </div>

      {recorrente && (
        <div className="space-y-2">
          <Label htmlFor="frequencia_recorrencia">Frequência</Label>
          <Select onValueChange={(value) => setValue('frequencia_recorrencia', value as 'mensal' | 'trimestral' | 'anual')}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a frequência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensal">Mensal</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
              <SelectItem value="anual">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  )
}
