import type { APIRoute } from 'astro';

// ✅ VERSIÓN SIMPLIFICADA Y ROBUSTA DE LA API
export const GET: APIRoute = async () => {
  try {
    console.log('🔄 Cargando formulario desde Gravity Forms...');
    
    // Credenciales hardcodeadas temporalmente para testing
    const credentials = btoa('vinyl:aByA gkgO ftxM D9Q8 rEXw 5OzY');
    
    const response = await fetch('https://cms.vinylstation.es/wp-json/gf/v2/forms/1', {
      headers: { 
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'User-Agent': 'VinylStation/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'No se pudo cargar el formulario',
      details: error.message
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.json();
    
    // Credenciales hardcodeadas temporalmente
    const credentials = btoa('vinyl:aByA gkgO ftxM D9Q8 rEXw 5OzY');
    
    const payload = {
      input_values: formData.input_values || formData,
      field_values: formData.field_values || {},
      target_page: 0,
      source_page: 1
    };
    
    const response = await fetch('https://cms.vinylstation.es/wp-json/gf/v2/forms/1/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
        'User-Agent': 'VinylStation/1.0'
      },
      body: JSON.stringify(payload)
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseData.message || response.statusText}`);
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Formulario enviado correctamente',
      data: responseData
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false,
      error: 'No se pudo enviar el formulario',
      details: error.message
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
};
