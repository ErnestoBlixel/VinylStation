import type { APIRoute } from 'astro';

// 🔍 VERSIÓN DE DEBUG CON MÁS INFORMACIÓN
export const GET: APIRoute = async () => {
  try {
    console.log('🔄 Iniciando carga del formulario...');
    
    // Debug de variables
    const username = import.meta.env.WORDPRESS_USER;
    const password = import.meta.env.WORDPRESS_APP_PASSWORD;
    
    console.log('📊 Variables de entorno:');
    console.log('- Username existe:', !!username);
    console.log('- Password existe:', !!password);
    console.log('- Username valor:', username || 'USANDO DEFAULT: vinyl');
    console.log('- Password length:', password ? password.length : 'USANDO DEFAULT: 29 chars');
    
    // Usar valores finales
    const finalUsername = username || 'vinyl';
    const finalPassword = password || 'aByA gkgO ftxM D9Q8 rEXw 5OzY';
    const credentials = `${finalUsername}:${finalPassword}`;
    const encodedCreds = btoa(credentials);
    
    console.log('🔐 Credenciales:');
    console.log('- Username final:', finalUsername);
    console.log('- Credentials length:', credentials.length);
    console.log('- Encoded length:', encodedCreds.length);
    
    const url = 'https://cms.vinylstation.es/wp-json/gf/v2/forms/1';
    console.log('🌐 URL:', url);
    
    const headers = {
      'Authorization': `Basic ${encodedCreds}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://vinylstation.es'
    };
    
    console.log('📤 Headers enviados:', {
      ...headers,
      'Authorization': 'Basic [OCULTO]'
    });
    
    const response = await fetch(url, { headers });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      
      // Intentar parsear el error
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorData.message || errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Formulario cargado:', data.id, '- Campos:', data.fields?.length);
    
    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('❌ Error completo:', error);
    console.error('❌ Stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: 'No se pudo cargar el formulario',
      details: error.message,
      timestamp: new Date().toISOString(),
      debug: {
        env_vars_present: {
          username: !!import.meta.env.WORDPRESS_USER,
          password: !!import.meta.env.WORDPRESS_APP_PASSWORD
        }
      }
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST simplificado por ahora
export const POST: APIRoute = async ({ request }) => {
  return new Response(JSON.stringify({
    error: 'Endpoint temporalmente deshabilitado para debug'
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
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
