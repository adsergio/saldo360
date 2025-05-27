
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { Loader2, ArrowLeft } from 'lucide-react'

interface ForgotPasswordFormProps {
  onBack: () => void
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await resetPassword(email)

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir a senha.",
      })
    }

    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Recuperar Senha
        </CardTitle>
        <CardDescription>
          Digite seu email para receber as instruções de recuperação
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar instruções'
            )}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button variant="link" onClick={onBack} className="text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
