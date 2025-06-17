
import { DollarSign, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/currency'
import { useContas } from '@/hooks/useContas'

interface ContasSummaryCardsProps {
  tipo: 'pagar' | 'receber'
}

export function ContasSummaryCards({ tipo }: ContasSummaryCardsProps) {
  const { contas } = useContas(tipo)

  const totalPendente = contas
    .filter(conta => conta.status === 'pendente')
    .reduce((acc, conta) => acc + conta.valor, 0)

  const totalVencido = contas
    .filter(conta => conta.status === 'vencido')
    .reduce((acc, conta) => acc + conta.valor, 0)

  const totalPago = contas
    .filter(conta => conta.status === 'pago')
    .reduce((acc, conta) => acc + conta.valor, 0)

  const total = contas.reduce((acc, conta) => acc + conta.valor, 0)

  const cards = [
    {
      title: 'Total',
      value: total,
      icon: DollarSign,
      color: 'text-blue-600',
    },
    {
      title: 'Pendente',
      value: totalPendente,
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'Vencido',
      value: totalVencido,
      icon: AlertTriangle,
      color: 'text-red-600',
    },
    {
      title: 'Pago',
      value: totalPago,
      icon: CheckCircle,
      color: 'text-green-600',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {formatCurrency(card.value)}
            </div>
            <p className="text-xs text-muted-foreground">
              {card.title} {tipo === 'pagar' ? 'a pagar' : 'a receber'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
