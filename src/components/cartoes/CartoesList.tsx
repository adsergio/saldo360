
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface Cartao {
  id: string
  nome: string
  numero?: string
  bandeira?: string
  data_vencimento: string
}

interface CartoesListProps {
  onEdit: (cartao: Cartao) => void
}

export function CartoesList({ onEdit }: CartoesListProps) {
  const [cartoes, setCartoes] = useState<Cartao[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchCartoes = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('cartoes_credito')
        .select('*')
        .eq('user_id', user.id)
        .order('nome')

      if (error) {
        console.error('Error fetching cartões:', error)
        toast({
          title: 'Erro',
          description: 'Erro ao carregar cartões de crédito',
          variant: 'destructive',
        })
        return
      }

      setCartoes(data || [])
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao carregar cartões',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cartoes_credito')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting cartão:', error)
        toast({
          title: 'Erro',
          description: 'Erro ao excluir cartão',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Sucesso',
        description: 'Cartão excluído com sucesso',
      })

      fetchCartoes()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao excluir cartão',
        variant: 'destructive',
      })
    }
  }

  const formatCardNumber = (numero?: string) => {
    if (!numero) return '-'
    return `**** **** **** ${numero.slice(-4)}`
  }

  const formatDiaVencimento = (dia: string) => {
    return `Dia ${dia}`
  }

  useEffect(() => {
    fetchCartoes()
  }, [user])

  if (loading) {
    return <div>Carregando cartões...</div>
  }

  if (cartoes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum cartão de crédito cadastrado</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Bandeira</TableHead>
          <TableHead>Número</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cartoes.map((cartao) => (
          <TableRow key={cartao.id}>
            <TableCell className="font-medium">{cartao.nome}</TableCell>
            <TableCell>{cartao.bandeira || '-'}</TableCell>
            <TableCell>{formatCardNumber(cartao.numero)}</TableCell>
            <TableCell>{formatDiaVencimento(cartao.data_vencimento)}</TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(cartao)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o cartão "{cartao.nome}"?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(cartao.id)}>
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
