import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PhoneInput } from '@/components/ui/phone-input'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useWhatsAppValidation } from '@/hooks/useWhatsAppValidation'
import { toast } from '@/hooks/use-toast'
import { Camera, User, CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface Profile {
  nome: string
  phone: string
  avatar_url?: string
  whatsapp?: string
}

export default function Perfil() {
  const { user } = useAuth()
  const { validateWhatsAppNumber, isValidating } = useWhatsAppValidation()
  const [profile, setProfile] = useState<Profile>({
    nome: '',
    phone: '',
  })
  const [currentCountryCode, setCurrentCountryCode] = useState('+55')
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState('')
  const [whatsappValidated, setWhatsappValidated] = useState(false)
  const [currentWhatsappJid, setCurrentWhatsappJid] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  // Auto-validate WhatsApp when phone changes
  useEffect(() => {
    const validatePhone = async () => {
      if (!currentPhoneNumber.trim()) {
        setWhatsappValidated(false)
        setCurrentWhatsappJid('')
        return
      }

      // Check if it's the same as current profile phone
      const fullPhone = currentCountryCode + currentPhoneNumber
      if (fullPhone === profile.phone && profile.whatsapp) {
        setWhatsappValidated(true)
        setCurrentWhatsappJid(profile.whatsapp)
        return
      }

      // Validate only if phone has minimum length
      const minLength = currentCountryCode === '+55' ? 10 : 8
      if (currentPhoneNumber.length >= minLength) {
        const { isValid, jid } = await validateWhatsAppNumber(fullPhone)
        
        if (isValid) {
          setWhatsappValidated(true)
          setCurrentWhatsappJid(jid || '')
        } else {
          setWhatsappValidated(false)
          setCurrentWhatsappJid('')
        }
      } else {
        setWhatsappValidated(false)
        setCurrentWhatsappJid('')
      }
    }

    const debounceTimer = setTimeout(validatePhone, 1000)
    return () => clearTimeout(debounceTimer)
  }, [currentPhoneNumber, currentCountryCode, profile.phone, profile.whatsapp, validateWhatsAppNumber])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('nome, phone, avatar_url, whatsapp')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      
      if (data) {
        // Parse the phone number to separate country code and number
        const phone = data.phone || ''
        let countryCode = '+55'
        let phoneNumber = ''
        
        if (phone) {
          // Extract country code (assumes format like "+5511999999999")
          const match = phone.match(/^(\+\d{1,4})(.*)$/)
          if (match) {
            countryCode = match[1]
            phoneNumber = match[2]
          } else {
            phoneNumber = phone
          }
        }

        setProfile({
          nome: data.nome || '',
          phone: phone,
          avatar_url: data.avatar_url,
          whatsapp: data.whatsapp
        })
        setCurrentCountryCode(countryCode)
        setCurrentPhoneNumber(phoneNumber)
        
        // Set initial validation state
        if (data.whatsapp) {
          setWhatsappValidated(true)
          setCurrentWhatsappJid(data.whatsapp)
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar perfil",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!whatsappValidated) {
      toast({
        title: "Erro",
        description: "O número WhatsApp deve ser validado antes de salvar",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      // Combine country code and phone number
      const fullPhone = currentCountryCode + currentPhoneNumber

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          nome: profile.nome,
          phone: fullPhone,
          whatsapp: currentWhatsappJid,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      
      // Update local state
      setProfile(prev => ({ ...prev, phone: fullPhone, whatsapp: currentWhatsappJid }))
      
      toast({ title: "Perfil atualizado com sucesso!" })
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você deve selecionar uma imagem para fazer upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `avatar-${user?.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }))
      
      toast({ title: "Avatar atualizado com sucesso!" })
    } catch (error: any) {
      toast({
        title: "Erro ao fazer upload da imagem",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handlePhoneChange = (phone: string) => {
    setCurrentPhoneNumber(phone)
  }

  const handleCountryChange = (country_code: string) => {
    setCurrentCountryCode(country_code)
  }

  const getPhoneStatus = () => {
    if (!currentPhoneNumber.trim()) return null
    if (isValidating) return 'validating'
    if (whatsappValidated) return 'valid'
    return 'invalid'
  }

  const phoneStatus = getPhoneStatus()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Perfil</h2>
        <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {profile.nome ? getInitials(profile.nome) : <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                disabled={uploading}
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                className="hidden"
              />
            </div>
            <div>
              <h3 className="font-medium">{profile.nome || 'Sem nome'}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                value={profile.nome}
                onChange={(e) => setProfile(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone WhatsApp</Label>
              <div className="relative">
                <PhoneInput
                  id="phone"
                  value={currentPhoneNumber}
                  countryCode={currentCountryCode}
                  onValueChange={handlePhoneChange}
                  onCountryChange={handleCountryChange}
                  required
                />
                {phoneStatus && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
                    {phoneStatus === 'validating' && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    {phoneStatus === 'valid' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {phoneStatus === 'invalid' && (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              <div className="text-xs space-y-1">
                <p className="text-muted-foreground">
                  O número será validado automaticamente
                </p>
                {whatsappValidated && currentWhatsappJid && (
                  <p className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    WhatsApp validado: {currentWhatsappJid}
                  </p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={saving || !whatsappValidated}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
