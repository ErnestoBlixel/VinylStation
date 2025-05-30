// verify-config.mjs
// Script para verificar que las URLs estén configuradas correctamente

console.log('🔍 Verificando configuración de URLs...\n');

// Simular el entorno de Astro
const mockImportMeta = {
  env: {
    PUBLIC_WORDPRESS_API_URL: 'https://cms.vinylstation.es/wp-json',
    PUBLIC_WORDPRESS_GRAPHQL_URL: 'https://cms.vinylstation.es/graphql'
  }
};

// Simular la lógica que usa wordpress.js
const WORDPRESS_GRAPHQL_URL = mockImportMeta.env.PUBLIC_WORDPRESS_GRAPHQL_URL || 'https://cms.vinylstation.es/graphql';

console.log('📋 Configuración detectada:');
console.log('   🔗 WordPress GraphQL URL:', WORDPRESS_GRAPHQL_URL);
console.log('   ✅ Debería ser: https://cms.vinylstation.es/graphql');

if (WORDPRESS_GRAPHQL_URL === 'https://cms.vinylstation.es/graphql') {
  console.log('\n✅ ¡PERFECTO! La URL está configurada correctamente');
} else {
  console.log('\n❌ ERROR: La URL no es la correcta');
}

console.log('\n🧪 Probando conexión a WordPress...');

try {
  const response = await fetch(WORDPRESS_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query TestConnection {
          generalSettings {
            title
            description
          }
        }
      `
    })
  });

  if (response.ok) {
    const result = await response.json();
    
    if (result.data && result.data.generalSettings) {
      console.log('✅ ¡CONEXIÓN EXITOSA!');
      console.log('   📝 Título obtenido:', `"${result.data.generalSettings.title}"`);
      console.log('   📝 Descripción obtenida:', `"${result.data.generalSettings.description}"`);
    } else {
      console.log('⚠️ Conexión establecida pero sin datos:');
      console.log('   ', result);
    }
  } else {
    console.log('❌ Error en la respuesta HTTP:', response.status, response.statusText);
  }

} catch (error) {
  console.log('❌ Error de conexión:', error.message);
}

console.log('\n🚀 Ahora puedes probar tu sitio con: npm run dev');