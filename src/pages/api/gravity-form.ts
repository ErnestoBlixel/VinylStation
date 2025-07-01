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
    
    // ✅ VALIDACIÓN DE CONTENIDO MUY PERMISIVA
    const contentType = request.headers.get('content-type');
    console.log('🔍 Content-Type recibido:', contentType);
    
    const isDevelopment = import.meta.env.DEV;
    
    if (isDevelopment && contentType === null) {
      console.log('🚪 [DEV] Content-Type es null en modo development - continuando...');
    }
    
    // ✅ LEER el cuerpo con múltiples estrategias
    let rawBody = '';
    
    try {
      // Estrategia 1: request.text()
      rawBody = await request.text();
      console.log('📄 [Estrategia 1] Raw body length:', rawBody.length);
    } catch (error1) {
      console.log('⚠️ [Estrategia 1] Falló request.text():', error1.message);
      
      try {
        // Estrategia 2: request.json() directamente
        const directJson = await request.json();
        rawBody = JSON.stringify(directJson);
        console.log('📄 [Estrategia 2] JSON directo exitoso, length:', rawBody.length);
      } catch (error2) {
        console.log('⚠️ [Estrategia 2] Falló request.json():', error2.message);
        
        // Estrategia 3: Usar ArrayBuffer
        try {
          const buffer = await request.arrayBuffer();
          rawBody = new TextDecoder().decode(buffer);
          console.log('📄 [Estrategia 3] ArrayBuffer exitoso, length:', rawBody.length);
        } catch (error3) {
          console.log('⚠️ [Estrategia 3] Falló ArrayBuffer:', error3.message);
          throw new Error('No se pudo leer el cuerpo de la petición con ninguna estrategia');
        }
      }
    }
    
    console.log('📄 Raw body preview:', rawBody.substring(0, 200));
    
    if (!rawBody || rawBody.trim() === '') {
      console.error('❌ Cuerpo de petición vacío');
      throw new Error('Cuerpo de la petición está vacío');
    }
    
    // ✅ PARSEAR JSON de forma segura
    let formData;
    try {
      formData = JSON.parse(rawBody);
      console.log('✅ JSON parseado correctamente:', formData);
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError);
      console.error('❌ Raw body que causó error:', rawBody);
      throw new Error(`JSON malformado: ${parseError.message}`);
    }
    
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
    
    console.log('🚀 Enviando payload:', JSON.stringify(payload, null, 2));
    
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
      // Manejo especial para errores de validación de Gravity Forms (400)
      if (response.status === 400 && responseData.validation_messages) {
        console.log('⚠️ Errores de validación de WordPress:', responseData.validation_messages);
        
        return new Response(JSON.stringify({
          success: false,
          error: 'Errores de validación en el formulario',
          validation_errors: responseData.validation_messages,
          details: 'Por favor, corrije los campos marcados',
          is_validation_error: true
        }), { 
          status: 400, // Mantener el 400 para errores de validación
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Para otros errores (500, 401, etc.)
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
