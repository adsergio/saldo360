
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
import { Pencil, Trash2, CreditCard } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { useCartaoFatura } from '@/hooks/useCartaoFatura'
import { FecharFaturaModal } from './FecharFaturaModal'
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
  const [faturaModal, setFaturaModal] = useState<{
    isOpen: boolean
    cartao: Cartao | null
  }>({ isOpen: false, cartao: null })
  
  const { user } = useAuth()
  const { toast } = useToast()
  const { resumosCartao, fecharFatura, isClosingFatura } = useCartaoFatura()

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

  const getCartaoResumo = (cartaoId: string) => {
    return resumosCartao.find(r => r.cartao_id === cartaoId)
  }

  const handleFecharFatura = (cartao: Cartao) => {
    setFaturaModal({ isOpen: true, cartao })
  }

  const confirmFecharFatura = () => {
    if (!faturaModal.cartao) return
    
    fecharFatura({
      cartaoId: faturaModal.cartao.id,
      nomeCartao: faturaModal.cartao.nome
    })
    
    setFaturaModal({ isOpen: false, cartao: null })
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
          {cartoes.map((cartao) => {
            const resumo = getCartaoResumo(cartao.id)
            return (
              <TableRow key={cartao.id}>
                <TableCell className="font-medium">{cartao.nome}</TableCell>
                <TableCell>{cartao.bandeira || '-'}</TableCell>
                <TableCell>{formatCardNumber(cartao.numero)}</TableCell>
                <TableCell>{formatDiaVencimento(cartao.data_vencimento)}</TableCell>
                <TableCell>
                  {resumo ? (
                    <div className="text-sm">
                      <div className="font-medium">
                        R$ {resumo.total_gastos.toFixed(2)}
                      </div>
                      <div className="text-muted-foreground">
                        {resumo.quantidade_transacoes} transação(ões)
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">R$ 0,00</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(cartao)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    
                    {resumo && resumo.total_gastos > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFecharFatura(cartao)}
                        disabled={isClosingFatura}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <CreditCard className="h-4 w-4 mr-1" />
                        Fechar Fatura
                      </Button>
                    )}
                    
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
            )
          })}
        </TableBody>
      </Table>

      {faturaModal.cartao && (
        <FecharFaturaModal
          isOpen={faturaModal.isOpen}
          onClose={() => setFaturaModal({ isOpen: false, cartao: null })}
          onConfirm={confirmFecharFatura}
          cartaoNome={faturaModal.cartao.nome}
          valorTotal={getCartaoResumo(faturaModal.cartao.id)?.total_gastos || 0}
          quantidadeTransacoes={getCartaoResumo(faturaModal.cartao.id)?.quantidade_transacoes || 0}
          isLoading={isClosingFatura}
        />
      )}
    </>
  )
}
