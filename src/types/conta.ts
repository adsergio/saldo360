
export interface Conta {
  id: string
  user_id: string
  tipo: 'pagar' | 'receber'
  descricao: string
  valor: number
  data_vencimento: string
  data_pagamento?: string
  status: 'pendente' | 'pago' | 'vencido'
  categoria_id: string
  observacoes?: string
  recorrente: boolean
  frequencia_recorrencia?: 'mensal' | 'trimestral' | 'anual'
  created_at: string
  updated_at: string
}

export interface ContaFormData {
  tipo: 'pagar' | 'receber'
  descricao: string
  valor: number
  data_vencimento: string
  categoria_id: string
  observacoes?: string
  recorrente: boolean
  frequencia_recorrencia?: 'mensal' | 'trimestral' | 'anual'
}
