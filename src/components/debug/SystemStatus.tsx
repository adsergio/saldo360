
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

export function SystemStatus() {
  const { user, session } = useAuth()
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)

  const testAuthUid = async () => {
    setTesting(true)
    setTestResult(null)
    
    try {
      console.log('🧪 Testing auth.uid() functionality...')
      
      // Test 1: Check if user exists
      if (!user) {
        setTestResult('❌ Usuário não autenticado')
        return
      }
      
      // Test 2: Check if session exists
      if (!session) {
        setTestResult('❌ Sessão não encontrada')
        return
      }
      
      // Test 3: Test auth.uid() with a simple query
      const { data, error } = await supabase
        .from('categorias')
        .select('count(*)')
        .limit(1)
      
      if (error) {
        setTestResult(`❌ Erro na query: ${error.message}`)
        console.error('🧪 Test failed:', error)
        return
      }
      
      setTestResult('✅ auth.uid() funcionando corretamente')
      console.log('🧪 Test passed:', data)
      
    } catch (error: any) {
      setTestResult(`❌ Exceção: ${error.message}`)
      console.error('🧪 Test exception:', error)
    } finally {
      setTesting(false)
    }
  }

  const getStatusColor = (status: boolean) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm">🔧 Status do Sistema (Debug)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span>Usuário:</span>
            <Badge className={getStatusColor(!!user)}>
              {user ? user.email : 'Não autenticado'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Sessão:</span>
            <Badge className={getStatusColor(!!session)}>
              {session ? 'Ativa' : 'Inativa'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Token:</span>
            <Badge className={getStatusColor(!!session?.access_token)}>
              {session?.access_token ? 'Presente' : 'Ausente'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Expira em:</span>
            <Badge variant="outline">
              {session?.expires_at 
                ? new Date(session.expires_at * 1000).toLocaleTimeString()
                : 'N/A'
              }
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={testAuthUid} 
            disabled={testing || !user}
            size="sm"
            variant="outline"
          >
            {testing ? 'Testando...' : 'Testar auth.uid()'}
          </Button>
          {testResult && (
            <span className="text-sm">{testResult}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
