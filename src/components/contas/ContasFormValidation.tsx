
import { User, Session } from '@supabase/supabase-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Category } from '@/hooks/useCategories'

interface ContasFormValidationProps {
  tipo: 'pagar' | 'receber'
  user: User | null
  session: Session | null
  categories: Category[]
  children: React.ReactNode
}

export function ContasFormValidation({ 
  tipo, 
  user, 
  session, 
  categories, 
  children 
}: ContasFormValidationProps) {
  // Verificar se há categorias
  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Nova Conta a {tipo === 'pagar' ? 'Pagar' : 'Receber'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Você precisa criar pelo menos uma categoria antes de adicionar contas.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Verificar se o usuário está autenticado
  if (!user || !session?.access_token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Nova Conta a {tipo === 'pagar' ? 'Pagar' : 'Receber'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Você precisa estar logado para criar contas.
            </p>
            <p className="text-sm text-red-500 mt-2">
              Sessão inválida ou expirada. Faça login novamente.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}
