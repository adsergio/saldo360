import { useState, useEffect, createContext, useContext } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { validateWhatsAppNumber } from '@/utils/whatsapp'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, nome: string, phone?: string, whatsapp?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, nome: string, phone?: string, whatsapp?: string) => {
    try {
      let whatsappId = whatsapp

      // Se um telefone foi fornecido, validar o WhatsApp
      if (phone) {
        console.log('Validando WhatsApp para:', phone)
        const whatsappValidation = await validateWhatsAppNumber(phone)
        
        if (!whatsappValidation.exists) {
          return { error: { message: 'Este número não possui WhatsApp ativo' } }
        }
        
        whatsappId = whatsappValidation.whatsappId
      }

      // Criar a conta de usuário
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        return { error: signUpError }
      }

      // Se a conta foi criada com sucesso, criar o perfil
      if (data.user) {
        // Verificar se o perfil já existe antes de tentar criar
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single()

        if (!existingProfile) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            nome,
            email: email,
            phone: phone || null,
            whatsapp: whatsappId || null,
            updated_at: new Date().toISOString(),
          })

          if (profileError) {
            console.error('Erro ao criar perfil:', profileError)
            return { error: profileError }
          }
        } else {
          console.log('Perfil já existe, atualizando dados')
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              nome,
              email: email,
              phone: phone || null,
              whatsapp: whatsappId || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', data.user.id)

          if (updateError) {
            console.error('Erro ao atualizar perfil:', updateError)
            return { error: updateError }
          }
        }
      }

      return { error: null }
    } catch (error: any) {
      console.error('Erro no signup:', error)
      return { error: { message: error.message } }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
