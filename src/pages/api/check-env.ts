import type { APIRoute } from 'astro';

// 🔍 ENDPOINT SIMPLIFICADO DE DEBUG
export const GET: APIRoute = async () => {
  try {
    // Solo verificar si las variables existen
    const result = {
      timestamp: new Date().toISOString(),
      env_check: {
        WORDPRESS_USER: import.meta.env.WORDPRESS_USER ? 'EXISTE' : 'NO EXISTE',
        WORDPRESS_APP_PASSWORD: import.meta.env.WORDPRESS_APP_PASSWORD ? 'EXISTE' : 'NO EXISTE',
        MODE: import.meta.env.MODE || 'production'
      },
      values_being_used: {
        username: import.meta.env.WORDPRESS_USER || 'vinyl (default)',
        password_exists: !!import.meta.env.WORDPRESS_APP_PASSWORD
      }
    };
    
    return new Response(JSON.stringify(result, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    // Si hay error, devolver info básica
    return new Response(JSON.stringify({
      error: true,
      message: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 200, // Cambiamos a 200 para poder ver el error
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
