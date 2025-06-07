
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CurrencyInput } from '@/components/ui/currency-input'
import { addDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface InstallmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  totalValue: number
  transactionDate: string
  onConfirm: (installments: number) => void
  isLoading?: boolean
}

export function InstallmentModal({
  open,
  onOpenChange,
  totalValue,
  transactionDate,
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

  const generateInstallmentDates = () => {
    if (!transactionDate) return []
    
    const baseDate = new Date(transactionDate)
    return Array.from({ length: installments }, (_, index) => {
      const installmentDate = index === 0 ? baseDate : addDays(baseDate, index * 30)
      return {
        number: index + 1,
        date: installmentDate,
        value: installmentValue
      }
    })
  }

  const installmentDates = generateInstallmentDates()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
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
          </div>

          {transactionDate && installmentDates.length > 0 && (
            <div className="space-y-2">
              <Label>Cronograma das Parcelas</Label>
              <div className="max-h-32 overflow-y-auto border rounded-md p-2">
                {installmentDates.map((installment) => (
                  <div key={installment.number} className="flex justify-between items-center py-1 text-sm">
                    <span>Parcela {installment.number}/{installments}</span>
                    <span>{format(installment.date, 'dd/MM/yyyy', { locale: ptBR })}</span>
                    <span className="font-medium">
                      {installment.value.toLocaleString('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
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
              disabled={isLoading || installments < 2 || installments > 24 || !transactionDate}
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
