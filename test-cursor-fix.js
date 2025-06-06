// PRUEBA CORRECTA DEL FIX DE CURSOR PAGINATION
// Usa los mismos parámetros que la web real: 32 elementos por página

import { getVinilosPaginados } from './src/lib/wordpress.js';

console.log('🧪 PRUEBA CORRECTA DEL FIX DE CURSOR PAGINATION');
console.log('============================================');
console.log('Usando 32 elementos por página (igual que la web)\n');

async function probarPaginacionReal() {
  try {
    console.log('📄 Probando página 1 (elementos 1-32)...');
    const pagina1 = await getVinilosPaginados({ page: 1, itemsPerPage: 32 });
    
    console.log('📄 Probando página 2 (elementos 33-64)...');
    const pagina2 = await getVinilosPaginados({ page: 2, itemsPerPage: 32 });
    
    console.log('\n🔍 ANALIZANDO RESULTADOS:');
    console.log('======================');
    
    console.log(`\n📄 PÁGINA 1: ${pagina1.vinilos.length} elementos`);
    if (pagina1.vinilos.length > 0) {
      console.log(`   ✅ Primer elemento: "${pagina1.vinilos[0]?.title}" (ID: ${pagina1.vinilos[0]?.databaseId})`);
      console.log(`   ✅ Último elemento: "${pagina1.vinilos[pagina1.vinilos.length-1]?.title}" (ID: ${pagina1.vinilos[pagina1.vinilos.length-1]?.databaseId})`);
    }
    
    console.log(`\n📄 PÁGINA 2: ${pagina2.vinilos.length} elementos`);
    if (pagina2.vinilos.length > 0) {
      console.log(`   ✅ Primer elemento: "${pagina2.vinilos[0]?.title}" (ID: ${pagina2.vinilos[0]?.databaseId})`);
      console.log(`   ✅ Último elemento: "${pagina2.vinilos[pagina2.vinilos.length-1]?.title}" (ID: ${pagina2.vinilos[pagina2.vinilos.length-1]?.databaseId})`);
    }
    
    // VERIFICACIÓN CRÍTICA: Comprobar que NO hay elementos compartidos
    const ids1 = pagina1.vinilos.map(v => v.databaseId);
    const ids2 = pagina2.vinilos.map(v => v.databaseId);
    
    const elementosCompartidos = ids1.filter(id => ids2.includes(id));
    
    console.log('\n🎯 VERIFICACIÓN FINAL:');
    console.log('=====================');
    
    if (elementosCompartidos.length > 0) {
      console.log('❌ 🚨 FALLO: Las páginas comparten elementos!');
      console.log(`❌ Elementos compartidos: ${elementosCompartidos.length}`);
      console.log(`❌ IDs compartidos: ${elementosCompartidos}`);
      console.log('❌ 🚨 LA PAGINACIÓN NO FUNCIONA CORRECTAMENTE');
    } else {
      console.log('✅ 🎉 ÉXITO: Las páginas NO comparten elementos!');
      console.log('✅ 🎉 LA PAGINACIÓN FUNCIONA PERFECTAMENTE');
    }
    
    // Verificación adicional: Los IDs deberían estar en orden descendente
    const primerIdPag1 = pagina1.vinilos[0]?.databaseId;
    const ultimoIdPag1 = pagina1.vinilos[pagina1.vinilos.length-1]?.databaseId;
    const primerIdPag2 = pagina2.vinilos[0]?.databaseId;
    
    console.log('\n📈 VERIFICACIÓN DE ORDEN:');
    console.log('========================');
    console.log(`Página 1 - Primer ID: ${primerIdPag1}, Último ID: ${ultimoIdPag1}`);
    console.log(`Página 2 - Primer ID: ${primerIdPag2}`);
    
    if (primerIdPag2 && ultimoIdPag1 && primerIdPag2 < ultimoIdPag1) {
      console.log('✅ Orden correcto: Página 2 continúa donde acabó página 1');
    } else {
      console.log('⚠️ Verificar orden: Puede haber solapamiento o desorden');
    }
    
    console.log('\n📊 INFORMACIÓN DE PAGINACIÓN:');
    console.log('==============================');
    console.log(`Total elementos: ${pagina1.pageInfo.total}`);
    console.log(`Total páginas: ${pagina1.pageInfo.totalPages}`);
    console.log(`Página 1 tiene siguiente: ${pagina1.pageInfo.hasNext ? 'Sí' : 'No'}`);
    console.log(`Página 2 tiene anterior: ${pagina2.pageInfo.hasPrevious ? 'Sí' : 'No'}`);
    console.log(`Página 2 tiene siguiente: ${pagina2.pageInfo.hasNext ? 'Sí' : 'No'}`);
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    console.error('Stack:', error.stack);
  }
}

probarPaginacionReal();
