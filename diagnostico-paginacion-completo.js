// DIAGNÓSTICO COMPLETO DEL PROBLEMA DE PAGINACIÓN
// Este script va a probar diferentes métodos de paginación

import { request, gql } from 'graphql-request';

const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';

console.log('🔍 DIAGNÓSTICO COMPLETO DE PAGINACIÓN\n');
console.log('=====================================');

async function diagnosticarPaginacion() {
  
  // TEST 1: Verificar si offset pagination está disponible
  console.log('\n📋 TEST 1: Verificar disponibilidad de offset pagination');
  console.log('-------------------------------------------------------');
  
  const QUERY_SCHEMA = gql`
    query IntrospectVinilos {
      __type(name: "RootQueryToViniloConnectionWhereArgs") {
        fields {
          name
          type {
            name
            kind
          }
        }
      }
    }
  `;
  
  try {
    const schemaData = await request(WORDPRESS_GRAPHQL_URL, QUERY_SCHEMA);
    const fields = schemaData?.__type?.fields || [];
    const hasOffsetPagination = fields.some(field => field.name === 'offsetPagination');
    
    console.log(`✅ Campos disponibles: ${fields.map(f => f.name).join(', ')}`);
    console.log(`${hasOffsetPagination ? '✅' : '❌'} offsetPagination disponible: ${hasOffsetPagination}`);
    
    if (!hasOffsetPagination) {
      console.log('❌ PROBLEMA: El plugin wp-graphql-offset-pagination no está activo o instalado');
    }
  } catch (error) {
    console.log('❌ Error verificando schema:', error.message);
  }
  
  // TEST 2: Probar consulta básica sin paginación
  console.log('\n📋 TEST 2: Consulta básica (primeros 5 vinilos)');
  console.log('-----------------------------------------------');
  
  const QUERY_BASIC = gql`
    query GetBasicVinilos {
      vinilos(first: 5, where: {orderby: {field: DATE, order: DESC}}) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        nodes {
          databaseId
          title
          slug
          date
          camposVinilo {
            vsArtista
          }
        }
      }
    }
  `;
  
  try {
    const basicData = await request(WORDPRESS_GRAPHQL_URL, QUERY_BASIC);
    const nodes = basicData?.vinilos?.nodes || [];
    
    console.log(`✅ Obtenidos ${nodes.length} vinilos básicos:`);
    nodes.forEach((v, i) => {
      console.log(`  ${i+1}. "${v.title}" - ${v.camposVinilo?.vsArtista || 'N/A'} (ID: ${v.databaseId})`);
    });
  } catch (error) {
    console.log('❌ Error en consulta básica:', error.message);
  }
  
  // TEST 3: Probar offset pagination
  console.log('\n📋 TEST 3: Probar offset pagination (offset: 5)');
  console.log('-----------------------------------------------');
  
  const QUERY_OFFSET = gql`
    query TestOffsetPagination {
      vinilos(
        first: 5
        where: {
          offsetPagination: { offset: 5 }
          orderby: { field: DATE, order: DESC }
        }
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        nodes {
          databaseId
          title
          slug
          date
          camposVinilo {
            vsArtista
          }
        }
      }
    }
  `;
  
  try {
    const offsetData = await request(WORDPRESS_GRAPHQL_URL, QUERY_OFFSET);
    const nodes = offsetData?.vinilos?.nodes || [];
    
    console.log(`✅ Obtenidos ${nodes.length} vinilos con offset:`);
    nodes.forEach((v, i) => {
      console.log(`  ${i+6}. "${v.title}" - ${v.camposVinilo?.vsArtista || 'N/A'} (ID: ${v.databaseId})`);
    });
    
    if (nodes.length === 0) {
      console.log('❌ PROBLEMA: Offset pagination no devuelve resultados');
    }
  } catch (error) {
    console.log('❌ Error en offset pagination:', error.message);
    console.log('❌ Esto confirma que el plugin offset pagination no funciona');
  }
  
  // TEST 4: Probar cursor pagination
  console.log('\n📋 TEST 4: Probar cursor pagination alternativo');
  console.log('--------------------------------------------');
  
  const QUERY_CURSOR = gql`
    query TestCursorPagination($after: String) {
      vinilos(first: 10, after: $after, where: {orderby: {field: DATE, order: DESC}}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          databaseId
          title
          slug
          date
          camposVinilo {
            vsArtista
          }
        }
      }
    }
  `;
  
  try {
    // Primera consulta para obtener los primeros 10
    const firstBatch = await request(WORDPRESS_GRAPHQL_URL, QUERY_CURSOR);
    const firstNodes = firstBatch?.vinilos?.nodes || [];
    const endCursor = firstBatch?.vinilos?.pageInfo?.endCursor;
    
    console.log(`✅ Primera tanda - ${firstNodes.length} vinilos:`);
    firstNodes.forEach((v, i) => {
      console.log(`  ${i+1}. "${v.title}" - ${v.camposVinilo?.vsArtista || 'N/A'}`);
    });
    
    if (endCursor) {
      // Segunda consulta usando el cursor
      const secondBatch = await request(WORDPRESS_GRAPHQL_URL, QUERY_CURSOR, { after: endCursor });
      const secondNodes = secondBatch?.vinilos?.nodes || [];
      
      console.log(`\n✅ Segunda tanda - ${secondNodes.length} vinilos:`);
      secondNodes.forEach((v, i) => {
        console.log(`  ${i+11}. "${v.title}" - ${v.camposVinilo?.vsArtista || 'N/A'}`);
      });
      
      // Verificar que son diferentes
      const primerTitulo1 = firstNodes[0]?.title;
      const primerTitulo2 = secondNodes[0]?.title;
      
      if (primerTitulo1 === primerTitulo2) {
        console.log('❌ PROBLEMA: Cursor pagination también devuelve los mismos resultados');
      } else {
        console.log('✅ Cursor pagination funciona correctamente');
      }
    }
  } catch (error) {
    console.log('❌ Error en cursor pagination:', error.message);
  }
  
  // TEST 5: Verificar total de vinilos
  console.log('\n📋 TEST 5: Verificar total de vinilos disponibles');
  console.log('-----------------------------------------------');
  
  const QUERY_COUNT = gql`
    query CountVinilos {
      vinilos(first: 1) {
        pageInfo {
          hasNextPage
        }
      }
    }
  `;
  
  try {
    // Hacer múltiples consultas para estimar el total
    let total = 0;
    let hasMore = true;
    let batchSize = 100;
    
    while (hasMore && total < 1000) { // Límite de seguridad
      const countData = await request(WORDPRESS_GRAPHQL_URL, gql`
        query CountBatch($first: Int!, $offset: Int!) {
          vinilos(first: $first, where: { offsetPagination: { offset: ${total} } }) {
            pageInfo {
              hasNextPage
            }
            nodes {
              databaseId
            }
          }
        }
      `);
      
      const nodes = countData?.vinilos?.nodes || [];
      total += nodes.length;
      hasMore = countData?.vinilos?.pageInfo?.hasNextPage && nodes.length === batchSize;
      
      if (nodes.length < batchSize) hasMore = false;
    }
    
    console.log(`📊 Total estimado de vinilos: ${total}`);
  } catch (error) {
    console.log('⚠️ No se pudo verificar el total:', error.message);
  }
  
  console.log('\n🎯 RESUMEN DEL DIAGNÓSTICO');
  console.log('========================');
  console.log('Si offset pagination falló pero cursor funciona:');
  console.log('  → Solución: Usar cursor pagination con cálculo manual');
  console.log('Si ambos fallan:');
  console.log('  → Problema: Configuración de WordPress o plugin');
  console.log('Si offset funciona:');
  console.log('  → Problema: Error en implementación frontend');
}

diagnosticarPaginacion().catch(console.error);
