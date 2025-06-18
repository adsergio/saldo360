
import { useCartaoResumos } from './useCartaoResumos'
import { useFecharFatura } from './useFecharFatura'

export type { CartaoResumo } from '@/types/cartao'

export function useCartaoFatura() {
  const { resumos, isLoading } = useCartaoResumos()
  const { fecharFatura, isClosingFatura } = useFecharFatura()

  return {
    resumos,
    isLoading,
    fecharFatura,
    isClosingFatura,
  }
}
