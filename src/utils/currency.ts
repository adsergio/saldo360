
export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) return 'R$ 0,00'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue)
}

export const parseCurrency = (value: string): number => {
  console.log('💰 parseCurrency input:', value)
  
  if (!value || typeof value !== 'string') {
    console.log('💰 parseCurrency: empty or invalid input')
    return 0
  }
  
  // Remove todos os caracteres que não são números, vírgula ou ponto
  let cleaned = value.replace(/[^\d,.-]/g, '')
  console.log('💰 parseCurrency cleaned:', cleaned)
  
  // Se tem vírgula, assumir formato brasileiro (1.000,50)
  if (cleaned.includes(',')) {
    // Remover pontos (separadores de milhares) e trocar vírgula por ponto
    cleaned = cleaned.replace(/\./g, '').replace(',', '.')
  }
  
  const result = parseFloat(cleaned)
  console.log('💰 parseCurrency result:', result)
  
  return isNaN(result) ? 0 : result
}

export const formatCurrencyInput = (value: string): string => {
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '')
  
  if (!numbers) return ''
  
  // Converte para centavos
  const cents = parseInt(numbers)
  const reais = cents / 100
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(reais)
}

// Nova função para formatar valores existentes para exibição no input
export const formatExistingValue = (value: number): string => {
  if (isNaN(value) || value === 0) return ''
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
