
import React, { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { formatCurrencyInput, formatExistingValue, parseCurrency } from '@/utils/currency'
import { cn } from '@/lib/utils'

interface CurrencyInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  value?: string | number
  onValueChange?: (value: number) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onValueChange, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('')

    React.useEffect(() => {
      console.log('💰 CurrencyInput value prop changed:', value, typeof value)
      
      if (value !== undefined && value !== null) {
        const numValue = typeof value === 'string' ? parseFloat(value) : value
        if (!isNaN(numValue) && numValue > 0) {
          setDisplayValue(formatExistingValue(numValue))
        } else {
          setDisplayValue('')
        }
      } else {
        setDisplayValue('')
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      console.log('💰 CurrencyInput input value:', inputValue)
      
      const formatted = formatCurrencyInput(inputValue)
      console.log('💰 CurrencyInput formatted:', formatted)
      
      setDisplayValue(formatted)
      
      // Parsear o valor numérico
      const numericValue = parseCurrency(formatted)
      console.log('💰 CurrencyInput numeric value:', numericValue)
      
      // Garantir que sempre seja um número válido
      const validValue = isNaN(numericValue) ? 0 : numericValue
      
      // Chamar onValueChange se fornecido
      if (onValueChange) {
        console.log('💰 CurrencyInput calling onValueChange with:', validValue)
        onValueChange(validValue)
      }
      
      // NÃO chamar onChange para evitar dupla manipulação com react-hook-form
      // O react-hook-form será atualizado via setValue no componente pai
    }

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        className={cn(className)}
        placeholder="R$ 0,00"
      />
    )
  }
)

CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
