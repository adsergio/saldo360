
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

interface Cartao {
  id?: string
  nome: string
  numero?: string
  bandeira?: string
  data_vencimento: string
}

interface CartaoFormProps {
  cartao?: Cartao | null
  onSuccess: () => void
  onCancel: () => void
}

const bandeiras = [
  'Visa',
  'Mastercard',
  'American Express',
  'Elo',
  'Hipercard',
  'Diners Club',
  'Discover'
]

export function CartaoForm({ cartao, onSuccess, onCancel }: CartaoFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    numero: '',
    bandeira: '',
    data_vencimento: ''
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (cartao) {
      setFormData({
        nome: cartao.nome || '',
        numero: cartao.numero || '',
        bandeira: cartao.bandeira || '',
        data_vencimento: cartao.data_vencimento || ''
      })
    }
  }, [cartao])

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatDiaVencimento = (value: string) => {
    const v = value.replace(/\D/g, '')
    const day = parseInt(v)
    if (day > 31) return '31'
    if (day < 1 && v.length > 0) return '1'
    return v
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === 'numero') {
      value = formatCardNumber(value)
    } else if (field === 'data_vencimento') {
      value = formatDiaVencimento(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome do cartão é obrigatório',
        variant: 'destructive',
      })
      return
    }

    if (!formData.data_vencimento.trim()) {
      toast({
        title: 'Erro',
        description: 'Dia de vencimento é obrigatório',
        variant: 'destructive',
      })
      return
    }

    const day = parseInt(formData.data_vencimento)
    if (day < 1 || day > 31) {
      toast({
        title: 'Erro',
        description: 'Dia de vencimento deve ser entre 1 e 31',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const cartaoData = {
        nome: formData.nome.trim(),
        numero: formData.numero.replace(/\s/g, '') || null,
        bandeira: formData.bandeira || null,
        data_vencimento: formData.data_vencimento,
        user_id: user!.id
      }

      let error

      if (cartao?.id) {
        const { error: updateError } = await supabase
          .from('cartoes_credito')
          .update(cartaoData)
          .eq('id', cartao.id)
        error = updateError
      } else {
        const { error: insertError } = await supabase
          .from('cartoes_credito')
          .insert([cartaoData])
        error = insertError
      }

      if (error) {
        console.error('Error saving cartão:', error)
        toast({
          title: 'Erro',
          description: 'Erro ao salvar cartão',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Sucesso',
        description: cartao?.id ? 'Cartão atualizado com sucesso' : 'Cartão cadastrado com sucesso',
      })

      onSuccess()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao salvar cartão',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Cartão *</Label>
        <Input
          id="nome"
          type="text"
          value={formData.nome}
          onChange={(e) => handleInputChange('nome', e.target.value)}
          placeholder="Ex: Cartão Principal"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="data_vencimento">Dia de Vencimento *</Label>
        <Input
          id="data_vencimento"
          type="number"
          value={formData.data_vencimento}
          onChange={(e) => handleInputChange('data_vencimento', e.target.value)}
          placeholder="Ex: 15"
          min="1"
          max="31"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="numero">Número do Cartão</Label>
        <Input
          id="numero"
          type="text"
          value={formData.numero}
          onChange={(e) => handleInputChange('numero', e.target.value)}
          placeholder="0000 0000 0000 0000"
          maxLength={19}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bandeira">Bandeira</Label>
        <Select
          value={formData.bandeira}
          onValueChange={(value) => handleInputChange('bandeira', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a bandeira" />
          </SelectTrigger>
          <SelectContent>
            {bandeiras.map((bandeira) => (
              <SelectItem key={bandeira} value={bandeira}>
                {bandeira}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : cartao?.id ? 'Atualizar' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
