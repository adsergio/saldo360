
import { Button } from '@/components/ui/button'
import { CreditCard, X } from 'lucide-react'

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
}

interface TransactionFormButtonsProps {
  hasSelectedCard: boolean
  isInstallmentTransaction: boolean
  editingTransaction: Transacao | null
  onInstallmentClick: () => void
  onRemoveInstallments: (installmentGroupId: string, transactionId: number) => void
}

export function TransactionFormButtons({ 
  hasSelectedCard, 
  isInstallmentTransaction, 
  editingTransaction,
  onInstallmentClick,
  onRemoveInstallments
}: TransactionFormButtonsProps) {
  return (
    <div className="space-y-2">
      {/* Mostrar botão Parcelar se: tem cartão selecionado E a transação não é parcelada */}
      {hasSelectedCard && !isInstallmentTransaction && (
        <Button
          type="button"
          variant="outline"
          onClick={onInstallmentClick}
          className="w-full"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Parcelar Compra
        </Button>
      )}
      
      {/* Mostrar botão Desfazer apenas se a transação é parcelada */}
      {isInstallmentTransaction && editingTransaction?.installment_group_id && (
        <Button
          type="button"
          variant="destructive"
          onClick={() => onRemoveInstallments(editingTransaction.installment_group_id!, editingTransaction.id)}
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          Desfazer Parcelamento
        </Button>
      )}
    </div>
  )
}
