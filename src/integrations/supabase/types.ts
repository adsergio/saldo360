export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cartoes_credito: {
        Row: {
          bandeira: string | null
          created_at: string
          data_vencimento: string
          id: string
          nome: string
          numero: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bandeira?: string | null
          created_at?: string
          data_vencimento: string
          id?: string
          nome: string
          numero?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bandeira?: string | null
          created_at?: string
          data_vencimento?: string
          id?: string
          nome?: string
          numero?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      categorias: {
        Row: {
          created_at: string
          id: string
          nome: string
          tags: string | null
          updated_at: string
          userid: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          tags?: string | null
          updated_at?: string
          userid: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          tags?: string | null
          updated_at?: string
          userid?: string
        }
        Relationships: []
      }
      contas: {
        Row: {
          categoria_id: string
          created_at: string
          data_pagamento: string | null
          data_vencimento: string
          descricao: string
          frequencia_recorrencia: string | null
          id: string
          observacoes: string | null
          recorrente: boolean
          status: string
          tipo: string
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          categoria_id: string
          created_at?: string
          data_pagamento?: string | null
          data_vencimento: string
          descricao: string
          frequencia_recorrencia?: string | null
          id?: string
          observacoes?: string | null
          recorrente?: boolean
          status?: string
          tipo: string
          updated_at?: string
          user_id: string
          valor: number
        }
        Update: {
          categoria_id?: string
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string
          descricao?: string
          frequencia_recorrencia?: string | null
          id?: string
          observacoes?: string | null
          recorrente?: boolean
          status?: string
          tipo?: string
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_contas_categoria"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contas_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faturas_fechadas: {
        Row: {
          cartao_id: string
          created_at: string
          data_fechamento: string
          descricao: string
          id: string
          updated_at: string
          user_id: string
          valor_total: number
        }
        Insert: {
          cartao_id: string
          created_at?: string
          data_fechamento?: string
          descricao: string
          id?: string
          updated_at?: string
          user_id: string
          valor_total: number
        }
        Update: {
          cartao_id?: string
          created_at?: string
          data_fechamento?: string
          descricao?: string
          id?: string
          updated_at?: string
          user_id?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_faturas_cartao"
            columns: ["cartao_id"]
            isOneToOne: false
            referencedRelation: "cartoes_credito"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_faturas_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lembretes: {
        Row: {
          created_at: string
          data: string | null
          descricao: string | null
          id: number
          userId: string | null
          valor: number | null
        }
        Insert: {
          created_at?: string
          data?: string | null
          descricao?: string | null
          id?: number
          userId?: string | null
          valor?: number | null
        }
        Update: {
          created_at?: string
          data?: string | null
          descricao?: string | null
          id?: number
          userId?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lembretes_userid_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          assinaturaId: string | null
          ativo: boolean | null
          avatar_url: string | null
          created_at: string
          customerId: string | null
          email: string | null
          id: string
          nome: string | null
          phone: string | null
          updated_at: string
          username: string | null
          whatsapp: string | null
        }
        Insert: {
          assinaturaId?: string | null
          ativo?: boolean | null
          avatar_url?: string | null
          created_at?: string
          customerId?: string | null
          email?: string | null
          id: string
          nome?: string | null
          phone?: string | null
          updated_at?: string
          username?: string | null
          whatsapp?: string | null
        }
        Update: {
          assinaturaId?: string | null
          ativo?: boolean | null
          avatar_url?: string | null
          created_at?: string
          customerId?: string | null
          email?: string | null
          id?: string
          nome?: string | null
          phone?: string | null
          updated_at?: string
          username?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      transacoes: {
        Row: {
          cartao_id: string | null
          category_id: string
          created_at: string
          detalhes: string | null
          estabelecimento: string | null
          fatura_fechada_id: string | null
          id: number
          incluida_na_fatura: boolean
          installment_group_id: string | null
          installment_number: number | null
          is_installment: boolean | null
          quando: string | null
          tipo: string | null
          total_installments: number | null
          userId: string | null
          valor: number | null
        }
        Insert: {
          cartao_id?: string | null
          category_id: string
          created_at?: string
          detalhes?: string | null
          estabelecimento?: string | null
          fatura_fechada_id?: string | null
          id?: number
          incluida_na_fatura?: boolean
          installment_group_id?: string | null
          installment_number?: number | null
          is_installment?: boolean | null
          quando?: string | null
          tipo?: string | null
          total_installments?: number | null
          userId?: string | null
          valor?: number | null
        }
        Update: {
          cartao_id?: string | null
          category_id?: string
          created_at?: string
          detalhes?: string | null
          estabelecimento?: string | null
          fatura_fechada_id?: string | null
          id?: number
          incluida_na_fatura?: boolean
          installment_group_id?: string | null
          installment_number?: number | null
          is_installment?: boolean | null
          quando?: string | null
          tipo?: string | null
          total_installments?: number | null
          userId?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_transacoes_fatura_fechada"
            columns: ["fatura_fechada_id"]
            isOneToOne: false
            referencedRelation: "faturas_fechadas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_cartao_id_fkey"
            columns: ["cartao_id"]
            isOneToOne: false
            referencedRelation: "cartoes_credito"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transacoes_userid_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_contas_vencidas: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
