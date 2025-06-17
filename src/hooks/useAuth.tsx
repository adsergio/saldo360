
import { useState, useEffect, createContext, useContext } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  initializing: boolean
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
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    console.log('🔐 AuthProvider: Initializing auth state...')
    
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return
            
            console.log('🔐 Auth state change:', event, 'User ID:', session?.user?.id)
            console.log('🔐 Session access token present:', !!session?.access_token)
            
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
            
            if (initializing) {
              setInitializing(false)
            }
          }
        )

        // THEN check for existing session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        
        if (mounted) {
          if (error) {
            console.error('🔐 Session check failed:', error)
            setSession(null)
            setUser(null)
          } else {
            console.log('🔐 Initial session check:', currentSession?.user?.id)
            setSession(currentSession)
            setUser(currentSession?.user ?? null)
          }
          
          setLoading(false)
          setInitializing(false)
        }

        return () => {
          mounted = false
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('🔐 Auth initialization error:', error)
        if (mounted) {
          setLoading(false)
          setInitializing(false)
        }
      }
    }

    const cleanup = initializeAuth()
    return () => {
      mounted = false
      cleanup.then(fn => fn?.())
    }
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
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    console.log('🔐 Sign out completed')
  }

  const resetPassword = async (email: string) => {
    console.log('🔐 Attempting password reset for:', email)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`
    })
    return { error }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        initializing,
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
