
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
      const formatted = formatCurrencyInput(inputValue)
      setDisplayValue(formatted)
      
      // Atualizar o valor numérico
      const numericValue = parseCurrency(formatted)
      
      // Chamar onValueChange se fornecido
      if (onValueChange) {
        onValueChange(numericValue)
      }
      
      // Criar um evento sintético para react-hook-form
      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: numericValue.toString(),
          },
        }
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
      }
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
