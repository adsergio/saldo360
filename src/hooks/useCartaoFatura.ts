
import { useCartaoResumos } from './useCartaoResumos'
import { useFecharFatura } from './useFecharFatura'

export type { FaturaFechada, CartaoResumo } from '@/types/cartao'

export function useCartaoFatura() {
  const { resumosCartao, isLoading } = useCartaoResumos()
  const { fecharFatura, isClosingFatura } = useFecharFatura()

  return {
    resumosCartao,
    isLoading,
    fecharFatura,
    isClosingFatura
  }
}
