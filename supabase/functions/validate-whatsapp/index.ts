
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phoneNumber } = await req.json()

    if (!phoneNumber) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Criar Basic Auth header
    const credentials = btoa('zanini:oba+1bilhao')
    
    const response = await fetch('https://n8n.tidi.com.br/webhook/verifica-zap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify({ number: phoneNumber })
    })
    
    if (!response.ok) {
      throw new Error('Failed to validate WhatsApp number')
    }

    const data = await response.json()
    
    // Converter a resposta do endpoint para o formato esperado
    const result = {
      isValid: data.exists === "true" || data.exists === true,
      jid: data.whatsapp || null
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error validating WhatsApp:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to validate WhatsApp number' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
