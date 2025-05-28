
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { Settings } from 'lucide-react'

export function EvolutionConfig() {
  const [apiKey, setApiKey] = useState('')
  const [serverUrl, setServerUrl] = useState('')
  const [instance, setInstance] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Carregar dados salvos
    setApiKey(localStorage.getItem('evolution-api-key') || '')
    setServerUrl(localStorage.getItem('evolution-server-url') || '')
    setInstance(localStorage.getItem('evolution-instance') || '')
  }, [])

  const handleSave = () => {
    if (!apiKey || !serverUrl || !instance) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      })
      return
    }

    localStorage.setItem('evolution-api-key', apiKey)
    localStorage.setItem('evolution-server-url', serverUrl)
    localStorage.setItem('evolution-instance', instance)
    
    toast({
      title: "Configurações salvas",
      description: "Credenciais da Evolution API foram salvas com sucesso",
    })
    
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <Settings className="h-4 w-4 mr-2" />
        Configurar Evolution API
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração Evolution API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Sua API Key da Evolution"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serverUrl">Server URL</Label>
          <Input
            id="serverUrl"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            placeholder="https://seu-servidor.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instance">Instância</Label>
          <Input
            id="instance"
            value={instance}
            onChange={(e) => setInstance(e.target.value)}
            placeholder="nome-da-instancia"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Salvar
          </Button>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
