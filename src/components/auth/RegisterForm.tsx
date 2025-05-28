import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useWhatsAppValidation } from '@/hooks/useWhatsAppValidation'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface RegisterFormProps {
  onToggleMode: () => void
}

const countryCodes = [
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+1', country: 'EUA/Canadá', flag: '🇺🇸' },
  { code: '+44', country: 'Reino Unido', flag: '🇬🇧' },
  { code: '+49', country: 'Alemanha', flag: '🇩🇪' },
  { code: '+33', country: 'França', flag: '🇫🇷' },
  { code: '+34', country: 'Espanha', flag: '🇪🇸' },
  { code: '+39', country: 'Itália', flag: '🇮🇹' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+52', country: 'México', flag: '🇲🇽' },
]

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nome, setNome] = useState('')
  const [countryCode, setCountryCode] = useState('+55')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [whatsappJid, setWhatsappJid] = useState('')
  const { signUp } = useAuth()
  const { validateWhatsAppNumber, isValidating } = useWhatsAppValidation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      })
      return
    }

    if (!phone.trim()) {
      toast({
        title: "Erro",
        description: "O telefone é obrigatório",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    // Validar WhatsApp
    const fullPhone = `${countryCode.replace('+', '')}${phone}`
    const { isValid, jid } = await validateWhatsAppNumber(fullPhone)
    
    if (!isValid) {
      setLoading(false)
      return
    }

    setWhatsappJid(jid || '')

    const { error } = await signUp(email, password, nome, fullPhone, jid)

    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta.",
      })
    }

    setLoading(false)
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-3xl font-bold text-primary">
          Criar Conta
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Crie sua conta para começar a gerenciar suas finanças
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium">
              Nome completo *
            </Label>
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email *
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
            <Label htmlFor="phone" className="text-sm font-medium">
              Telefone WhatsApp *
            </Label>
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[140px] h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                placeholder="11999999999"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                required
                className="h-11 flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              O número será validado para confirmar se possui WhatsApp ativo
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Senha *
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirmar senha *
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-11 bg-primary hover:bg-primary/90"
            disabled={loading || isValidating}
          >
            {loading || isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isValidating ? 'Validando WhatsApp...' : 'Criando conta...'}
              </>
            ) : (
              'Criar conta'
            )}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <div className="text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Button
              variant="link"
              onClick={onToggleMode}
              className="p-0 text-primary hover:text-primary/80"
            >
              Fazer login
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
