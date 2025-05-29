
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Profile {
  id: string
  username: string | null
  nome: string | null
  email: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  phone: string | null
  whatsapp: string | null
  ativo: boolean | null
}

interface UserDialogProps {
  user: Profile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (user: Partial<Profile> & { id: string }) => void
}

export function UserDialog({ user, open, onOpenChange, onSave }: UserDialogProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    username: '',
    phone: '',
    whatsapp: '',
    ativo: true
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        username: user.username || '',
        phone: user.phone || '',
        whatsapp: user.whatsapp || '',
        ativo: user.ativo ?? true
      })
    } else {
      setFormData({
        nome: '',
        email: '',
        username: '',
        phone: '',
        whatsapp: '',
        ativo: true
      })
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (user) {
      // Editando usuário existente
      onSave({
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString()
      })
    } else {
      // Adicionando novo usuário (isso requer criação via auth, aqui apenas para demonstração)
      console.log('Adicionar novo usuário não implementado - requer criação via Supabase Auth')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Editar Usuário' : 'Adicionar Usuário'}
          </DialogTitle>
          <DialogDescription>
            {user 
              ? 'Faça as alterações nas informações do usuário.' 
              : 'Preencha as informações do novo usuário.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="whatsapp" className="text-right">
                WhatsApp
              </Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ativo" className="text-right">
                Ativo
              </Label>
              <div className="col-span-3">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {user ? 'Salvar Alterações' : 'Adicionar Usuário'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
