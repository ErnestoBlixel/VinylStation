// test-wordpress-data.mjs
// Script para probar los datos reales que obtienes desde WordPress

import { getSiteInfo, getSiteLogo } from './src/lib/wordpress.js';

console.log('🧪 Probando conexión con WordPress...\n');

async function testWordPressData() {
  try {
    console.log('1️⃣ Probando getSiteLogo()...');
    const logo = await getSiteLogo();
    console.log('✅ Logo obtenido:');
    console.log('   URL:', logo.url);
    console.log('   Alt Text:', logo.altText);
    console.log('   Fuente:', logo.source);
    if (logo.databaseId) {
      console.log('   Database ID:', logo.databaseId);
    }
    console.log('');
    
    console.log('2️⃣ Probando getSiteInfo()...');
    const siteInfo = await getSiteInfo();
    console.log('✅ Información del sitio obtenida:');
    console.log('   Título:', `"${siteInfo.title}"`);
    console.log('   Descripción:', `"${siteInfo.description}"`);
    console.log('   URL:', siteInfo.url);
    console.log('   Idioma:', siteInfo.language);
    console.log('   Logo URL:', siteInfo.logo.url);
    console.log('   Logo Fuente:', siteInfo.logo.source);
    console.log('');
    
    console.log('🎉 ¡ÉXITO! Todos los datos obtenidos correctamente');
    console.log('');
    console.log('📋 Resumen de lo que se mostrará en tu sitio:');
    console.log(`   Título del Hero: "${siteInfo.title}"`);
    console.log(`   Descripción del Hero: "${siteInfo.description}"`);
    console.log(`   URL del Logo: ${siteInfo.logo.url}`);
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.log('');
    console.log('🔧 Posibles soluciones:');
    console.log('   1. Verificar que WordPress esté funcionando: https://cms.vinylstation.es/wp-admin');
    console.log('   2. Comprobar que GraphQL esté activo: https://cms.vinylstation.es/graphql');
    console.log('   3. Verificar que hayas añadido título y descripción en Apariencia > Personalizar');
    console.log('   4. Asegurarte de que el plugin WPGraphQL esté activo');
  }
}

// Ejecutar test
testWordPressData();