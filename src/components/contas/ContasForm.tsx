
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CurrencyInput } from '@/components/ui/currency-input'
import { useCategories } from '@/hooks/useCategories'
import { useContas, type ContaFormData } from '@/hooks/useContas'

const contaSchema = z.object({
  tipo: z.enum(['pagar', 'receber']),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
  data_vencimento: z.string().min(1, 'Data de vencimento é obrigatória'),
  categoria_id: z.string().min(1, 'Categoria é obrigatória'),
  observacoes: z.string().optional(),
  recorrente: z.boolean(),
  frequencia_recorrencia: z.enum(['mensal', 'trimestral', 'anual']).optional(),
})

interface ContasFormProps {
  tipo: 'pagar' | 'receber'
  onSuccess?: () => void
}

export function ContasForm({ tipo, onSuccess }: ContasFormProps) {
  const { categories } = useCategories()
  const { createConta } = useContas()
  const [valor, setValor] = useState<number>(0)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContaFormData>({
    resolver: zodResolver(contaSchema),
    defaultValues: {
      tipo,
      recorrente: false,
    },
  })

  const recorrente = watch('recorrente')

  const onSubmit = async (data: ContaFormData) => {
    try {
      await createConta.mutateAsync({
        ...data,
        valor,
      })
      reset()
      setValor(0)
      onSuccess?.()
    } catch (error) {
      console.error('Error creating conta:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Nova Conta a {tipo === 'pagar' ? 'Pagar' : 'Receber'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                value={valor}
                onValueChange={setValor}
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

          <Button 
            type="submit" 
            className="w-full"
            disabled={createConta.isPending}
          >
            {createConta.isPending ? 'Criando...' : 'Criar Conta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
