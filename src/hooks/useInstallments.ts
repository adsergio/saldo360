
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import { addDays, format } from 'date-fns'

export function useInstallments() {
  const createInstallments = async (
    transactionData: {
      quando: string
      estabelecimento: string
      valor: number
      detalhes: string
      tipo: string
      category_id: string
      cartao_id: string
      userId: string
    },
    totalInstallments: number
  ) => {
    if (!transactionData.quando) {
      throw new Error('Data da transação é obrigatória para parcelamento')
    }

    const installmentGroupId = crypto.randomUUID()
    const installmentValue = transactionData.valor / totalInstallments
    const baseDate = new Date(transactionData.quando)

    const installmentTransactions = Array.from({ length: totalInstallments }, (_, index) => {
      // Primeira parcela mantém a data original, demais somam 30 dias
      const installmentDate = index === 0 ? baseDate : addDays(baseDate, (index) * 30)
      
      return {
        ...transactionData,
        quando: format(installmentDate, 'yyyy-MM-dd'),
        valor: installmentValue,
        is_installment: true,
        installment_group_id: installmentGroupId,
        installment_number: index + 1,
        total_installments: totalInstallments,
        detalhes: `${transactionData.detalhes ? transactionData.detalhes + ' - ' : ''}Parcela ${index + 1}/${totalInstallments}`
      }
    })

    const { error } = await supabase
      .from('transacoes')
      .insert(installmentTransactions)

    if (error) {
      console.error('Erro ao criar parcelamento:', error)
      throw error
    }

    return installmentGroupId
  }

  const removeInstallments = async (installmentGroupId: string) => {
    const { error } = await supabase
      .from('transacoes')
      .delete()
      .eq('installment_group_id', installmentGroupId)

    if (error) {
      console.error('Erro ao remover parcelamento:', error)
      throw error
    }
  }

  return {
    createInstallments,
    removeInstallments
  }
}
