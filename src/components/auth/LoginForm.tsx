
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface LoginFormProps {
  onToggleMode: () => void
  onForgotPassword: () => void
}

export function LoginForm({ onToggleMode, onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      })
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-start py-8">
        <h1 className="text-lg font-bold text-slate-800 mb-2">
          Acessar
        </h1>
        <p className="text-base text-muted-foreground">
          Entre na sua conta para acessar o seu sistema financeiro pessoal.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11"
          />
        </div>
        <Button
          type="submit"
          className="w-full h-11 bg-primary hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center space-y-4">
        <Button
          variant="link"
          onClick={onForgotPassword}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Esqueci minha senha
        </Button>
        <div className="text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Button
            variant="link"
            onClick={onToggleMode}
            className="p-0 text-primary hover:text-primary/80"
          >
            Criar conta
          </Button>
        </div>
      </div>
    </div>
  )
}
