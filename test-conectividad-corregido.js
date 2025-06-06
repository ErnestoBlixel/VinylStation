// TEST DE CONECTIVIDAD ULTRA BÁSICO - VERSIÓN CORREGIDA
// Verificar si podemos conectar con el servidor antes de GraphQL

import fetch from 'node-fetch';

console.log('🌐 TEST DE CONECTIVIDAD BÁSICA');
console.log('=============================');

async function testConectividad() {
  const urls = [
    'https://cms.vinylstation.es',
    'https://cms.vinylstation.es/wp-json',
    'https://cms.vinylstation.es/graphql'
  ];
  
  for (const url of urls) {
    try {
      console.log(`🔍 Probando: ${url}`);
      
      // Usar fetch directo sin AbortController por si es el problema
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'VinylStation-Test/1.0'
        }
      });
      
      console.log(`   ✅ Status: ${response.status} ${response.statusText}`);
      console.log(`   📡 Headers: ${response.headers.get('content-type')}`);
      
      if (url.includes('graphql')) {
        const text = await response.text();
        console.log(`   📄 Response: ${text.substring(0, 100)}...`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log(''); // Línea en blanco
  }
}

async function testGraphQLBasico() {
  try {
    console.log('🧪 TEST GRAPHQL BÁSICO CON FETCH');
    console.log('=================================');
    
    const query = {
      query: `{
        vinilos(first: 2) {
          nodes {
            databaseId
            title
          }
        }
      }`
    };
    
    console.log('📡 Enviando consulta GraphQL con fetch...');
    
    const response = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'VinylStation-Test/1.0'
      },
      body: JSON.stringify(query)
    });
    
    console.log(`✅ Response Status: ${response.status}`);
    
    const result = await response.json();
    
    if (result.data && result.data.vinilos) {
      const vinilos = result.data.vinilos.nodes;
      console.log(`🎉 ¡GraphQL FUNCIONA! Obtenidos ${vinilos.length} vinilos:`);
      vinilos.forEach((v, i) => {
        console.log(`   ${i+1}. "${v.title}" (ID: ${v.databaseId})`);
      });
      return true;
    } else if (result.errors) {
      console.log('❌ GraphQL Errors:', result.errors);
      return false;
    } else {
      console.log('❌ Respuesta inesperada:', result);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Error en test GraphQL: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando diagnóstico de conectividad...\n');
  
  await testConectividad();
  
  const graphqlOK = await testGraphQLBasico();
  
  console.log('\n🏁 CONCLUSIÓN:');
  console.log('==============');
  
  if (graphqlOK) {
    console.log('✅ GraphQL funciona correctamente');
    console.log('💡 El problema está en la librería graphql-request o en consultas complejas');
    console.log('💡 SOLUCIÓN: Usar fetch directo en lugar de graphql-request');
  } else {
    console.log('❌ Hay problemas de conectividad o configuración GraphQL');
    console.log('💡 Verificar configuración de WordPress y plugins GraphQL');
  }
}

main().catch(error => {
  console.error('💥 Error crítico:', error);
  process.exit(1);
});
