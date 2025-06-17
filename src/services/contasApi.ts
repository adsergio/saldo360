
import { supabase } from '@/lib/supabase'
import type { Conta, ContaFormData } from '@/types/conta'

// Function to ensure session is valid before making requests
async function ensureValidSession() {
  console.log('💰 Checking session validity with unified client...')
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('💰 Session check error:', error)
    throw new Error('Erro de autenticação. Faça login novamente.')
  }
  
  if (!session) {
    console.error('💰 No active session found')
    throw new Error('Sessão não encontrada. Faça login novamente.')
  }
  
  // Check if session is expired
  if (session.expires_at && session.expires_at * 1000 < Date.now()) {
    console.log('💰 Session expired, attempting refresh...')
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
    
    if (refreshError || !refreshData.session) {
      console.error('💰 Session refresh failed:', refreshError)
      throw new Error('Sessão expirada. Faça login novamente.')
    }
    
    console.log('💰 Session refreshed successfully')
    return refreshData.session
  }
  
  console.log('💰 Session is valid, user ID:', session.user.id)
  return session
}

export async function fetchContas(userId: string, tipo?: 'pagar' | 'receber') {
  console.log('📊 Fetching contas for user:', userId, 'tipo:', tipo)
  
  // Ensure valid session before making request
  await ensureValidSession()
  
  let query = supabase
    .from('contas')
    .select(`
      *,
      categorias (
        id,
        nome
      )
    `)
    .eq('user_id', userId)
    .order('data_vencimento', { ascending: true })

  if (tipo) {
    query = query.eq('tipo', tipo)
  }

  const { data, error } = await query

  if (error) {
    console.error('📊 Error fetching contas:', error)
    throw error
  }

  console.log('📊 Fetched contas successfully:', data?.length || 0, 'records')

  return (data || []).map(conta => ({
    ...conta,
    tipo: conta.tipo as 'pagar' | 'receber',
    status: conta.status as 'pendente' | 'pago' | 'vencido',
    frequencia_recorrencia: conta.frequencia_recorrencia as 'mensal' | 'trimestral' | 'anual' | undefined
  }))
}

export async function createConta(contaData: ContaFormData, userId: string) {
  console.log('💰 Starting conta creation process with unified client...')
  console.log('💰 User ID:', userId)
  console.log('💰 Data to insert:', contaData)

  // Ensure valid session before making request
  const session = await ensureValidSession()
  console.log('💰 Session validation passed, user:', session.user.id)

  // Validações de dados
  if (!contaData.descricao || contaData.descricao.trim() === '') {
    throw new Error('Descrição é obrigatória')
  }

  if (!contaData.valor || contaData.valor <= 0) {
    throw new Error('Valor deve ser maior que zero')
  }

  if (!contaData.data_vencimento) {
    throw new Error('Data de vencimento é obrigatória')
  }

  if (!contaData.categoria_id) {
    throw new Error('Categoria é obrigatória')
  }

  // Verificar se a categoria existe e pertence ao usuário
  console.log('💰 Validating category:', contaData.categoria_id)
  const { data: categoria, error: categoriaError } = await supabase
    .from('categorias')
    .select('id, nome')
    .eq('id', contaData.categoria_id)
    .eq('userid', userId)
    .single()

  if (categoriaError || !categoria) {
    console.error('💰 Categoria validation error:', categoriaError)
    throw new Error('Categoria selecionada não é válida ou não pertence ao usuário')
  }

  console.log('💰 Category validation passed:', categoria)

  const insertData = {
    ...contaData,
    user_id: userId,
  }

  console.log('💰 Final data to insert:', insertData)

  // Tentar inserir os dados
  const { data, error } = await supabase
    .from('contas')
    .insert(insertData)
    .select()
    .single()

  if (error) {
    console.error('💰 Database error creating conta:', error)
    console.error('💰 Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    })
    
    if (error.message.includes('row-level security')) {
      throw new Error('Erro de permissão: Usuário não tem permissão para criar contas. Faça login novamente.')
    }
    
    throw new Error(`Erro ao criar conta: ${error.message}`)
  }

  console.log('💰 Conta created successfully:', data)
  return data
}

export async function updateConta(id: string, contaData: Partial<Conta>) {
  console.log('💰 Updating conta:', id, contaData)
  
  // Ensure valid session before making request
  await ensureValidSession()
  
  const { data, error } = await supabase
    .from('contas')
    .update(contaData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('💰 Error updating conta:', error)
    throw error
  }
  
  console.log('💰 Conta updated successfully:', data)
  return data
}

export async function markContaAsPaid(id: string) {
  console.log('💰 Marking conta as paid:', id)
  
  // Ensure valid session before making request
  await ensureValidSession()
  
  const { data, error } = await supabase
    .from('contas')
    .update({
      status: 'pago',
      data_pagamento: new Date().toISOString().split('T')[0]
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('💰 Error marking conta as paid:', error)
    throw error
  }
  
  console.log('💰 Conta marked as paid successfully:', data)
  return data
}

export async function deleteConta(id: string) {
  console.log('💰 Deleting conta:', id)
  
  // Ensure valid session before making request
  await ensureValidSession()
  
  const { error } = await supabase
    .from('contas')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('💰 Error deleting conta:', error)
    throw error
  }
  
  console.log('💰 Conta deleted successfully')
}
