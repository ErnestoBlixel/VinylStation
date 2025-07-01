import type { APIRoute } from 'astro';

// ✅ CONFIGURACIÓN PARA ASTRO HYBRID MODE
export const prerender = false;

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
    console.log('📝 POST: Iniciando envío formulario...');
    
    const formData = await request.json();
    console.log('📋 POST: Datos recibidos:', JSON.stringify(formData, null, 2));
    
    // ✅ Verificar variables de entorno en producción
    const username = import.meta.env.WORDPRESS_USER || 'vinyl';
    const password = import.meta.env.WORDPRESS_APP_PASSWORD || 'aByA gkgO ftxM D9Q8 rEXw 5OzY';
    
    console.log('🔐 POST: Variables entorno - Usuario:', username ? '✅' : '❌');
    console.log('🔐 POST: Variables entorno - Password:', password ? '✅' : '❌');
    console.log('🔐 POST: Username real:', username);
    
    const credentials = `${username}:${password}`;
    
    // ✅ ESTRUCTURA CORRECTA para Gravity Forms API v2
    const payload = {
      input_values: formData.input_values || formData,
      field_values: formData.field_values || {},
      target_page: 0,
      source_page: 1
    };
    
    console.log('🚀 POST: Enviando payload a WordPress:', JSON.stringify(payload, null, 2));
    console.log('🌐 POST: URL destino: https://cms.vinylstation.es/wp-json/gf/v2/forms/1/submissions');
    
    const response = await fetch('https://cms.vinylstation.es/wp-json/gf/v2/forms/1/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(credentials)}`,
        'User-Agent': 'VinylStation/1.0'
      },
      body: JSON.stringify(payload)
    });
    
    console.log('📡 POST: Status respuesta WordPress:', response.status);
    console.log('📡 POST: Headers respuesta:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 POST: Respuesta completa WordPress:', responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log('📊 POST: Respuesta parseada:', JSON.stringify(responseData, null, 2));
    } catch (parseError) {
      console.error('❌ POST: Error parseando respuesta JSON:', parseError.message);
      responseData = { message: responseText };
    }
    
    if (!response.ok) {
      console.error('❌ POST: WordPress devolvió error:', response.status);
      throw new Error(`HTTP ${response.status}: ${responseData.message || response.statusText}`);
    }
    
    console.log('✅ POST: Formulario enviado correctamente a WordPress');
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Formulario enviado correctamente',
      data: responseData,
      debug: {
        wp_status: response.status,
        timestamp: new Date().toISOString()
      }
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ POST: Error enviando formulario:', error);
    console.error('❌ POST: Stack trace:', error.stack);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: 'No se pudo enviar el formulario',
      details: error.message,
      suggestion: 'Verificar conexión con WordPress y configuración de Gravity Forms',
      debug: {
        error_type: error.constructor.name,
        timestamp: new Date().toISOString()
      }
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
