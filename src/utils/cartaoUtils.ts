
// Função para calcular o período do ciclo atual baseado na data de vencimento
export const calcularPeriodoCiclo = (dataVencimento: string): string => {
  const hoje = new Date()
  const diaVencimento = parseInt(dataVencimento)
  
  // Criar data de vencimento do mês atual
  const vencimentoMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), diaVencimento)
  
  let dataLimiteCiclo: Date
  
  // Se já passou do dia de vencimento no mês atual, o ciclo atual terminou no vencimento deste mês
  if (hoje > vencimentoMesAtual) {
    dataLimiteCiclo = vencimentoMesAtual
  } else {
    // Se ainda não chegou no vencimento do mês atual, o ciclo atual termina no vencimento do mês anterior
    dataLimiteCiclo = new Date(hoje.getFullYear(), hoje.getMonth() - 1, diaVencimento)
  }
  
  return dataLimiteCiclo.toISOString().split('T')[0] // Retorna no formato YYYY-MM-DD
}
