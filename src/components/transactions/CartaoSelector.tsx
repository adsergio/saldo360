
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

  const handleValueChange = (newValue: string) => {
    // Convert "none" back to empty string for the form
    onValueChange(newValue === "none" ? "" : newValue)
  }

  const selectValue = value === "" ? "none" : value

  return (
    <Select value={selectValue} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Sem cartão</SelectItem>
        {cartoes.map((cartao) => (
          <SelectItem key={cartao.id} value={cartao.id}>
            {cartao.nome} {cartao.bandeira ? `(${cartao.bandeira})` : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
