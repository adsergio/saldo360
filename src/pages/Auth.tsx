
import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

type AuthMode = 'login' | 'register' | 'forgot'

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
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
  )
}
