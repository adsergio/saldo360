
import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { TransactionSummaryCards } from '@/components/transactions/TransactionSummaryCards'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { TransactionList } from '@/components/transactions/TransactionList'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { Plus, Trash2 } from 'lucide-react'

interface Transacao {
  id: number
  created_at: string
  quando: string | null
  estabelecimento: string | null
  valor: number | null
  detalhes: string | null
  tipo: string | null
  category_id: string
  cartao_id: string | null
  userId: string | null
  is_installment: boolean | null
  installment_group_id: string | null
  installment_number: number | null
  total_installments: number | null
  categorias?: {
    id: string
    nome: string
  }
  cartoes_credito?: {
    id: string
    nome: string
    bandeira?: string
  }
}

export default function Transacoes() {
  const { user } = useAuth()
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transacao | null>(null)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    if (user) {
      fetchTransacoes()
    }
  }, [user])

  // Transações filtradas
  const filteredTransacoes = useMemo(() => {
    return transacoes.filter(transacao => {
      const matchesSearch = !searchTerm || 
        (transacao.estabelecimento?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      const matchesType = !typeFilter || transacao.tipo === typeFilter
      const matchesCategory = !categoryFilter || transacao.category_id === categoryFilter
      
      return matchesSearch && matchesType && matchesCategory
    })
  }, [transacoes, searchTerm, typeFilter, categoryFilter])

  // Cálculo dos totais
  const { receitas, despesas, saldo } = useMemo(() => {
    const receitas = filteredTransacoes
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + (t.valor || 0), 0)
    
    const despesas = filteredTransacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + (t.valor || 0), 0)
    
    return {
      receitas,
      despesas,
      saldo: receitas - despesas
    }
  }, [filteredTransacoes])

  const fetchTransacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .select(`
          *,
          categorias (
            id,
            nome
          ),
          cartoes_credito (
            id,
            nome,
            bandeira
          )
        `)
        .eq('userId', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTransacoes(data || [])
    } catch (error: any) {
      toast({
        title: "Erro ao carregar transações",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setTypeFilter('')
    setCategoryFilter('')
  }

  const handleEdit = (transacao: Transacao) => {
    setEditingTransaction(transacao)
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return

    try {
      const { error } = await supabase
        .from('transacoes')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast({ title: "Transação excluída com sucesso!" })
      fetchTransacoes()
    } catch (error: any) {
      toast({
        title: "Erro ao excluir transação",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteAll = async () => {
    try {
      const { error } = await supabase
        .from('transacoes')
        .delete()
        .eq('userId', user?.id)

      if (error) throw error
      toast({ title: "Todas as transações foram excluídas com sucesso!" })
      fetchTransacoes()
    } catch (error: any) {
      toast({
        title: "Erro ao excluir transações",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingTransaction(null)
    }
  }

  const handleTransactionSaved = () => {
    setEditingTransaction(null)
    fetchTransacoes()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transações</h2>
          <p className="text-muted-foreground">Gerencie suas receitas e despesas</p>
        </div>
        <div className="flex gap-2">
          {transacoes.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remover Todas
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover todas as transações</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso irá remover permanentemente todas as suas transações.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Remover Todas
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button onClick={() => setDialogOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        </div>
      </div>

      <TransactionSummaryCards 
        receitas={receitas}
        despesas={despesas}
        saldo={saldo}
      />

      <TransactionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        onClearFilters={clearFilters}
      />

      <TransactionForm
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        editingTransaction={editingTransaction}
        onTransactionSaved={handleTransactionSaved}
      />

      <TransactionList
        transactions={filteredTransacoes}
        loading={loading}
        totalTransactions={transacoes.length}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddFirst={() => setDialogOpen(true)}
      />
    </div>
  )
}
