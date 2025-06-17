
import { CalendarDays, CheckCircle, AlertCircle, Clock, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/currency'
import { useContas, type Conta } from '@/hooks/useContas'

interface ContasCardProps {
  conta: Conta & {
    categorias?: {
      nome: string
    }
  }
}

export function ContasCard({ conta }: ContasCardProps) {
  const { marcarComoPago, deleteConta } = useContas()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago':
        return 'bg-green-100 text-green-800'
      case 'vencido':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pago':
        return <CheckCircle className="w-4 h-4" />
      case 'vencido':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pago':
        return 'Pago'
      case 'vencido':
        return 'Vencido'
      default:
        return 'Pendente'
    }
  }

  const handleMarcarComoPago = async () => {
    if (conta.status !== 'pago') {
      await marcarComoPago.mutateAsync(conta.id)
    }
  }

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      await deleteConta.mutateAsync(conta.id)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{conta.descricao}</h3>
            <p className="text-sm text-muted-foreground">
              {conta.categorias?.nome}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(conta.status)}>
              {getStatusIcon(conta.status)}
              <span className="ml-1">{getStatusText(conta.status)}</span>
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(conta.valor)}
          </span>
          <span className={`text-sm font-medium ${
            conta.tipo === 'receber' ? 'text-green-600' : 'text-red-600'
          }`}>
            {conta.tipo === 'receber' ? 'A Receber' : 'A Pagar'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4" />
          <span>Vencimento: {format(new Date(conta.data_vencimento), 'dd/MM/yyyy', { locale: ptBR })}</span>
        </div>

        {conta.data_pagamento && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Pago em: {format(new Date(conta.data_pagamento), 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>
        )}

        {conta.recorrente && (
          <div className="text-sm text-blue-600">
            <span>Recorrente: {conta.frequencia_recorrencia}</span>
          </div>
        )}

        {conta.observacoes && (
          <div className="text-sm text-muted-foreground">
            <p>{conta.observacoes}</p>
          </div>
        )}

        {conta.status !== 'pago' && (
          <Button
            onClick={handleMarcarComoPago}
            disabled={marcarComoPago.isPending}
            className="w-full"
            variant="outline"
          >
            {marcarComoPago.isPending ? 'Marcando...' : 'Marcar como Pago'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
