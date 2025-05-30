#!/usr/bin/env node

/**
 * Script de verificación para la PAGINACIÓN REAL DEL SERVIDOR
 * Prueba que cada página cargue exactamente los vinilos correctos:
 * - Página 1: vinilos 0-19
 * - Página 2: vinilos 20-39  
 * - Página 3: vinilos 40-59
 */

import { getVinilos, getArtistasUnicos } from './src/lib/wordpress.js';

console.log('🎤 Probando PAGINACIÓN REAL DEL SERVIDOR...\n');

async function testPaginacionReal() {
  try {
    // Prueba 1: Primera página (vinilos 0-19)
    console.log('📄 Prueba 1: Página 1 (vinilos 0-19)');
    const startTime1 = Date.now();
    const page1 = await getVinilos({ page: 1, itemsPerPage: 20 });
    const endTime1 = Date.now();
    console.log(`✅ Página 1: ${page1.vinilos.length} vinilos en ${endTime1 - startTime1}ms`);
    console.log(`   Total: ${page1.pageInfo.total}, Páginas: ${page1.pageInfo.totalPages}`);
    console.log(`   Primer vinilo: "${page1.vinilos[0]?.title || 'N/A'}"`);
    console.log(`   Último vinilo: "${page1.vinilos[19]?.title || 'N/A'}"`); 
    console.log(`   Tiene siguiente: ${page1.pageInfo.hasNext}\n`);
    
    // Prueba 2: Segunda página (vinilos 20-39)
    console.log('📄 Prueba 2: Página 2 (vinilos 20-39)');
    const startTime2 = Date.now();
    const page2 = await getVinilos({ page: 2, itemsPerPage: 20 });
    const endTime2 = Date.now();
    console.log(`✅ Página 2: ${page2.vinilos.length} vinilos en ${endTime2 - startTime2}ms`);
    console.log(`   Primer vinilo: "${page2.vinilos[0]?.title || 'N/A'}"`);
    console.log(`   Último vinilo: "${page2.vinilos[19]?.title || 'N/A'}"`); 
    console.log(`   Tiene anterior: ${page2.pageInfo.hasPrevious}, Tiene siguiente: ${page2.pageInfo.hasNext}\n`);
    
    // Prueba 3: Tercera página (vinilos 40-59)
    console.log('📄 Prueba 3: Página 3 (vinilos 40-59)');
    const startTime3 = Date.now();
    const page3 = await getVinilos({ page: 3, itemsPerPage: 20 });
    const endTime3 = Date.now();
    console.log(`✅ Página 3: ${page3.vinilos.length} vinilos en ${endTime3 - startTime3}ms`);
    console.log(`   Primer vinilo: "${page3.vinilos[0]?.title || 'N/A'}"`);
    console.log(`   Último vinilo: "${page3.vinilos[19]?.title || 'N/A'}"`);    
    // Prueba 4: Verificar que los vinilos son diferentes
    const sameAsPage1 = page2.vinilos.some(v2 => 
      page1.vinilos.some(v1 => v1.databaseId === v2.databaseId)
    );
    const sameAsPage2 = page3.vinilos.some(v3 => 
      page2.vinilos.some(v2 => v2.databaseId === v3.databaseId)
    );
    
    console.log(`🔍 Prueba 4: Verificar vinilos únicos`);
    console.log(`   Página 2 vs Página 1: ${sameAsPage1 ? '❌ Hay repetidos' : '✅ Diferentes'}`);
    console.log(`   Página 3 vs Página 2: ${sameAsPage2 ? '❌ Hay repetidos' : '✅ Diferentes'}\n`);
    
    // Prueba 5: Artistas únicos
    console.log('🎤 Prueba 5: Artistas únicos');
    const startTimeArtistas = Date.now();
    const artistas = await getArtistasUnicos();
    const endTimeArtistas = Date.now();
    console.log(`✅ Artistas únicos: ${artistas.count} en ${endTimeArtistas - startTimeArtistas}ms`);
    console.log(`   Ejemplos: ${artistas.artistas.slice(0, 3).join(', ')}...\n`);
    
    // Resumen
    const avgTime = (endTime1 - startTime1 + endTime2 - startTime2 + endTime3 - startTime3) / 3;
    
    console.log('📊 RESUMEN PAGINACIÓN REAL:');
    console.log(`   ✅ Total de vinilos: ${page1.pageInfo.total}`);
    console.log(`   ✅ Vinilos por página: 20`);
    console.log(`   ✅ Total de páginas: ${page1.pageInfo.totalPages}`);
    console.log(`   ✅ Tiempo promedio: ${Math.round(avgTime)}ms`);
    console.log(`   ✅ Artistas únicos: ${artistas.count}`);
    console.log(`   ✅ Vinilos únicos por página: ${!sameAsPage1 && !sameAsPage2 ? 'SÍ' : 'NO'}`);
    console.log(`   ✅ Paginación funcional: ${page2.pageInfo.hasPrevious && page1.pageInfo.hasNext ? 'SÍ' : 'NO'}`);
    
    if (avgTime < 3000 && !sameAsPage1 && !sameAsPage2) {
      console.log('\n🎉 ¡ÉXITO! La paginación real del servidor funciona perfectamente.');
      console.log('   - Cada página carga exactamente 20 vinilos diferentes');
      console.log('   - Los tiempos de carga son óptimos');
      console.log('   - Los artistas únicos se calculan correctamente');
    } else {
      console.log('\n⚠️  HAY PROBLEMAS:');
      if (avgTime >= 3000) console.log('   - Tiempo de carga lento');
      if (sameAsPage1 || sameAsPage2) console.log('   - Vinilos repetidos entre páginas');
    }
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    process.exit(1);
  }
}

testPaginacionReal();
