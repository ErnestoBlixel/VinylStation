import type { APIRoute } from 'astro';

// 🔧 VERSIÓN CORREGIDA DE LA API DE GRAVITY FORMS
export const GET: APIRoute = async () => {
  try {
    console.log('🔄 Cargando formulario desde Gravity Forms...');
    
    // ✅ Usar variables de entorno para credenciales
    const username = import.meta.env.WORDPRESS_USER || 'vinyl';
    const password = import.meta.env.WORDPRESS_APP_PASSWORD || 'aByA gkgO ftxM D9Q8 rEXw 5OzY';
    
    // 🔍 DEBUG: Verificar variables en producción
    if (!import.meta.env.WORDPRESS_USER || !import.meta.env.WORDPRESS_APP_PASSWORD) {
      console.warn('⚠️ GET: Variables de entorno no configuradas, usando valores por defecto');
    }
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
    console.log('📝 POST: Iniciando envío formulario a webhook...');
    
    const formData = await request.json();
    console.log('📋 POST: Datos recibidos:', JSON.stringify(formData, null, 2));
    
    // 🔄 CAMBIO: Enviar a webhook de Make.com en lugar de WordPress
    const webhookUrl = 'https://hook.eu2.make.com/9868w1v6v1h051kz5r87dt6pezeuytyj';
    
    // 📦 Preparar datos para el webhook
    const webhookData = {
      timestamp: new Date().toISOString(),
      form_id: 1,
      form_title: 'Contacto VinylStation',
      source_url: request.headers.get('referer') || 'https://vinylstation.es',
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
      fields: formData.input_values || formData,
      // Mapear campos específicos para Make.com
      name: formData.input_values?.['1'] || formData.input_values?.['1.3'] || '',
      email: formData.input_values?.['2'] || '',
      message: formData.input_values?.['3'] || '',
      // Datos completos por si acaso
      raw_data: formData
    };
    
    console.log('🚀 POST: Enviando a webhook:', webhookUrl);
    console.log('📊 POST: Datos del webhook:', JSON.stringify(webhookData, null, 2));
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(webhookData)
    });
    
    console.log('📡 POST: Status respuesta webhook:', response.status);
    
    // Make.com normalmente devuelve 200 con "Accepted"
    if (response.ok) {
      console.log('✅ POST: Webhook procesado correctamente');
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Formulario enviado correctamente',
        debug: {
          webhook_status: response.status,
          timestamp: new Date().toISOString(),
          sent_to: 'Make.com webhook'
        }
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      console.error('❌ POST: Webhook devolvió error:', response.status);
      const errorText = await response.text();
      console.error('❌ POST: Respuesta de error:', errorText);
      
      throw new Error(`Webhook error ${response.status}: ${errorText}`);
    }
    
  } catch (error) {
    console.error('❌ POST: Error enviando formulario:', error);
    console.error('❌ POST: Stack trace:', error.stack);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: 'No se pudo enviar el formulario',
      details: error.message,
      suggestion: 'Error al conectar con el servidor. Por favor, inténtalo de nuevo.',
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
