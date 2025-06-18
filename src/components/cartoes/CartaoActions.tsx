
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { useCartaoFatura } from '@/hooks/useCartaoFatura'
import { FecharFaturaModal } from './FecharFaturaModal'
import { DeleteCartaoDialog } from './DeleteCartaoDialog'

interface Cartao {
  id: string
  nome: string
  numero?: string
  bandeira?: string
  data_vencimento: string
}

interface CartaoActionsProps {
  onRefresh: () => void
}

export function useCartaoActions({ onRefresh }: CartaoActionsProps) {
  const [faturaModal, setFaturaModal] = useState<{
    isOpen: boolean
    cartao: Cartao | null
  }>({ isOpen: false, cartao: null })
  
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    cartao: Cartao | null
  }>({ isOpen: false, cartao: null })
  
  const { user } = useAuth()
  const { toast } = useToast()
  const { resumos, fecharFatura, isClosingFatura } = useCartaoFatura()

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cartoes_credito')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting cartão:', error)
        toast({
          title: 'Erro',
          description: 'Erro ao excluir cartão',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Sucesso',
        description: 'Cartão excluído com sucesso',
      })

      onRefresh()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao excluir cartão',
        variant: 'destructive',
      })
    }
  }

  const getCartaoResumo = (cartaoId: string) => {
    return resumos.find(r => r.cartao_id === cartaoId)
  }

  const handleFecharFatura = (cartao: Cartao) => {
    setFaturaModal({ isOpen: true, cartao })
  }

  const handleDeleteClick = (cartao: Cartao) => {
    setDeleteDialog({ isOpen: true, cartao })
  }

  const confirmFecharFatura = () => {
    if (!faturaModal.cartao) return
    
    fecharFatura(faturaModal.cartao.id)
    
    setFaturaModal({ isOpen: false, cartao: null })
  }

  const FaturaModal = () => (
    faturaModal.cartao && (
      <FecharFaturaModal
        isOpen={faturaModal.isOpen}
        onClose={() => setFaturaModal({ isOpen: false, cartao: null })}
        onConfirm={confirmFecharFatura}
        cartaoNome={faturaModal.cartao.nome}
        valorTotal={getCartaoResumo(faturaModal.cartao.id)?.gastos_pendentes || 0}
        quantidadeTransacoes={0}
        isLoading={isClosingFatura}
      />
    )
  )

  const DeleteDialog = () => (
    <DeleteCartaoDialog
      isOpen={deleteDialog.isOpen}
      cartao={deleteDialog.cartao}
      onClose={() => setDeleteDialog({ isOpen: false, cartao: null })}
      onConfirm={handleDelete}
    />
  )

  return {
    getCartaoResumo,
    handleFecharFatura,
    handleDeleteClick,
    isClosingFatura,
    FaturaModal,
    DeleteDialog
  }
}
