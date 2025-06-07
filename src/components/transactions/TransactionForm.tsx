import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CurrencyInput } from '@/components/ui/currency-input'
import { CategorySelector } from '@/components/transactions/CategorySelector'
import { CartaoSelector } from '@/components/transactions/CartaoSelector'
import { InstallmentModal } from '@/components/transactions/InstallmentModal'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useCategories } from '@/hooks/useCategories'
import { useInstallments } from '@/hooks/useInstallments'
import { toast } from '@/hooks/use-toast'
import { CreditCard, X } from 'lucide-react'
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
}

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingTransaction: Transacao | null
  onTransactionSaved: () => void
}

export function TransactionForm({ 
  open, 
  onOpenChange, 
  editingTransaction, 
  onTransactionSaved 
}: TransactionFormProps) {
  const { user } = useAuth()
  const { categories } = useCategories()
  const { createInstallments, removeInstallments } = useInstallments()
  const [installmentModalOpen, setInstallmentModalOpen] = useState(false)
  const [isProcessingInstallment, setIsProcessingInstallment] = useState(false)

  const [formData, setFormData] = useState({
    quando: '',
    estabelecimento: '',
    valor: 0,
    detalhes: '',
    tipo: '',
    category_id: '',
    cartao_id: '',
  })

  // Reset form when dialog opens/closes or editing transaction changes
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        quando: editingTransaction.quando || '',
        estabelecimento: editingTransaction.estabelecimento || '',
        valor: editingTransaction.valor || 0,
        detalhes: editingTransaction.detalhes || '',
        tipo: editingTransaction.tipo || '',
        category_id: editingTransaction.category_id || '',
        cartao_id: editingTransaction.cartao_id || '',
      })
    } else {
      setFormData({
        quando: '',
        estabelecimento: '',
        valor: 0,
        detalhes: '',
        tipo: '',
        category_id: '',
        cartao_id: '',
      })
    }
  }, [editingTransaction, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação: verificar se a categoria selecionada pertence ao usuário
    if (formData.category_id) {
      const categoryBelongsToUser = categories?.some(cat => cat.id === formData.category_id)
      if (!categoryBelongsToUser) {
        toast({
          title: "Erro de validação",
          description: "A categoria selecionada não é válida para este usuário.",
          variant: "destructive",
        })
        return
      }
    }

    try {
      const transacaoData = {
        quando: formData.quando,
        estabelecimento: formData.estabelecimento,
        valor: formData.valor,
        detalhes: formData.detalhes,
        tipo: formData.tipo,
        category_id: formData.category_id,
        cartao_id: formData.cartao_id || null,
        userId: user?.id,
      }

      if (editingTransaction) {
        const { error } = await supabase
          .from('transacoes')
          .update(transacaoData)
          .eq('id', editingTransaction.id)

        if (error) throw error
        toast({ title: "Transação atualizada com sucesso!" })
      } else {
        const { error } = await supabase
          .from('transacoes')
          .insert([transacaoData])

        if (error) throw error
        toast({ title: "Transação adicionada com sucesso!" })
      }

      onOpenChange(false)
      onTransactionSaved()
    } catch (error: any) {
      toast({
        title: "Erro ao salvar transação",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleInstallmentConfirm = async (installments: number) => {
    if (!user?.id) return

    setIsProcessingInstallment(true)
    try {
      const transacaoData = {
        quando: formData.quando,
        estabelecimento: formData.estabelecimento,
        valor: formData.valor,
        detalhes: formData.detalhes,
        tipo: formData.tipo,
        category_id: formData.category_id,
        cartao_id: formData.cartao_id,
        userId: user.id,
      }

      await createInstallments(transacaoData, installments)
      
      toast({ 
        title: "Parcelamento criado com sucesso!",
        description: `${installments} parcelas de ${formatCurrency(formData.valor / installments)} foram criadas.`
      })
      
      setInstallmentModalOpen(false)
      onOpenChange(false)
      onTransactionSaved()
    } catch (error: any) {
      toast({
        title: "Erro ao criar parcelamento",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsProcessingInstallment(false)
    }
  }

  const handleRemoveInstallments = async (installmentGroupId: string, transactionId: number) => {
    if (!confirm('Tem certeza que deseja desfazer todo o parcelamento? Todas as parcelas serão removidas.')) return

    try {
      await removeInstallments(installmentGroupId)
      toast({ title: "Parcelamento desfeito com sucesso!" })
      onTransactionSaved()
    } catch (error: any) {
      toast({
        title: "Erro ao desfazer parcelamento",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const hasSelectedCard = formData.cartao_id && formData.cartao_id !== ''
  const isInstallmentTransaction = editingTransaction?.is_installment

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
            </DialogTitle>
            <DialogDescription>
              {editingTransaction 
                ? 'Faça as alterações necessárias na transação.' 
                : 'Adicione uma nova receita ou despesa.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor</Label>
                <CurrencyInput
                  value={formData.valor}
                  onChange={(value) => setFormData({...formData, valor: value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estabelecimento">Estabelecimento</Label>
              <Input
                id="estabelecimento"
                placeholder="Ex: Supermercado, Salário, etc."
                value={formData.estabelecimento}
                onChange={(e) => setFormData({...formData, estabelecimento: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <CategorySelector
                value={formData.category_id}
                onValueChange={(value) => setFormData({...formData, category_id: value})}
                placeholder="Selecione a categoria"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cartao">Cartão de Crédito</Label>
              <CartaoSelector
                value={formData.cartao_id}
                onValueChange={(value) => setFormData({...formData, cartao_id: value})}
                placeholder="Selecione um cartão (opcional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quando">Data</Label>
              <Input
                id="quando"
                type="date"
                value={formData.quando}
                onChange={(e) => setFormData({...formData, quando: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="detalhes">Detalhes</Label>
              <Textarea
                id="detalhes"
                placeholder="Informações adicionais..."
                value={formData.detalhes}
                onChange={(e) => setFormData({...formData, detalhes: e.target.value})}
              />
            </div>
            
            {/* Botões de Parcelamento */}
            <div className="space-y-2">
              {/* Mostrar botão Parcelar se: tem cartão selecionado E a transação não é parcelada */}
              {hasSelectedCard && !isInstallmentTransaction && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInstallmentModalOpen(true)}
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
                  onClick={() => handleRemoveInstallments(editingTransaction.installment_group_id!, editingTransaction.id)}
                  className="w-full"
                >
                  <X className="mr-2 h-4 w-4" />
                  Desfazer Parcelamento
                </Button>
              )}
            </div>
            
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              {editingTransaction ? 'Atualizar' : 'Adicionar'} Transação
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <InstallmentModal
        open={installmentModalOpen}
        onOpenChange={setInstallmentModalOpen}
        totalValue={formData.valor}
        onConfirm={handleInstallmentConfirm}
        isLoading={isProcessingInstallment}
      />
    </>
  )
}
