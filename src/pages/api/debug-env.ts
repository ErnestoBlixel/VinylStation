import type { APIRoute } from 'astro';

// 🔍 ENDPOINT DE DEBUG PARA VERIFICAR VARIABLES DE ENTORNO
// ⚠️ ELIMINAR DESPUÉS DE DIAGNOSTICAR
export const GET: APIRoute = async () => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE || 'unknown',
    
    // Variables públicas
    public_vars: {
      WORDPRESS_API_URL: import.meta.env.PUBLIC_WORDPRESS_API_URL || '❌ NO DEFINIDA',
      WORDPRESS_GRAPHQL_URL: import.meta.env.PUBLIC_WORDPRESS_GRAPHQL_URL || '❌ NO DEFINIDA',
      GA4_MEASUREMENT_ID: import.meta.env.PUBLIC_GA4_MEASUREMENT_ID || '❌ NO DEFINIDA',
    },
    
    // Variables privadas (críticas)
    private_vars: {
      WORDPRESS_USER: import.meta.env.WORDPRESS_USER ? '✅ DEFINIDA' : '❌ NO DEFINIDA',
      WORDPRESS_APP_PASSWORD: import.meta.env.WORDPRESS_APP_PASSWORD ? '✅ DEFINIDA' : '❌ NO DEFINIDA',
    },
    
    // Valores actuales que se están usando
    current_values: {
      username: import.meta.env.WORDPRESS_USER || 'vinyl (valor por defecto)',
      password_length: import.meta.env.WORDPRESS_APP_PASSWORD ? 
        import.meta.env.WORDPRESS_APP_PASSWORD.length : 
        'Usando valor hardcodeado (29 caracteres)',
    },
    
    // Test de autenticación
    auth_test: {
      username_present: !!import.meta.env.WORDPRESS_USER,
      password_present: !!import.meta.env.WORDPRESS_APP_PASSWORD,
      using_defaults: !import.meta.env.WORDPRESS_USER || !import.meta.env.WORDPRESS_APP_PASSWORD,
    }
  };
  
  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  });
};
