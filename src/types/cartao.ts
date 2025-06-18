
export interface CartaoResumo {
  cartao_id: string
  nome_cartao: string
  gastos_pendentes: number
  quantidade_transacoes: number
  vencimento: number
}

export interface Cartao {
  id: string
  nome: string
  data_vencimento: string
}

export interface Transacao {
  id: string
  valor: number
  quando: string
  is_installment?: boolean
  installment_group_id?: string
  installment_number?: number
  total_installments?: number
}
