
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CurrencyInput } from '@/components/ui/currency-input'
import { CategorySelector } from '@/components/transactions/CategorySelector'
import { CartaoSelector } from '@/components/transactions/CartaoSelector'

interface TransactionFormFieldsProps {
  formData: {
    quando: string
    estabelecimento: string
    valor: number
    detalhes: string
    tipo: string
    category_id: string
    cartao_id: string
  }
  setFormData: (data: any) => void
}

export function TransactionFormFields({ formData, setFormData }: TransactionFormFieldsProps) {
  return (
    <>
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
          <CurrencyInput
            value={formData.valor}
            onValueChange={(value) => setFormData({...formData, valor: value})}
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
        <CategorySelector
          value={formData.category_id}
          onValueChange={(value) => setFormData({...formData, category_id: value})}
          placeholder="Selecione a categoria"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cartao">Cartão de Crédito</Label>
        <CartaoSelector
          value={formData.cartao_id}
          onValueChange={(value) => setFormData({...formData, cartao_id: value})}
          placeholder="Selecione um cartão (opcional)"
        />
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
    </>
  )
}
