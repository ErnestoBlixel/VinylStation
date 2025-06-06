// SCRIPT DE PRUEBA RÁPIDA PARA VERIFICAR EL FIX DE PAGINACIÓN
// Ejecutar con: node test-paginacion-fix.js

import { getVinilosPaginados } from './src/lib/wordpress.js';

console.log('🧪 INICIANDO PRUEBA DEL FIX DE PAGINACIÓN...\n');

async function testPaginacion() {
  try {
    console.log('📄 Probando página 1...');
    const pagina1 = await getVinilosPaginados({ page: 1, itemsPerPage: 5 });
    
    console.log('📄 Probando página 2...');
    const pagina2 = await getVinilosPaginados({ page: 2, itemsPerPage: 5 });
    
    console.log('📄 Probando página 3...');
    const pagina3 = await getVinilosPaginados({ page: 3, itemsPerPage: 5 });
    
    console.log('\n🔍 RESULTADOS:');
    console.log('================');
    
    console.log('\n📄 PÁGINA 1:');
    pagina1.vinilos.forEach((v, i) => {
      console.log(`  ${i+1}. "${v.title}" - ${v.camposVinilo?.vsArtista || 'N/A'}`);
    });
    
    console.log('\n📄 PÁGINA 2:');
    pagina2.vinilos.forEach((v, i) => {
      console.log(`  ${i+6}. "${v.title}" - ${v.camposVinilo?.vsArtista || 'N/A'}`);
    });
    
    console.log('\n📄 PÁGINA 3:');
    pagina3.vinilos.forEach((v, i) => {
      console.log(`  ${i+11}. "${v.title}" - ${v.camposVinilo?.vsArtista || 'N/A'}`);
    });
    
    // Verificar que son diferentes
    const primerViniloPag1 = pagina1.vinilos[0]?.title;
    const primerViniloPag2 = pagina2.vinilos[0]?.title;
    const primerViniloPag3 = pagina3.vinilos[0]?.title;
    
    console.log('\n🎯 VERIFICACIÓN:');
    console.log('================');
    
    if (primerViniloPag1 === primerViniloPag2) {
      console.log('❌ ERROR: Página 1 y 2 muestran el mismo contenido');
      console.log('❌ FIX NO FUNCIONÓ - problema persiste');
    } else {
      console.log('✅ ÉXITO: Página 1 y 2 muestran contenido diferente');
    }
    
    if (primerViniloPag2 === primerViniloPag3) {
      console.log('❌ ERROR: Página 2 y 3 muestran el mismo contenido');
      console.log('❌ FIX NO FUNCIONÓ - problema persiste');
    } else {
      console.log('✅ ÉXITO: Página 2 y 3 muestran contenido diferente');
    }
    
    if (primerViniloPag1 !== primerViniloPag2 && primerViniloPag2 !== primerViniloPag3) {
      console.log('\n🎉 ¡FIX EXITOSO! La paginación ahora funciona correctamente');
    } else {
      console.log('\n❌ FIX FALLÓ - revisar logs para más detalles');
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

testPaginacion();
