
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useTheme } from '@/hooks/useTheme'

export default function Auth() {
  const { user, loading } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const navigate = useNavigate()
  const { theme } = useTheme()

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, loading, navigate])

  const getLogoSrc = () => {
    if (theme === 'dark') {
      return 'https://res.cloudinary.com/djs0ny9pw/image/upload/v1748729827/Saldo_360_iq1bbf.png'
    } else if (theme === 'light') {
      return 'https://res.cloudinary.com/djs0ny9pw/image/upload/v1748730072/logo-white_i6vfcz.png'
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return isDark 
        ? 'https://res.cloudinary.com/djs0ny9pw/image/upload/v1748729827/Saldo_360_iq1bbf.png'
        : 'https://res.cloudinary.com/djs0ny9pw/image/upload/v1748730072/logo-white_i6vfcz.png'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/lovable-uploads/7a9a766e-0b47-43d5-9605-b2ec2dcd0803.png"
          alt="Finance Management"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/20" />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Gerencie suas finanças com inteligência</h2>
          <p className="text-lg opacity-90">
            Controle total de receitas, despesas e categorias em uma plataforma simples e intuitiva
          </p>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Header with Logo and Theme Toggle */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <img 
            src={getLogoSrc()} 
            alt="FinanceFlow" 
            className="h-8 w-auto"
          />
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md mt-16">
          {mode === 'login' && (
            <LoginForm 
              onToggleMode={() => setMode('signup')}
              onForgotPassword={() => setMode('forgot')}
            />
          )}
          {mode === 'signup' && (
            <SignUpForm onToggleMode={() => setMode('login')} />
          )}
          {mode === 'forgot' && (
            <ForgotPasswordForm onBackToLogin={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  )
}
