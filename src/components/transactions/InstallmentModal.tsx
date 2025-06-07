
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CurrencyInput } from '@/components/ui/currency-input'

interface InstallmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  totalValue: number
  onConfirm: (installments: number) => void
  isLoading?: boolean
}

export function InstallmentModal({
  open,
  onOpenChange,
  totalValue,
  onConfirm,
  isLoading = false
}: InstallmentModalProps) {
  const [installments, setInstallments] = useState(2)

  const installmentValue = totalValue / installments

  const handleConfirm = () => {
    if (installments >= 2 && installments <= 24) {
      onConfirm(installments)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Parcelar Compra</DialogTitle>
          <DialogDescription>
            Defina o número de parcelas para dividir o valor total igualmente.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="installments">Número de Parcelas</Label>
            <Input
              id="installments"
              type="number"
              min="2"
              max="24"
              value={installments}
              onChange={(e) => setInstallments(Math.max(2, Math.min(24, parseInt(e.target.value) || 2)))}
            />
            <p className="text-sm text-muted-foreground">
              Mínimo: 2 parcelas | Máximo: 24 parcelas
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Valor Total</Label>
            <CurrencyInput
              value={totalValue}
              onChange={() => {}}
              disabled
            />
          </div>
          
          <div className="space-y-2">
            <Label>Valor por Parcela</Label>
            <CurrencyInput
              value={installmentValue}
              onChange={() => {}}
              disabled
            />
            <p className="text-sm text-muted-foreground">
              {installments}x de {installmentValue.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              })}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={isLoading || installments < 2 || installments > 24}
              className="flex-1"
            >
              {isLoading ? 'Parcelando...' : 'Confirmar Parcelamento'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
