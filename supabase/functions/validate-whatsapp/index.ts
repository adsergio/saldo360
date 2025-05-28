
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

    const evolutionApiUrl = 'https://whatsapp.tidi.com.br'
    const evolutionApiKey = 'jIr07S3YYZJoXRB1E+b4AZFxTB1yT6ClUmsJBkY0a2BHyuDis+7u8RMX11wylPbJs66Mb3OU57hUz9y5/yn5jA=='
    const evolutionInstance = 'tidi'

    const options = {
      method: 'POST',
      headers: {
        'apikey': evolutionApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ numbers: [phoneNumber] })
    }

    const response = await fetch(`${evolutionApiUrl}/chat/whatsappNumbers/${evolutionInstance}`, options)
    
    if (!response.ok) {
      throw new Error('Failed to validate WhatsApp number')
    }

    const data = await response.json()
    
    // O EvolutionAPI retorna um array com os números validados
    const result = {
      isValid: data.length > 0 && data[0].exists,
      jid: data.length > 0 ? data[0].jid : null
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
