
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCartoes } from '@/hooks/useCartoes'

interface CartaoSelectorProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function CartaoSelector({ value, onValueChange, placeholder = "Selecione um cartão" }: CartaoSelectorProps) {
  const { cartoes, isLoading } = useCartoes()

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Carregando cartões..." />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">Sem cartão</SelectItem>
        {cartoes.map((cartao) => (
          <SelectItem key={cartao.id} value={cartao.id}>
            {cartao.nome} {cartao.bandeira ? `(${cartao.bandeira})` : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
