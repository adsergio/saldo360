
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCategories } from '@/hooks/useCategories'
import { useContas } from '@/hooks/useContas'
import { useAuth } from '@/hooks/useAuth'
import { ContasFormFields } from './ContasFormFields'
import { ContasFormRecurrence } from './ContasFormRecurrence'
import { ContasFormValidation } from './ContasFormValidation'
import type { ContaFormData } from '@/types/conta'

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
  const { createConta, isCreating } = useContas()
  const { user, session } = useAuth()

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
      valor: 0,
    },
  })

  const recorrente = watch('recorrente')
  const valor = watch('valor')

  console.log('💰 ContasForm current valor:', valor, typeof valor)

  const onSubmit = async (data: ContaFormData) => {
    console.log('📝 Form submitted with data:', data)
    console.log('📝 Valor type and value:', typeof data.valor, data.valor)
    console.log('📝 User authenticated:', !!user)
    console.log('📝 Session valid:', !!session?.access_token)

    // Verificar se o valor é válido
    if (isNaN(data.valor) || data.valor <= 0) {
      console.error('📝 Invalid valor:', data.valor)
      return
    }

    // Verificações de autenticação mais rigorosas
    if (!user) {
      console.error('📝 User not authenticated')
      return
    }

    if (!session?.access_token) {
      console.error('📝 No valid session')
      return
    }

    // Verificar se a sessão não expirou
    if (session.expires_at && session.expires_at * 1000 < Date.now()) {
      console.error('📝 Session expired')
      return
    }

    try {
      await createConta(data)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error('📝 Error creating conta:', error)
    }
  }

  return (
    <ContasFormValidation 
      tipo={tipo}
      user={user}
      session={session}
      categories={categories}
    >
      <Card>
        <CardHeader>
          <CardTitle>
            Nova Conta a {tipo === 'pagar' ? 'Pagar' : 'Receber'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ContasFormFields
              register={register}
              setValue={setValue}
              errors={errors}
              valor={valor}
            />

            <ContasFormRecurrence
              recorrente={recorrente}
              setValue={setValue}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={
                isCreating || 
                !user || 
                !session?.access_token ||
                (session.expires_at && session.expires_at * 1000 < Date.now()) ||
                isNaN(valor) ||
                valor <= 0
              }
            >
              {isCreating ? 'Criando...' : 'Criar Conta'}
            </Button>

            {(!user || !session?.access_token) && (
              <p className="text-sm text-red-500 text-center">
                Você precisa estar logado para criar contas.
              </p>
            )}

            {session?.expires_at && session.expires_at * 1000 < Date.now() && (
              <p className="text-sm text-red-500 text-center">
                Sua sessão expirou. Faça login novamente.
              </p>
            )}

            {(isNaN(valor) || valor <= 0) && (
              <p className="text-sm text-red-500 text-center">
                Por favor, insira um valor válido maior que zero.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </ContasFormValidation>
  )
}
