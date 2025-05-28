
import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useTheme } from '@/hooks/useTheme'

type AuthMode = 'login' | 'register' | 'forgot'

const authImages = {
  login: '/lovable-uploads/f49ea338-eba8-4e12-b460-c6276f4c4a93.png',
  register: '/lovable-uploads/7a9a766e-0b47-43d5-9605-b2ec2dcd0803.png',
  forgot: '/lovable-uploads/f49ea338-eba8-4e12-b460-c6276f4c4a93.png'
}

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login')
  const { theme } = useTheme()

  // Determine which logo to use based on theme
  const getLogoSrc = () => {
    if (theme === 'clean') {
      return '/lovable-uploads/b679a5ba-8a42-42cc-bc36-ccf4569fa05f.png' // logo-white
    } else if (theme === 'light') {
      return '/lovable-uploads/bd48b065-36ce-4af8-926d-a1f05a2d43c5.png' // logo-black
    } else {
      // System theme - check actual computed theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return isDark 
        ? '/lovable-uploads/b679a5ba-8a42-42cc-bc36-ccf4569fa05f.png'
        : '/lovable-uploads/bd48b065-36ce-4af8-926d-a1f05a2d43c5.png'
    }
  }

  return (
    <div className="min-h-screen flex bg-background p-6">
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
            <h2 className="text-3xl font-bold">FinanceFlow</h2>
          </div>
          <p className="text-lg opacity-90">
            Gerencie suas finanças de forma simples e inteligente
          </p>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Theme Toggle - Top Right */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md">
          {/* Logo for mobile/right side - Top Right of form area */}
          <div className="flex items-center justify-between mb-8">
            <div></div> {/* Empty div for spacing */}
            <img 
              src={getLogoSrc()} 
              alt="FinanceFlow" 
              className="h-8 w-auto lg:hidden"
            />
          </div>

          {/* Desktop logo - only show logo without title */}
          <div className="hidden lg:flex justify-end mb-8">
            <img 
              src={getLogoSrc()} 
              alt="FinanceFlow" 
              className="h-8 w-auto"
            />
          </div>

          {mode === 'login' && (
            <LoginForm
              onToggleMode={() => setMode('register')}
              onForgotPassword={() => setMode('forgot')}
            />
          )}
          {mode === 'register' && (
            <RegisterForm onToggleMode={() => setMode('login')} />
          )}
          {mode === 'forgot' && (
            <ForgotPasswordForm onBack={() => setMode('login')} />
          )}
        </div>
      </div>
    </div>
  )
}
