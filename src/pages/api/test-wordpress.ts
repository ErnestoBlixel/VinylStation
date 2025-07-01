import type { APIRoute } from 'astro';

// 🧪 TEST SIMPLE DE CONEXIÓN CON WORDPRESS
export const GET: APIRoute = async () => {
  try {
    // 1. Verificar variables
    const username = import.meta.env.WORDPRESS_USER;
    const password = import.meta.env.WORDPRESS_APP_PASSWORD;
    
    const diagnostics = {
      step1_variables: {
        username_exists: !!username,
        password_exists: !!password,
        username_value: username || 'NO DEFINIDA',
        password_length: password ? password.length : 0,
        using_defaults: !username || !password
      }
    };
    
    // 2. Si no hay variables, usar valores por defecto
    const finalUsername = username || 'vinyl';
    const finalPassword = password || 'aByA gkgO ftxM D9Q8 rEXw 5OzY';
    
    diagnostics.step2_final_values = {
      username_used: finalUsername,
      password_length_used: finalPassword.length
    };
    
    // 3. Intentar conexión básica a WordPress
    try {
      const testUrl = 'https://cms.vinylstation.es/wp-json/wp/v2/users/me';
      const response = await fetch(testUrl, {
        headers: {
          'Authorization': `Basic ${btoa(`${finalUsername}:${finalPassword}`)}`,
          'User-Agent': 'VinylStation-Test/1.0'
        }
      });
      
      diagnostics.step3_wordpress_test = {
        url: testUrl,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      };
      
      if (response.ok) {
        const userData = await response.json();
        diagnostics.step3_wordpress_test.user = {
          id: userData.id,
          name: userData.name,
          slug: userData.slug
        };
      } else {
        const errorText = await response.text();
        diagnostics.step3_wordpress_test.error = errorText;
      }
    } catch (wpError) {
      diagnostics.step3_wordpress_test = {
        error: wpError.message,
        type: 'connection_failed'
      };
    }
    
    // 4. Probar específicamente Gravity Forms
    try {
      const gfUrl = 'https://cms.vinylstation.es/wp-json/gf/v2/forms';
      const gfResponse = await fetch(gfUrl, {
        headers: {
          'Authorization': `Basic ${btoa(`${finalUsername}:${finalPassword}`)}`,
          'User-Agent': 'VinylStation-Test/1.0'
        }
      });
      
      diagnostics.step4_gravity_forms = {
        url: gfUrl,
        status: gfResponse.status,
        statusText: gfResponse.statusText
      };
      
      if (gfResponse.ok) {
        const forms = await gfResponse.json();
        diagnostics.step4_gravity_forms.forms_count = forms.length;
      } else {
        diagnostics.step4_gravity_forms.error = await gfResponse.text();
      }
    } catch (gfError) {
      diagnostics.step4_gravity_forms = {
        error: gfError.message,
        type: 'gravity_forms_failed'
      };
    }
    
    // 5. Resumen
    diagnostics.summary = {
      variables_configured: !!username && !!password,
      wordpress_accessible: diagnostics.step3_wordpress_test?.status === 200,
      gravity_forms_accessible: diagnostics.step4_gravity_forms?.status === 200,
      ready_for_production: false
    };
    
    if (diagnostics.summary.variables_configured && 
        diagnostics.summary.wordpress_accessible && 
        diagnostics.summary.gravity_forms_accessible) {
      diagnostics.summary.ready_for_production = true;
    }
    
    return new Response(JSON.stringify(diagnostics, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Test failed',
      message: error.message,
      stack: error.stack
    }, null, 2), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
