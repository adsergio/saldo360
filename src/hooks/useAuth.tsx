
import { useState, useEffect, createContext, useContext } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, clearAuthData } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, nome?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔐 AuthProvider: Initializing unified auth state...')
    
    // Limpar dados corrompidos na inicialização
    const checkAndClearCorruptedData = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        if (error) {
          console.warn('🔐 Session check failed, clearing corrupted data:', error)
          clearAuthData()
        }
      } catch (error) {
        console.warn('🔐 Auth check exception, clearing corrupted data:', error)
        clearAuthData()
      }
    }
    
    checkAndClearCorruptedData()
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Unified auth state change:', event, 'User ID:', session?.user?.id)
        console.log('🔐 Session access token present:', !!session?.access_token)
        console.log('🔐 Session expires at:', session?.expires_at)
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Test auth.uid() availability when session changes
        if (session?.user) {
          console.log('🔐 Testing auth.uid() availability with unified client...')
          try {
            // Test query that uses auth.uid()
            const { data: testData, error: testError } = await supabase
              .from('categorias')
              .select('count(*)')
              .limit(1)
            
            if (testError) {
              console.error('🔐 Auth test failed:', testError)
              console.log('🔐 Attempting session refresh...')
              const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
              if (refreshError) {
                console.error('🔐 Session refresh failed:', refreshError)
                clearAuthData()
              } else {
                console.log('🔐 Session refresh successful:', !!refreshData.session)
              }
            } else {
              console.log('🔐 Auth test successful with unified client:', testData)
            }
          } catch (error) {
            console.error('🔐 Auth test exception:', error)
          }
        }
      }
    )

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 Initial session check (unified):', session?.user?.id)
      console.log('🔐 Initial session access token present:', !!session?.access_token)
      
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Attempting sign in for:', email)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error('🔐 Sign in error:', error)
    } else {
      console.log('🔐 Sign in successful')
    }
    return { error }
  }

  const signUp = async (email: string, password: string, nome?: string) => {
    console.log('🔐 Attempting sign up for:', email)
    const redirectUrl = `${window.location.origin}/`
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          nome: nome || email.split('@')[0]
        }
      }
    })
    if (error) {
      console.error('🔐 Sign up error:', error)
    } else {
      console.log('🔐 Sign up successful')
    }
    return { error }
  }

  const signOut = async () => {
    console.log('🔐 Attempting sign out')
    clearAuthData()
    await supabase.auth.signOut()
    console.log('🔐 Sign out completed')
  }

  const resetPassword = async (email: string) => {
    console.log('🔐 Attempting password reset for:', email)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`
    })
    return { error }
  }

  // Log current auth state periodically for debugging
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        console.log('🔐 Auth status check (unified) - User ID:', user.id, 'Session valid:', !!session?.access_token)
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [user, session])

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
