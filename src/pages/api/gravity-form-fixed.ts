import type { APIRoute } from 'astro';

// 🔧 VERSIÓN CORREGIDA DE LA API DE GRAVITY FORMS
export const GET: APIRoute = async () => {
  try {
    console.log('🔄 Cargando formulario desde Gravity Forms...');
    
    // ✅ Usar variables de entorno para credenciales
    const username = import.meta.env.WORDPRESS_USER || 'vinyl';
    const password = import.meta.env.WORDPRESS_APP_PASSWORD || 'aByA gkgO ftxM D9Q8 rEXw 5OzY';
    const credentials = `${username}:${password}`;
    
    const response = await fetch('https://cms.vinylstation.es/wp-json/gf/v2/forms/1', {
      headers: { 
        'Authorization': `Basic ${btoa(credentials)}`,
        'Content-Type': 'application/json',
        'User-Agent': 'VinylStation/1.0'
      }
    });
    
    console.log('📡 Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Formulario cargado correctamente');
    
    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('❌ Error cargando formulario:', error);
    return new Response(JSON.stringify({ 
      error: 'No se pudo cargar el formulario',
      details: error.message,
      suggestion: 'Verificar credenciales de WordPress y plugin Gravity Forms'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('📝 Enviando formulario...');
    
    const formData = await request.json();
    console.log('📋 Datos recibidos:', formData);
    
    // ✅ Usar variables de entorno para credenciales
    const username = import.meta.env.WORDPRESS_USER || 'vinyl';
    const password = import.meta.env.WORDPRESS_APP_PASSWORD || 'aByA gkgO ftxM D9Q8 rEXw 5OzY';
    const credentials = `${username}:${password}`;
    
    // ✅ ESTRUCTURA CORRECTA para Gravity Forms API v2
    const payload = {
      input_values: formData.input_values || formData,
      field_values: formData.field_values || {},
      target_page: 0,
      source_page: 1
    };
    
    console.log('🚀 Enviando payload:', payload);
    
    const response = await fetch('https://cms.vinylstation.es/wp-json/gf/v2/forms/1/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(credentials)}`,
        'User-Agent': 'VinylStation/1.0'
      },
      body: JSON.stringify(payload)
    });
    
    console.log('📡 Status envío:', response.status);
    
    const responseText = await response.text();
    console.log('📄 Respuesta:', responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseData.message || response.statusText}`);
    }
    
    console.log('✅ Formulario enviado correctamente');
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Formulario enviado correctamente',
      data: responseData
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Error enviando formulario:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'No se pudo enviar el formulario',
      details: error.message,
      suggestion: 'Verificar conexión con WordPress y configuración de Gravity Forms'
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// ✅ Manejar peticiones OPTIONS (CORS preflight)
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
};
