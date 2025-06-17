
import { UseFormRegister, UseFormSetValue, FieldErrors } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CurrencyInput } from '@/components/ui/currency-input'
import { useCategories } from '@/hooks/useCategories'
import type { ContaFormData } from '@/types/conta'

interface ContasFormFieldsProps {
  register: UseFormRegister<ContaFormData>
  setValue: UseFormSetValue<ContaFormData>
  errors: FieldErrors<ContaFormData>
  valor: number
}

export function ContasFormFields({ register, setValue, errors, valor }: ContasFormFieldsProps) {
  const { categories } = useCategories()

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Input
            id="descricao"
            {...register('descricao')}
            placeholder="Descrição da conta"
          />
          {errors.descricao && (
            <p className="text-sm text-red-500">{errors.descricao.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor">Valor</Label>
          <CurrencyInput
            {...register('valor', { valueAsNumber: true })}
            value={valor}
            onValueChange={(newValue) => setValue('valor', newValue)}
            placeholder="R$ 0,00"
          />
          {errors.valor && (
            <p className="text-sm text-red-500">{errors.valor.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_vencimento">Data de Vencimento</Label>
          <Input
            id="data_vencimento"
            type="date"
            {...register('data_vencimento')}
          />
          {errors.data_vencimento && (
            <p className="text-sm text-red-500">{errors.data_vencimento.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria_id">Categoria</Label>
          <Select onValueChange={(value) => setValue('categoria_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((categoria) => (
                <SelectItem key={categoria.id} value={categoria.id}>
                  {categoria.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoria_id && (
            <p className="text-sm text-red-500">{errors.categoria_id.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          {...register('observacoes')}
          placeholder="Observações adicionais (opcional)"
          rows={3}
        />
      </div>
    </>
  )
}
