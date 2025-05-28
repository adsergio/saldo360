
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PhoneInput } from '@/components/ui/phone-input'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { Camera, User } from 'lucide-react'

interface Profile {
  nome: string
  phone: string
  country_code: string
  avatar_url?: string
}

export default function Perfil() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile>({
    nome: '',
    phone: '',
    country_code: '+55',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('nome, phone, country_code, avatar_url')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      
      if (data) {
        setProfile({
          nome: data.nome || '',
          phone: data.phone || '',
          country_code: data.country_code || '+55',
          avatar_url: data.avatar_url
        })
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
    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          nome: profile.nome,
          phone: profile.phone,
          country_code: profile.country_code,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
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
    setProfile(prev => ({ ...prev, phone }))
  }

  const handleCountryChange = (country_code: string) => {
    setProfile(prev => ({ ...prev, country_code }))
  }

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
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
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
              <Label htmlFor="phone">Telefone</Label>
              <PhoneInput
                id="phone"
                value={profile.phone}
                countryCode={profile.country_code}
                onValueChange={handlePhoneChange}
                onCountryChange={handleCountryChange}
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={saving}
              className="w-full"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
