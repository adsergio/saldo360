
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { CartoesList } from '@/components/cartoes/CartoesList'
import { CartaoForm } from '@/components/cartoes/CartaoForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function Cartoes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCartao, setEditingCartao] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleOpenDialog = (cartao?: any) => {
    setEditingCartao(cartao || null)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingCartao(null)
  }

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1)
    handleCloseDialog()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cartões de Crédito</h1>
          <p className="text-muted-foreground">
            Gerencie seus cartões de crédito
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cartão
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus Cartões</CardTitle>
          <CardDescription>
            Lista de todos os seus cartões de crédito cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CartoesList 
            key={refreshKey}
            onEdit={handleOpenDialog}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCartao ? 'Editar Cartão' : 'Novo Cartão'}
            </DialogTitle>
          </DialogHeader>
          <CartaoForm
            cartao={editingCartao}
            onSuccess={handleSuccess}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
