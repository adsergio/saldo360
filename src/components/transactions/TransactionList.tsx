
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TransactionCard } from '@/components/transactions/TransactionCard'

interface Transacao {
  id: number
  created_at: string
  quando: string | null
  estabelecimento: string | null
  valor: number | null
  detalhes: string | null
  tipo: string | null
  category_id: string
  cartao_id: string | null
  userId: string | null
  is_installment: boolean | null
  installment_group_id: string | null
  installment_number: number | null
  total_installments: number | null
  categorias?: {
    id: string
    nome: string
  }
  cartoes_credito?: {
    id: string
    nome: string
    bandeira?: string
  }
}

interface TransactionListProps {
  transactions: Transacao[]
  loading: boolean
  totalTransactions: number
  onEdit: (transacao: Transacao) => void
  onDelete: (id: number) => void
  onAddFirst: () => void
}

export function TransactionList({ 
  transactions, 
  loading, 
  totalTransactions, 
  onEdit, 
  onDelete, 
  onAddFirst 
}: TransactionListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground mb-4">
            {totalTransactions === 0 ? 'Nenhuma transação encontrada' : 'Nenhuma transação encontrada com os filtros aplicados'}
          </p>
          <Button onClick={onAddFirst} className="bg-primary hover:bg-primary/90">
            Adicionar primeira transação
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {transactions.map((transacao) => (
        <TransactionCard
          key={transacao.id}
          transacao={transacao}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
