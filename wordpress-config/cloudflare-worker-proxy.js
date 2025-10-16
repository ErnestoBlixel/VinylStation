// Cloudflare Worker Proxy para evitar CORS
// Crear en Cloudflare Workers

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Solo permitir proxy a tu API
    if (!url.pathname.startsWith('/api/')) {
      return new Response('Not Found', { status: 404 });
    }
    
    // Reescribir la URL a tu WordPress
    const targetUrl = url.pathname.replace('/api', 'https://cms.vinylstation.es');
    
    // Hacer la petición
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
    
    // Clonar la respuesta y añadir headers CORS
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return newResponse;
  },
};
