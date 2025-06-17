
import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { CartaoTableRow } from './CartaoTableRow'
import { useCartaoActions } from './CartaoActions'

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

  const {
    getCartaoResumo,
    handleFecharFatura,
    handleDeleteClick,
    isClosingFatura,
    FaturaModal,
    DeleteDialog
  } = useCartaoActions({ onRefresh: fetchCartoes })

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
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Bandeira</TableHead>
            <TableHead>Número</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Gastos Pendentes</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cartoes.map((cartao) => (
            <CartaoTableRow
              key={cartao.id}
              cartao={cartao}
              resumo={getCartaoResumo(cartao.id)}
              onEdit={onEdit}
              onFecharFatura={handleFecharFatura}
              onDelete={handleDeleteClick}
              isClosingFatura={isClosingFatura}
            />
          ))}
        </TableBody>
      </Table>

      <FaturaModal />
      <DeleteDialog />
    </>
  )
}
