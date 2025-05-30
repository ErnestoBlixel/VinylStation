// debug-programas-estructura.mjs
// Script para analizar la estructura exacta de los programas del CPT

import { getProgramas, getProgramaBySlug } from './src/lib/wordpress.js';

console.log('🔍 DEBUGGEANDO ESTRUCTURA DE PROGRAMAS...\n');

async function debugProgramasEstructura() {
  try {
    // Obtener programas
    const { programas } = await getProgramas({ limit: 10 });
    
    console.log(`📻 Total de programas obtenidos: ${programas.length}\n`);
    
    if (programas.length === 0) {
      console.log('❌ No se obtuvieron programas. Posibles causas:');
      console.log('   1. No hay programas publicados en WordPress');
      console.log('   2. El CPT "programas" no está configurado correctamente');
      console.log('   3. WPGraphQL no está exponiendo el CPT');
      return;
    }
    
    // Analizar estructura de cada programa
    programas.forEach((programa, index) => {
      console.log(`\n📻 === PROGRAMA ${index + 1}: "${programa.title}" ===`);
      console.log(`   ID: ${programa.id}`);
      console.log(`   Slug: ${programa.slug}`);
      console.log(`   Fecha: ${programa.date}`);
      console.log(`   Excerpt: ${programa.excerpt || 'No tiene'}`);
      console.log(`   Content: ${programa.content ? 'Sí tiene' : 'No tiene'}`);
      
      // Imagen destacada
      if (programa.featuredImage?.node) {
        console.log(`   Imagen destacada: ${programa.featuredImage.node.sourceUrl}`);
      } else {
        console.log('   Imagen destacada: No tiene');
      }
      
      // Campos personalizados
      console.log(`\n   🏷️ CAMPOS PERSONALIZADOS:`);
      if (programa.camposPrograma) {
        console.log('   ✅ Tiene camposPrograma:');
        
        // Listar todos los campos disponibles
        Object.keys(programa.camposPrograma).forEach(campo => {
          const valor = programa.camposPrograma[campo];
          console.log(`      - ${campo}: ${typeof valor === 'object' ? JSON.stringify(valor, null, 8) : valor || 'null'}`);
        });
      } else {
        console.log('   ❌ NO tiene camposPrograma');
        console.log('   💡 Posibles nombres de campos personalizados:');
        
        // Buscar otros campos que podrían contener horarios
        const allKeys = Object.keys(programa);
        const possibleFields = allKeys.filter(key => 
          key.toLowerCase().includes('horario') || 
          key.toLowerCase().includes('schedule') ||
          key.toLowerCase().includes('tiempo') ||
          key.toLowerCase().includes('hora') ||
          key.toLowerCase().includes('meta') ||
          key.toLowerCase().includes('custom') ||
          key.toLowerCase().includes('field')
        );
        
        if (possibleFields.length > 0) {
          console.log(`      Campos posibles: ${possibleFields.join(', ')}`);
          possibleFields.forEach(field => {
            console.log(`      - ${field}: ${programa[field]}`);
          });
        } else {
          console.log('      No se encontraron campos con nombres relacionados a horarios');
        }
      }
      
      // Datos SEO
      if (programa.seo) {
        console.log(`\n   🎯 SEO:`);
        console.log(`      - title: ${programa.seo.title || 'No configurado'}`);
        console.log(`      - metaDesc: ${programa.seo.metaDesc || 'No configurado'}`);
      }
      
      console.log(`\n   📋 TODOS LOS CAMPOS DISPONIBLES:`);
      console.log(`      ${Object.keys(programa).join(', ')}`);
    });
    
    // Probar un programa específico en detalle
    if (programas.length > 0) {
      const primerPrograma = programas[0];
      console.log(`\n\n🔍 === ANÁLISIS DETALLADO DE: "${primerPrograma.title}" ===`);
      
      try {
        const programaDetalle = await getProgramaBySlug(primerPrograma.slug);
        
        if (programaDetalle) {
          console.log('✅ Programa obtenido correctamente en detalle');
          console.log('\n📊 ESTRUCTURA COMPLETA:');
          console.log(JSON.stringify(programaDetalle, null, 2));
        } else {
          console.log('❌ Error obteniendo programa por slug');
        }
      } catch (error) {
        console.log(`❌ Error en detalle: ${error.message}`);
      }
    }
    
    console.log('\n\n🎯 === RECOMENDACIONES ===');
    console.log('1. Verifica que en WordPress Admin > Programas:');
    console.log('   - Los programas tengan campos personalizados configurados');
    console.log('   - Los nombres de los campos coincidan con lo esperado');
    console.log('   - Los campos estén asociados al CPT "programas"');
    console.log('');
    console.log('2. Nombres de campos esperados:');
    console.log('   - vsHorarioTexto (para horarios de texto)');
    console.log('   - vsDescripcion (para descripción del programa)');
    console.log('   - vsCabecera (para imagen de cabecera)');
    console.log('');
    console.log('3. Si usas Advanced Custom Fields (ACF):');
    console.log('   - Asegúrate que WPGraphQL for ACF esté instalado y activado');
    console.log('   - Verifica que los campos estén expuestos en GraphQL');
    console.log('');
    console.log('4. Si usas otro plugin de campos personalizados:');
    console.log('   - Instala el addon de WPGraphQL correspondiente');
    console.log('   - O configura los campos manualmente en GraphQL');
    
  } catch (error) {
    console.error('❌ Error durante el debug:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verificar que WordPress esté accesible');
    console.log('2. Comprobar la URL de GraphQL');
    console.log('3. Verificar que WPGraphQL esté instalado y activado');
    console.log('4. Comprobar que el CPT "programas" esté registrado correctamente');
  }
}

// Ejecutar debug
debugProgramasEstructura();
