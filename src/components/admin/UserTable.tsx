
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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

interface UserTableProps {
  users: Profile[]
  isLoading: boolean
  onEdit: (user: Profile) => void
  onDelete: (userId: string) => void
  onToggleStatus: (user: Profile) => void
}

export function UserTable({ users, isLoading, onEdit, onDelete, onToggleStatus }: UserTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum usuário encontrado
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cadastrado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.nome || '-'}
              </TableCell>
              <TableCell>{user.email || '-'}</TableCell>
              <TableCell>{user.username || '-'}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={user.ativo ? 
                    "bg-green-50 text-green-700 border-green-200" : 
                    "bg-red-50 text-red-700 border-red-200"
                  }
                >
                  {user.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleStatus(user)}
                    title={user.ativo ? 'Desativar usuário' : 'Ativar usuário'}
                  >
                    {user.ativo ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-red-600" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
