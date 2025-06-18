
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { Pencil, Trash2, CreditCard } from 'lucide-react'
import { CartaoResumo } from '@/hooks/useCartaoFatura'

interface Cartao {
  id: string
  nome: string
  numero?: string
  bandeira?: string
  data_vencimento: string
}

interface CartaoTableRowProps {
  cartao: Cartao
  resumo: CartaoResumo | undefined
  onEdit: (cartao: Cartao) => void
  onFecharFatura: (cartao: Cartao) => void
  onDelete: (cartao: Cartao) => void
  isClosingFatura: boolean
}

export function CartaoTableRow({
  cartao,
  resumo,
  onEdit,
  onFecharFatura,
  onDelete,
  isClosingFatura
}: CartaoTableRowProps) {
  const formatCardNumber = (numero?: string) => {
    if (!numero) return '-'
    return `**** **** **** ${numero.slice(-4)}`
  }

  const formatDiaVencimento = (dia: string) => {
    return `Dia ${dia}`
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{cartao.nome}</TableCell>
      <TableCell>{cartao.bandeira || '-'}</TableCell>
      <TableCell>{formatCardNumber(cartao.numero)}</TableCell>
      <TableCell>{formatDiaVencimento(cartao.data_vencimento)}</TableCell>
      <TableCell>
        {resumo ? (
          <div className="text-sm">
            <div className="font-medium">
              R$ {resumo.gastos_pendentes.toFixed(2)}
            </div>
            <div className="text-muted-foreground">
              Gastos pendentes
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">R$ 0,00</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(cartao)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          
          {resumo && resumo.gastos_pendentes > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onFecharFatura(cartao)}
              disabled={isClosingFatura}
              className="text-blue-600 hover:text-blue-700"
            >
              <CreditCard className="h-4 w-4 mr-1" />
              Fechar Fatura
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(cartao)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
