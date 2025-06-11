#!/usr/bin/env node

/**
 * 🔍 DIAGNÓSTICO COMPLETO - Botón Amazon en Vinilos
 * Este script revisa por qué no aparece el botón de comprar en Amazon
 */

import { request, gql } from 'graphql-request';

const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';

console.log('🔍 === DIAGNÓSTICO BOTÓN AMAZON VINILOS ===\n');

// Función para diagnosticar un vinilo específico
async function diagnosticarVinilo(slug) {
  console.log(`📀 Diagnosticando vinilo: "${slug}"`);
  console.log('=' .repeat(50));
  
  const QUERY = gql`
    query DiagnosticoVinilo($slug: ID!) {
      vinilo(id: $slug, idType: SLUG) {
        databaseId
        title
        slug
        camposVinilo {
          vsPrecio
          vsArtista
          vsAlbum
          vsCategoria
          vsEnlaceAmazon
        }
      }
    }
  `;

  try {
    const { vinilo } = await request(WORDPRESS_GRAPHQL_URL, QUERY, { slug });
    
    if (!vinilo) {
      console.log('❌ Vinilo no encontrado\n');
      return false;
    }
    
    console.log(`✅ Vinilo encontrado: "${vinilo.title}"`);
    console.log(`📍 Database ID: ${vinilo.databaseId}`);
    console.log(`🔗 Slug: ${vinilo.slug}`);
    console.log('\n📋 Campos ACF:');
    
    const campos = vinilo.camposVinilo || {};
    
    console.log(`   💰 Precio: "${campos.vsPrecio || 'VACÍO'}"`);
    console.log(`   🎤 Artista: "${campos.vsArtista || 'VACÍO'}"`);
    console.log(`   💿 Álbum: "${campos.vsAlbum || 'VACÍO'}"`);
    console.log(`   🏷️ Categoría: "${campos.vsCategoria || 'VACÍO'}"`);
    console.log(`   🛒 Link Amazon: "${campos.vsEnlaceAmazon || 'VACÍO'}"`);
    
    // Diagnóstico específico del botón Amazon
    console.log('\n🛒 DIAGNÓSTICO BOTÓN AMAZON:');
    
    if (campos.vsEnlaceAmazon && campos.vsEnlaceAmazon.trim()) {
      console.log('✅ Campo vsEnlaceAmazon TIENE DATOS');
      console.log(`🔗 URL: ${campos.vsEnlaceAmazon}`);
      
      // Validar si la URL es válida
      try {
        new URL(campos.vsEnlaceAmazon);
        console.log('✅ URL es válida');
        
        if (campos.vsEnlaceAmazon.includes('amazon')) {
          console.log('✅ URL contiene "amazon"');
        } else {
          console.log('⚠️ URL NO contiene "amazon"');
        }
      } catch (e) {
        console.log('❌ URL no es válida');
      }
    } else {
      console.log('❌ Campo vsEnlaceAmazon está VACÍO');
      console.log('   💡 Problema: No hay link de Amazon configurado en WordPress');
    }
    
    console.log('\n' + '=' .repeat(50) + '\n');
    return !!campos.vsEnlaceAmazon;
    
  } catch (error) {
    console.error(`❌ Error consultando vinilo "${slug}":`, error.message);
    console.log('\n' + '=' .repeat(50) + '\n');
    return false;
  }
}

// Función para obtener todos los vinilos y ver cuántos tienen Amazon
async function diagnosticarTodosLosVinilos() {
  console.log('📊 DIAGNÓSTICO MASIVO - Todos los vinilos');
  console.log('=' .repeat(50));
  
  const QUERY_ALL = gql`
    query DiagnosticoTodosVinilos {
      vinilos(first: 50, where: {orderby: {field: DATE, order: DESC}}) {
        nodes {
          databaseId
          title
          slug
          camposVinilo {
            vsEnlaceAmazon
            vsPrecio
            vsArtista
          }
        }
      }
    }
  `;

  try {
    const { vinilos } = await request(WORDPRESS_GRAPHQL_URL, QUERY_ALL);
    
    const nodes = vinilos?.nodes || [];
    console.log(`📀 Total vinilos analizados: ${nodes.length}\n`);
    
    let conAmazon = 0;
    let sinAmazon = 0;
    const ejemplosConAmazon = [];
    const ejemplosSinAmazon = [];
    
    nodes.forEach((vinilo, index) => {
      const tieneAmazon = vinilo.camposVinilo?.vsEnlaceAmazon && vinilo.camposVinilo.vsEnlaceAmazon.trim();
      
      if (tieneAmazon) {
        conAmazon++;
        if (ejemplosConAmazon.length < 3) {
          ejemplosConAmazon.push({
            title: vinilo.title,
            slug: vinilo.slug,
            amazon: vinilo.camposVinilo.vsEnlaceAmazon
          });
        }
      } else {
        sinAmazon++;
        if (ejemplosSinAmazon.length < 3) {
          ejemplosSinAmazon.push({
            title: vinilo.title,
            slug: vinilo.slug,
            artista: vinilo.camposVinilo?.vsArtista || 'N/A'
          });
        }
      }
    });
    
    console.log('📊 ESTADÍSTICAS:');
    console.log(`✅ Con link Amazon: ${conAmazon} (${((conAmazon/nodes.length)*100).toFixed(1)}%)`);
    console.log(`❌ Sin link Amazon: ${sinAmazon} (${((sinAmazon/nodes.length)*100).toFixed(1)}%)`);
    
    if (ejemplosConAmazon.length > 0) {
      console.log('\n✅ EJEMPLOS CON AMAZON:');
      ejemplosConAmazon.forEach((ej, i) => {
        console.log(`   ${i+1}. "${ej.title}" (/${ej.slug})`);
        console.log(`      🔗 ${ej.amazon.substring(0, 80)}...`);
      });
    }
    
    if (ejemplosSinAmazon.length > 0) {
      console.log('\n❌ EJEMPLOS SIN AMAZON:');
      ejemplosSinAmazon.forEach((ej, i) => {
        console.log(`   ${i+1}. "${ej.title}" - ${ej.artista} (/${ej.slug})`);
      });
    }
    
    console.log('\n' + '=' .repeat(50) + '\n');
    
    return { conAmazon, sinAmazon, total: nodes.length, ejemplos: ejemplosConAmazon };
    
  } catch (error) {
    console.error('❌ Error en diagnóstico masivo:', error.message);
    return { conAmazon: 0, sinAmazon: 0, total: 0, ejemplos: [] };
  }
}

// Función para verificar el esquema GraphQL
async function verificarEsquemaACF() {
  console.log('🔍 VERIFICACIÓN ESQUEMA ACF');
  console.log('=' .repeat(50));
  
  const QUERY_SCHEMA = gql`
    query VerificarEsquema {
      __type(name: "Vinilo_Camposvinilo") {
        name
        fields {
          name
          type {
            name
          }
        }
      }
    }
  `;

  try {
    const result = await request(WORDPRESS_GRAPHQL_URL, QUERY_SCHEMA);
    
    if (result.__type) {
      console.log('✅ Tipo Vinilo_Camposvinilo encontrado');
      console.log('\n📋 Campos disponibles:');
      
      result.__type.fields.forEach(field => {
        console.log(`   • ${field.name} (${field.type?.name || 'Unknown'})`);
      });
      
      const campoAmazon = result.__type.fields.find(f => f.name === 'vsEnlaceAmazon');
      if (campoAmazon) {
        console.log('\n✅ Campo vsEnlaceAmazon existe en el esquema');
      } else {
        console.log('\n❌ Campo vsEnlaceAmazon NO existe en el esquema');
        console.log('   💡 Posible problema: Campo ACF no configurado correctamente');
      }
      
    } else {
      console.log('❌ Tipo Vinilo_Camposvinilo NO encontrado en el esquema');
      console.log('   💡 Posible problema: ACF no habilitado para GraphQL');
    }
    
    console.log('\n' + '=' .repeat(50) + '\n');
    
  } catch (error) {
    console.error('❌ Error verificando esquema:', error.message);
    console.log('   💡 Posible problema: GraphQL no soporta introspección de tipos\n');
  }
}

// Función principal de diagnóstico
async function main() {
  console.log('🚀 Iniciando diagnóstico completo...\n');
  
  // 1. Verificar esquema
  await verificarEsquemaACF();
  
  // 2. Diagnóstico masivo
  const stats = await diagnosticarTodosLosVinilos();
  
  // 3. Diagnóstico específico de algunos vinilos
  console.log('🔍 DIAGNÓSTICO ESPECÍFICO');
  console.log('=' .repeat(50));
  
  // Diagnosticar algunos vinilos específicos
  const vinolosTest = ['apostrophe', 'dark-side-moon', 'thriller']; // Ejemplos
  
  for (const slug of vinolosTest) {
    await diagnosticarVinilo(slug);
  }
  
  // 4. Si hay ejemplos con Amazon, diagnosticar uno
  if (stats.ejemplos && stats.ejemplos.length > 0) {
    console.log('✅ EJEMPLO FUNCIONANDO:');
    await diagnosticarVinilo(stats.ejemplos[0].slug);
  }
  
  // 5. Resumen y recomendaciones
  console.log('📝 RESUMEN Y RECOMENDACIONES');
  console.log('=' .repeat(50));
  
  if (stats.conAmazon === 0) {
    console.log('🚨 PROBLEMA CRÍTICO: NINGÚN vinilo tiene link de Amazon');
    console.log('\n💡 SOLUCIONES:');
    console.log('   1. Verificar que el campo ACF "vsEnlaceAmazon" existe en WordPress');
    console.log('   2. Verificar que el campo está habilitado para GraphQL');
    console.log('   3. Añadir links de Amazon a los vinilos desde el admin de WordPress');
    console.log('   4. Verificar permisos de GraphQL para campos ACF');
  } else if (stats.sinAmazon > stats.conAmazon) {
    console.log('⚠️ PROBLEMA PARCIAL: Muchos vinilos sin link de Amazon');
    console.log(`   • ${stats.conAmazon} vinilos tienen Amazon configurado ✅`);
    console.log(`   • ${stats.sinAmazon} vinilos necesitan configurar Amazon ❌`);
    console.log('\n💡 SOLUCIÓN:');
    console.log('   • Revisar y completar los links de Amazon en WordPress Admin');
  } else {
    console.log('✅ DIAGNÓSTICO: Campo ACF funciona correctamente');
    console.log('   • El problema puede ser en vinilos específicos sin datos');
  }
  
  console.log('\n🔧 PASOS SIGUIENTES:');
  console.log('   1. Acceder a WordPress Admin → Vinilos');
  console.log('   2. Editar un vinilo y verificar el campo "Link Amazon"');
  console.log('   3. Asegurarse de que el campo está visible y editable');
  console.log('   4. Guardar con un link de Amazon de prueba');
  console.log('   5. Probar en el frontend');
  
  console.log('\n✅ Diagnóstico completado\n');
}

// Ejecutar diagnóstico
main().catch(console.error);
