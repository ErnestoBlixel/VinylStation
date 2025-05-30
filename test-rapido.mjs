#!/usr/bin/env node

/**
 * VERIFICACIÓN RÁPIDA - PAGINACIÓN REAL DEL SERVIDOR
 * Comprueba que la implementación funcione en 30 segundos
 */

import { getVinilos, getArtistasUnicos } from './src/lib/wordpress.js';

console.log('⚡ VERIFICACIÓN RÁPIDA - PAGINACIÓN REAL DEL SERVIDOR\n');

async function verificacionRapida() {
  try {
    console.log('1️⃣ Probando página 1...');
    const startTime = Date.now();
    const page1 = await getVinilos({ page: 1, itemsPerPage: 20 });
    const time1 = Date.now() - startTime;
    
    console.log('2️⃣ Probando página 2...');
    const page2 = await getVinilos({ page: 2, itemsPerPage: 20 });
    
    console.log('3️⃣ Probando artistas únicos...');
    const artistas = await getArtistasUnicos();
    
    // Verificar que los vinilos son diferentes
    const diferentes = !page2.vinilos.some(v2 => 
      page1.vinilos.some(v1 => v1.databaseId === v2.databaseId)
    );
    
    console.log('\n📊 RESULTADOS:');
    console.log(`✅ Página 1: ${page1.vinilos.length} vinilos en ${time1}ms`);
    console.log(`✅ Página 2: ${page2.vinilos.length} vinilos`);
    console.log(`✅ Total: ${page1.pageInfo.total} vinilos`);
    console.log(`✅ Artistas únicos: ${artistas.count}`);
    console.log(`✅ Vinilos diferentes: ${diferentes ? 'SÍ' : 'NO'}`);
    console.log(`✅ Paginación: ${page1.pageInfo.hasNext ? 'FUNCIONA' : 'NO FUNCIONA'}`);
    
    if (time1 < 3000 && diferentes && page1.vinilos.length === 20) {
      console.log('\n🎉 ¡TODO PERFECTO! La paginación real del servidor funciona.');
      console.log('   Puedes proceder a probar en el navegador.');
    } else {
      console.log('\n⚠️ HAY PROBLEMAS:');
      if (time1 >= 3000) console.log('   - Tiempo de carga lento');
      if (!diferentes) console.log('   - Los vinilos se repiten entre páginas');
      if (page1.vinilos.length !== 20) console.log('   - No se cargan exactamente 20 vinilos');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.log('\n🔧 POSIBLES SOLUCIONES:');
    console.log('   1. Verificar que WordPress esté funcionando');
    console.log('   2. Comprobar conexión a: https://cms.vinylstation.es/graphql');
    console.log('   3. El sistema usará fallback automáticamente si offsetPagination no está disponible');
  }
}

verificacionRapida();
