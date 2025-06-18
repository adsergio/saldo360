
import { Transacao } from '@/types/cartao'

export function calcularDataLimiteCiclo(diaVencimento: number): Date {
  const hoje = new Date()
  const mesAtual = hoje.getMonth()
  const anoAtual = hoje.getFullYear()
  
  // Usar o mês atual para o vencimento
  return new Date(anoAtual, mesAtual, diaVencimento, 23, 59, 59)
}

export function filtrarTransacoesValidas(
  todasTransacoes: Transacao[],
  dataLimiteCiclo: Date
): Transacao[] {
  return todasTransacoes?.filter(transacao => {
    if (!transacao.quando) return false
    
    // Normalizar a data da transação
    let dataTransacao: Date
    if (transacao.quando.includes('T')) {
      dataTransacao = new Date(transacao.quando)
    } else {
      dataTransacao = new Date(transacao.quando + 'T00:00:00')
    }
    
    // Verificar se está dentro do ciclo
    const dentoDoCiclo = dataTransacao <= dataLimiteCiclo
    if (!dentoDoCiclo) {
      console.log(`📝 Transação ${transacao.quando}: ❌ Fora do ciclo`)
      return false
    }

    // Se é uma parcela, incluir
    if (transacao.is_installment) {
      console.log(`📝 Parcela ${transacao.installment_number}/${transacao.total_installments}: ✅ Incluída`)
      return true
    }

    // Se não é parcela, verificar se não foi parcelada
    const foiParcelada = todasTransacoes?.some(t => 
      t.installment_group_id && 
      t.is_installment && 
      Math.abs(new Date(t.quando).getTime() - dataTransacao.getTime()) < 24 * 60 * 60 * 1000 // mesmo dia
    )

    if (foiParcelada) {
      console.log(`📝 Transação ${transacao.quando}: ❌ Foi parcelada (excluída)`)
      return false
    }

    console.log(`📝 Transação ${transacao.quando}: ✅ Incluída`)
    return true
  }) || []
}

export function calcularResumoCartao(
  transacoesValidas: Transacao[]
): { gastos_pendentes: number; quantidade_transacoes: number } {
  const gastos_pendentes = transacoesValidas?.reduce((acc, transacao) => acc + (transacao.valor || 0), 0) || 0
  const quantidade_transacoes = transacoesValidas?.length || 0
  
  return { gastos_pendentes, quantidade_transacoes }
}
