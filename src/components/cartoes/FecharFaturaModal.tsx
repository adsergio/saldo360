
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface FecharFaturaModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  cartaoNome: string
  valorTotal: number
  quantidadeTransacoes: number
  isLoading: boolean
}

export function FecharFaturaModal({
  isOpen,
  onClose,
  onConfirm,
  cartaoNome,
  valorTotal,
  quantidadeTransacoes,
  isLoading
}: FecharFaturaModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Fechar Fatura do Cartão</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                Você está prestes a fechar a fatura do cartão <strong>{cartaoNome}</strong>.
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm">
                  <strong>Resumo da fatura:</strong>
                </p>
                <p className="text-sm">
                  • {quantidadeTransacoes} transação(ões) pendente(s)
                </p>
                <p className="text-sm">
                  • Valor total: <strong>R$ {valorTotal.toFixed(2)}</strong>
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Após o fechamento, as transações individuais serão consolidadas em um único lançamento 
                e não aparecerão mais separadamente nos relatórios.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Fechando...' : 'Fechar Fatura'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
