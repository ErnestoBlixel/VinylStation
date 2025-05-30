// test-seo-yoast.mjs
// Script para probar que los datos de SEO de Yoast se obtienen correctamente

import { getViniloBySlug, getProgramaBySlug, getVinilos, getProgramas } from './src/lib/wordpress.js';

console.log('🧪 Probando obtención de datos SEO de Yoast...\n');

async function testSEOData() {
  try {
    console.log('📀 === PRUEBA DE VINILOS ===');
    
    // Obtener algunos vinilos
    const { vinilos } = await getVinilos({ limit: 3 });
    
    if (vinilos.length > 0) {
      console.log(`✅ Se obtuvieron ${vinilos.length} vinilos`);
      
      // Probar el primer vinilo en detalle
      const primerVinilo = vinilos[0];
      console.log(`\n📀 Probando vinilo: "${primerVinilo.title}" (slug: ${primerVinilo.slug})`);
      
      const viniloDetalle = await getViniloBySlug(primerVinilo.slug);
      
      if (viniloDetalle) {
        console.log('   ✅ Vinilo obtenido correctamente');
        console.log('   📝 Datos SEO de Yoast:');
        console.log(`      - Título SEO: ${viniloDetalle.seo?.title || 'No configurado'}`);
        console.log(`      - Meta descripción: ${viniloDetalle.seo?.metaDesc || 'No configurada'}`);
        console.log(`      - OpenGraph título: ${viniloDetalle.seo?.opengraphTitle || 'No configurado'}`);
        console.log(`      - OpenGraph descripción: ${viniloDetalle.seo?.opengraphDescription || 'No configurada'}`);
        
        // Verificar si se está usando Yoast o fallback
        if (viniloDetalle.seo?.title || viniloDetalle.seo?.metaDesc) {
          console.log('   🎯 ¡Datos de Yoast SEO detectados!');
        } else {
          console.log('   ⚠️ No se detectaron datos de Yoast SEO, usando fallbacks');
        }
      } else {
        console.log('   ❌ Error obteniendo detalle del vinilo');
      }
    } else {
      console.log('⚠️ No se encontraron vinilos');
    }
    
    console.log('\n📻 === PRUEBA DE PROGRAMAS ===');
    
    // Obtener algunos programas
    const { programas } = await getProgramas({ limit: 3 });
    
    if (programas.length > 0) {
      console.log(`✅ Se obtuvieron ${programas.length} programas`);
      
      // Probar el primer programa en detalle
      const primerPrograma = programas[0];
      console.log(`\n📻 Probando programa: "${primerPrograma.title}" (slug: ${primerPrograma.slug})`);
      
      const programaDetalle = await getProgramaBySlug(primerPrograma.slug);
      
      if (programaDetalle) {
        console.log('   ✅ Programa obtenido correctamente');
        console.log('   📝 Datos SEO de Yoast:');
        console.log(`      - Título SEO: ${programaDetalle.seo?.title || 'No configurado'}`);
        console.log(`      - Meta descripción: ${programaDetalle.seo?.metaDesc || 'No configurada'}`);
        console.log(`      - OpenGraph título: ${programaDetalle.seo?.opengraphTitle || 'No configurado'}`);
        console.log(`      - OpenGraph descripción: ${programaDetalle.seo?.opengraphDescription || 'No configurada'}`);
        
        // Verificar si se está usando Yoast o fallback
        if (programaDetalle.seo?.title || programaDetalle.seo?.metaDesc) {
          console.log('   🎯 ¡Datos de Yoast SEO detectados!');
        } else {
          console.log('   ⚠️ No se detectaron datos de Yoast SEO, usando fallbacks');
        }
        
        // Mostrar también datos de campos personalizados si están disponibles
        if (programaDetalle.camposPrograma) {
          console.log('   📋 Campos personalizados del programa:');
          console.log(`      - Descripción: ${programaDetalle.camposPrograma.vsDescripcion || 'No configurada'}`);
          console.log(`      - Horario: ${programaDetalle.camposPrograma.vsHorarioTexto || 'No configurado'}`);
        }
      } else {
        console.log('   ❌ Error obteniendo detalle del programa');
      }
    } else {
      console.log('⚠️ No se encontraron programas');
    }
    
    console.log('\n🎯 === RESUMEN ===');
    console.log('✅ Las funciones han sido actualizadas para obtener datos de Yoast SEO');
    console.log('✅ Se incluyen títulos, meta descripciones y datos de OpenGraph');
    console.log('✅ Si Yoast no está configurado, se usan fallbacks apropiados');
    console.log('\n💡 Para que funcione completamente, asegúrate de que:');
    console.log('   1. Yoast SEO esté instalado y activado en WordPress');
    console.log('   2. Los datos SEO estén configurados en cada vinilo/programa');
    console.log('   3. WPGraphQL Yoast SEO addon esté instalado y activado');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Verificar que WordPress esté accesible');
    console.log('   2. Comprobar que GraphQL esté funcionando');
    console.log('   3. Instalar WPGraphQL Yoast SEO addon si no estás obteniendo datos SEO');
  }
}

// Ejecutar pruebas
testSEOData();
