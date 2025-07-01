import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    console.log('Proxy: Iniciando petición a Gravity Forms...');
    
    // ✅ CREDENCIALES ACTUALIZADAS - Application Password "Formulario"
    // Formato: 'usuario:contraseña'
    const credentials = 'vinyl:aByA gkgO ftxM D9Q8 rEXw 5OzY';
    
    const res = await fetch('https://cms.vinylstation.es/wp-json/gf/v2/forms/1', {
      headers: { 
        Authorization: `Basic ${btoa(credentials)}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Proxy: Status:', res.status);
    console.log('Proxy: Headers:', [...res.headers.entries()]);
    
    const data = await res.text();
    console.log('Proxy: Data received:', data);
    
    return new Response(data, { 
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch form',
      details: error.message 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();
    
    // ✅ CREDENCIALES ACTUALIZADAS - Application Password "Formulario"
    const credentials = 'vinyl:aByA gkgO ftxM D9Q8 rEXw 5OzY';
    
    const res = await fetch('https://cms.vinylstation.es/wp-json/gf/v2/forms/1/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(credentials)}`
      },
      body: JSON.stringify(payload)
    });
    
    const data = await res.text();
    return new Response(data, { 
      status: res.status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to submit form' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};