
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Users } from 'lucide-react'
import { UserTable } from '@/components/admin/UserTable'
import { UserDialog } from '@/components/admin/UserDialog'
import { toast } from '@/hooks/use-toast'

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

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<Profile | null>(null)
  const queryClient = useQueryClient()

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Profile[]
    }
  })

  const updateUserMutation = useMutation({
    mutationFn: async (user: Partial<Profile> & { id: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update(user)
        .eq('id', user.id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
      toast({
        title: "Usuário atualizado",
        description: "As informações do usuário foram atualizadas com sucesso.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar usuário",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] })
      toast({
        title: "Usuário removido",
        description: "O usuário foi removido com sucesso.",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover usuário",
        description: error.message,
        variant: "destructive",
      })
    }
  })

  const filteredProfiles = profiles?.filter(profile => 
    profile.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.username?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const activeUsers = profiles?.filter(p => p.ativo)?.length || 0
  const inactiveUsers = profiles?.filter(p => !p.ativo)?.length || 0
  const totalUsers = profiles?.length || 0

  const handleEditUser = (user: Profile) => {
    setEditingUser(user)
    setIsDialogOpen(true)
  }

  const handleAddUser = () => {
    setEditingUser(null)
    setIsDialogOpen(true)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Tem certeza que deseja remover este usuário?')) {
      deleteUserMutation.mutate(userId)
    }
  }

  const handleToggleUserStatus = (user: Profile) => {
    updateUserMutation.mutate({
      id: user.id,
      ativo: !user.ativo
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">Gerencie todos os usuários da plataforma</p>
        </div>
        <Button onClick={handleAddUser} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Usuário
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Ativo
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Inativos</CardTitle>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Inativo
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários ({filteredProfiles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            users={filteredProfiles}
            isLoading={isLoading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleUserStatus}
          />
        </CardContent>
      </Card>

      {/* User Dialog */}
      <UserDialog
        user={editingUser}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={(user) => {
          updateUserMutation.mutate(user)
          setIsDialogOpen(false)
        }}
      />
    </div>
  )
}
