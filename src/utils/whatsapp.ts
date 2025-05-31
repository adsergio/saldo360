
interface WhatsAppValidationResponse {
  exists: string;
  whatsapp: string;
}

export async function validateWhatsAppNumber(phoneNumber: string): Promise<{ exists: boolean; whatsappId?: string }> {
  try {
    
    const response = await fetch('https://n8n.za9.com.br/webhook/verifica-zap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': `tm4IP+yOBd/W7GY2t4pUMYCL0KrqLrG8v9EDTT0D9do=`
      },
      body: JSON.stringify({
        number: phoneNumber
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao validar WhatsApp');
    }

    const data: WhatsAppValidationResponse = await response.json();
    
    return {
      exists: data.exists === 'true',
      whatsappId: data.exists === 'true' ? data.whatsapp : undefined
    };
  } catch (error) {
    console.error('Erro na validação do WhatsApp:', error);
    throw new Error('Não foi possível validar o número do WhatsApp');
  }
}
