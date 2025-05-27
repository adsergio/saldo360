
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react'

interface Transacao {
  id: number
  created_at: string
  quando: string | null
  estabelecimento: string | null
  valor: number | null
  detalhes: string | null
  tipo: string | null
  categoria: string | null
  userId: string | null
}

export default function Transacoes() {
  const { user } = useAuth()
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transacao | null>(null)
  const [formData, setFormData] = useState({
    quando: '',
    estabelecimento: '',
    valor: '',
    detalhes: '',
    tipo: '',
    categoria: '',
  })

  useEffect(() => {
    if (user) {
      fetchTransacoes()
    }
  }, [user])

  const fetchTransacoes = async () => {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .select('*')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const transacaoData = {
        quando: formData.quando,
        estabelecimento: formData.estabelecimento,
        valor: parseFloat(formData.valor),
        detalhes: formData.detalhes,
        tipo: formData.tipo,
        categoria: formData.categoria,
        userId: user?.id,
      }

      if (editingTransaction) {
        const { error } = await supabase
          .from('transacoes')
          .update(transacaoData)
          .eq('id', editingTransaction.id)

        if (error) throw error
        toast({ title: "Transação atualizada com sucesso!" })
      } else {
        const { error } = await supabase
          .from('transacoes')
          .insert([transacaoData])

        if (error) throw error
        toast({ title: "Transação adicionada com sucesso!" })
      }

      setDialogOpen(false)
      setEditingTransaction(null)
      setFormData({
        quando: '',
        estabelecimento: '',
        valor: '',
        detalhes: '',
        tipo: '',
        categoria: '',
      })
      fetchTransacoes()
    } catch (error: any) {
      toast({
        title: "Erro ao salvar transação",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (transacao: Transacao) => {
    setEditingTransaction(transacao)
    setFormData({
      quando: transacao.quando || '',
      estabelecimento: transacao.estabelecimento || '',
      valor: transacao.valor?.toString() || '',
      detalhes: transacao.detalhes || '',
      tipo: transacao.tipo || '',
      categoria: transacao.categoria || '',
    })
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Transações</h2>
          <p className="text-gray-600">Gerencie suas receitas e despesas</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
              </DialogTitle>
              <DialogDescription>
                {editingTransaction 
                  ? 'Faça as alterações necessárias na transação.' 
                  : 'Adicione uma nova receita ou despesa.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receita">Receita</SelectItem>
                      <SelectItem value="despesa">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estabelecimento">Estabelecimento</Label>
                <Input
                  id="estabelecimento"
                  placeholder="Ex: Supermercado, Salário, etc."
                  value={formData.estabelecimento}
                  onChange={(e) => setFormData({...formData, estabelecimento: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={formData.categoria} onValueChange={(value) => setFormData({...formData, categoria: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alimentacao">Alimentação</SelectItem>
                    <SelectItem value="transporte">Transporte</SelectItem>
                    <SelectItem value="moradia">Moradia</SelectItem>
                    <SelectItem value="saude">Saúde</SelectItem>
                    <SelectItem value="educacao">Educação</SelectItem>
                    <SelectItem value="lazer">Lazer</SelectItem>
                    <SelectItem value="salario">Salário</SelectItem>
                    <SelectItem value="investimentos">Investimentos</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quando">Data</Label>
                <Input
                  id="quando"
                  type="date"
                  value={formData.quando}
                  onChange={(e) => setFormData({...formData, quando: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="detalhes">Detalhes</Label>
                <Textarea
                  id="detalhes"
                  placeholder="Informações adicionais..."
                  value={formData.detalhes}
                  onChange={(e) => setFormData({...formData, detalhes: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingTransaction ? 'Atualizar' : 'Adicionar'} Transação
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : transacoes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">Nenhuma transação encontrada</p>
              <Button onClick={() => setDialogOpen(true)}>
                Adicionar primeira transação
              </Button>
            </CardContent>
          </Card>
        ) : (
          transacoes.map((transacao) => (
            <Card key={transacao.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {transacao.tipo === 'receita' ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                      <h3 className="font-semibold">
                        {transacao.estabelecimento || 'Sem estabelecimento'}
                      </h3>
                      <Badge variant={transacao.tipo === 'receita' ? 'default' : 'destructive'}>
                        {transacao.tipo}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      {transacao.categoria && (
                        <p>Categoria: {transacao.categoria}</p>
                      )}
                      {transacao.quando && (
                        <p>Data: {formatDate(transacao.quando)}</p>
                      )}
                      {transacao.detalhes && (
                        <p>Detalhes: {transacao.detalhes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`text-xl font-bold ${
                      transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transacao.tipo === 'receita' ? '+' : '-'}
                      {formatCurrency(Math.abs(transacao.valor || 0))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(transacao)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(transacao.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
