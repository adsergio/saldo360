
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { User, Mail, Phone, Save, Upload, Camera } from 'lucide-react'

interface Profile {
  id: string
  username: string | null
  nome: string | null
  avatar_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export default function Perfil() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    username: '',
    phone: '',
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setProfile(data)
        setFormData({
          nome: data.nome || '',
          username: data.username || '',
          phone: data.phone || '',
        })
      } else {
        const newProfile = {
          id: user?.id,
          nome: user?.user_metadata?.name || '',
          updated_at: new Date().toISOString(),
        }

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single()

        if (createError) throw createError
        setProfile(createdProfile)
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
        .update({
          nome: formData.nome,
          username: formData.username,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id)

      if (error) throw error

      toast({ title: "Perfil atualizado com sucesso!" })
      fetchProfile()
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

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você deve selecionar uma imagem para upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id)

      if (updateError) {
        throw updateError
      }

      toast({ title: "Avatar atualizado com sucesso!" })
      fetchProfile()
    } catch (error: any) {
      toast({
        title: "Erro ao fazer upload do avatar",
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
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-72"></div>
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-32"></div>
            <div className="h-4 bg-muted rounded w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-20"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Perfil</h2>
        <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <CardTitle>Foto do Perfil</CardTitle>
            <CardDescription>Sua foto de perfil atual</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="relative inline-block">
              <Avatar className="mx-auto h-24 w-24 mb-4">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-lg bg-gradient-to-r from-primary/20 to-primary/10 text-primary">
                  {profile?.nome ? getInitials(profile.nome) : <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-4 right-1/2 translate-x-1/2 cursor-pointer"
              >
                <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors">
                  {uploading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{profile?.nome || 'Usuário'}</h3>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {user?.email}
              </div>
              {profile?.phone && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {profile.phone}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="@username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    O email não pode ser alterado por aqui
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="5511999999999"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>
            Detalhes sobre sua conta no FinanceFlow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-foreground">Data de criação</p>
              <p className="text-muted-foreground">
                {profile?.created_at 
                  ? new Date(profile.created_at).toLocaleDateString('pt-BR')
                  : 'Não disponível'
                }
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Última atualização</p>
              <p className="text-muted-foreground">
                {profile?.updated_at 
                  ? new Date(profile.updated_at).toLocaleDateString('pt-BR')
                  : 'Não disponível'
                }
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">ID do usuário</p>
              <p className="text-muted-foreground font-mono text-xs">
                {user?.id}
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Status da conta</p>
              <p className="text-green-600 font-medium">Ativa</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
