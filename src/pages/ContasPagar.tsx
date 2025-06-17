
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ContasForm } from '@/components/contas/ContasForm'
import { ContasList } from '@/components/contas/ContasList'
import { ContasSummaryCards } from '@/components/contas/ContasSummaryCards'

export default function ContasPagar() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas a Pagar</h1>
          <p className="text-muted-foreground">
            Gerencie suas contas a pagar
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Conta a Pagar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Conta a Pagar</DialogTitle>
            </DialogHeader>
            <ContasForm 
              tipo="pagar" 
              onSuccess={() => setDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <ContasSummaryCards tipo="pagar" />
      
      <ContasList tipo="pagar" />
    </div>
  )
}
