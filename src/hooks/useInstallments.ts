
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'

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
    const installmentGroupId = crypto.randomUUID()
    const installmentValue = transactionData.valor / totalInstallments

    const installmentTransactions = Array.from({ length: totalInstallments }, (_, index) => ({
      ...transactionData,
      valor: installmentValue,
      is_installment: true,
      installment_group_id: installmentGroupId,
      installment_number: index + 1,
      total_installments: totalInstallments,
      detalhes: `${transactionData.detalhes ? transactionData.detalhes + ' - ' : ''}Parcela ${index + 1}/${totalInstallments}`
    }))

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
