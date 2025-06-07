
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'

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

interface TransactionCardProps {
  transacao: Transacao
  onEdit: (transacao: Transacao) => void
  onDelete: (id: number) => void
}

export function TransactionCard({ transacao, onEdit, onDelete }: TransactionCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {transacao.tipo === 'receita' ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <h3 className="font-semibold">
                {transacao.estabelecimento || 'Sem estabelecimento'}
              </h3>
              <Badge variant={transacao.tipo === 'receita' ? 'default' : 'destructive'}>
                {transacao.tipo}
              </Badge>
              {transacao.is_installment && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {transacao.installment_number}/{transacao.total_installments}
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              {transacao.categorias && (
                <p>Categoria: {transacao.categorias.nome}</p>
              )}
              {transacao.cartoes_credito && (
                <p>Cartão: {transacao.cartoes_credito.nome} {transacao.cartoes_credito.bandeira ? `(${transacao.cartoes_credito.bandeira})` : ''}</p>
              )}
              {transacao.quando && (
                <p>Data: {formatDate(transacao.quando)}</p>
              )}
              {transacao.detalhes && (
                <p>Detalhes: {transacao.detalhes}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-xl font-bold ${
              transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transacao.tipo === 'receita' ? '+' : '-'}
              {formatCurrency(Math.abs(transacao.valor || 0))}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(transacao)}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(transacao.id)}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
