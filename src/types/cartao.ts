
export interface FaturaFechada {
  id: string
  cartao_id: string
  user_id: string
  valor_total: number
  data_fechamento: string
  descricao: string
}

export interface CartaoResumo {
  cartao_id: string
  total_gastos: number
  quantidade_transacoes: number
}

export interface Cartao {
  id: string
  nome: string
  numero?: string
  bandeira?: string
  data_vencimento: string
}
