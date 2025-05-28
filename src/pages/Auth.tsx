
import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

type AuthMode = 'login' | 'register' | 'forgot'

const authImages = {
  login: '/lovable-uploads/f49ea338-eba8-4e12-b460-c6276f4c4a93.png',
  register: '/lovable-uploads/7a9a766e-0b47-43d5-9605-b2ec2dcd0803.png',
  forgot: '/lovable-uploads/f49ea338-eba8-4e12-b460-c6276f4c4a93.png'
}

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login')

  return (
    <div className="min-h-screen flex bg-background p-6">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={authImages[mode]}
          alt="Finance Management"
          className="w-full h-full object-cover rounded-3xl"
        />
        <div className="absolute inset-0 bg-primary/20" />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-3xl font-bold mb-2">FinanceFlow</h2>
          <p className="text-lg opacity-90">
            Gerencie suas finanças de forma simples e inteligente
          </p>
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
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
