
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
    console.log('Received phone number:', phoneNumber)

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
    console.log('Making request to n8n endpoint with phone:', phoneNumber)
    
    const response = await fetch('https://n8n.tidi.com.br/webhook/verifica-zap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify({ number: phoneNumber })
    })
    
    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('N8N endpoint error:', errorText)
      throw new Error(`N8N endpoint returned ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('N8N response data:', data)
    
    // Converter a resposta do endpoint para o formato esperado
    const result = {
      isValid: data.exists === "true" || data.exists === true,
      jid: data.whatsapp || null
    }

    console.log('Returning result:', result)

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
      JSON.stringify({ 
        error: 'Failed to validate WhatsApp number',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
