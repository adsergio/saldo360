
import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useTheme } from '@/hooks/useTheme'

type AuthMode = 'login' | 'forgot'

const authImages = {
  login: 'https://res.cloudinary.com/djs0ny9pw/image/upload/v1748711920/businesswoman-using-laptop-office_axts3h.jpg',
  forgot: 'https://res.cloudinary.com/djs0ny9pw/image/upload/v1748711920/businesswoman-using-laptop-office_axts3h.jpg'
}

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login')
  const { theme } = useTheme()

  // Determine which logo to use based on theme
  const getLogoSrc = () => {
    if (theme === 'dark') {
      return 'https://res.cloudinary.com/djs0ny9pw/image/upload/v1748909829/logo-claro_rdfyfz.png' // logo-black
    } else if (theme === 'light') {
      return 'https://res.cloudinary.com/djs0ny9pw/image/upload/v1748909829/logo-escuro_ar6vjs.png' // logo-white
    } else {
      // System theme - check actual computed theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return isDark 
        ? 'https://res.cloudinary.com/djs0ny9pw/image/upload/v1748909829/logo-claro_rdfyfz.png'
        : 'https://res.cloudinary.com/djs0ny9pw/image/upload/v1748909829/logo-escuro_ar6vjs.png'
    }
  }

  return (
    <div className="h-screen flex bg-background p-6">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-3xl">
        <img
          src={authImages[mode]}
          alt="Finance Management"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/20" />
        <div className="absolute bottom-8 left-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-3xl font-bold text-white">Agora ficou fácil!</h2>
          </div>
          <p className="text-lg opacity-90">
            Gerencie suas finanças de forma simples e inteligente
          </p>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Header with Logo and Theme Toggle */}
        <div className="absolute top-4 left-4 right-4 flex justify-end items-center">
          
          {/* Theme Toggle */}
          <ThemeToggle />
        </div>

        <div className="grid w-full min-w-[480px] mt-16 justify-center gap-4">
          <div>
            <img 
              src={getLogoSrc()} 
              alt="Saldo360" 
              className="h-8 w-auto"
            />
          </div>
          
          {mode === 'login' && (
            <LoginForm
              onForgotPassword={() => setMode('forgot')}
            />
          )}
          {mode === 'forgot' && (
            <ForgotPasswordForm onBack={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  )
}
