import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://quuguxkottzbdjzqherd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1dWd1eGtvdHR6YmRqenFoZXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTQ1OTMsImV4cCI6MjA2Mzc3MDU5M30.uvkxQxVuPdX9s6eosHdHkZji7e3J3hgBMUDT_57an5Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Função para limpar dados de autenticação corrompidos
export const clearAuthData = () => {
  console.log('🧹 Limpando dados de autenticação corrompidos...')
  
  // Limpar chaves específicas relacionadas à autenticação
  const authKeys = [
    'sb-quuguxkottzbdjzqherd-auth-token',
    'supabase.auth.token'
  ]
  
  authKeys.forEach(key => {
    localStorage.removeItem(key)
  })
  
  // Limpar outras chaves relacionadas à autenticação de forma mais seletiva
  Object.keys(localStorage).forEach(key => {
    if (key.includes('sb-quuguxkottzbdjzqherd') && key.includes('auth')) {
      localStorage.removeItem(key)
    }
  })
  
  console.log('🧹 Dados de autenticação limpos')
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          nome: string | null
          email: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          phone: string | null
          whatsapp: string | null
          customerId: string | null
          assinaturaId: string | null
          ativo: boolean | null
        }
        Insert: {
          id: string
          username?: string | null
          nome?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          phone?: string | null
          whatsapp?: string | null
          customerId?: string | null
          assinaturaId?: string | null
          ativo?: boolean | null
        }
        Update: {
          id?: string
          username?: string | null
          nome?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          phone?: string | null
          whatsapp?: string | null
          customerId?: string | null
          assinaturaId?: string | null
          ativo?: boolean | null
        }
      }
      transacoes: {
        Row: {
          id: number
          criado_em: string | null
          data: string
          estabelecimento: string | null
          valor: number
          detalhes: string | null
          tipo: string | null
          categoria: string | null
          usuario_id: number | null
        }
        Insert: {
          id?: number
          criado_em?: string | null
          data: string
          estabelecimento?: string | null
          valor: number
          detalhes?: string | null
          tipo?: string | null
          categoria?: string | null
          usuario_id?: number | null
        }
        Update: {
          id?: number
          criado_em?: string | null
          data?: string
          estabelecimento?: string | null
          valor?: number
          detalhes?: string | null
          tipo?: string | null
          categoria?: string | null
          usuario_id?: number | null
        }
      }
      lembretes: {
        Row: {
          id: number
          created_at: string
          userId: string | null
          descricao: string | null
          data: string | null
          valor: number | null
        }
        Insert: {
          id?: number
          created_at?: string
          userId?: string | null
          descricao?: string | null
          data?: string | null
          valor?: number | null
        }
        Update: {
          id?: number
          created_at?: string
          userId?: string | null
          descricao?: string | null
          data?: string | null
          valor?: number | null
        }
      }
      categorias: {
        Row: {
          id: string
          userid: string
          nome: string
          tags: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          userid: string
          nome: string
          tags?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          userid?: string
          nome?: string
          tags?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contas: {
        Row: {
          id: string
          user_id: string
          descricao: string
          valor: number
          data_vencimento: string
          data_pagamento: string | null
          status: string
          tipo: string
          categoria_id: string
          recorrente: boolean
          frequencia_recorrencia: string | null
          observacoes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          descricao: string
          valor: number
          data_vencimento: string
          data_pagamento?: string | null
          status?: string
          tipo: string
          categoria_id: string
          recorrente?: boolean
          frequencia_recorrencia?: string | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          descricao?: string
          valor?: number
          data_vencimento?: string
          data_pagamento?: string | null
          status?: string
          tipo?: string
          categoria_id?: string
          recorrente?: boolean
          frequencia_recorrencia?: string | null
          observacoes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
