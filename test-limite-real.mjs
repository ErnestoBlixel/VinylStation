// Test para descubrir el límite real de WordPress GraphQL
import { request, gql } from 'graphql-request';

const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';

console.log('🔍 INVESTIGANDO EL LÍMITE REAL DE WORDPRESS GRAPHQL...\n');

// Función para probar diferentes límites
async function testLimit(limit) {
  const query = gql`
    query TestLimit($first: Int!) {
      noticias(first: $first) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        nodes {
          id
          title
          slug
        }
      }
    }
  `;

  try {
    const { noticias } = await request(WORDPRESS_GRAPHQL_URL, query, { first: limit });
    return {
      requested: limit,
      received: noticias.nodes.length,
      hasNextPage: noticias.pageInfo.hasNextPage,
      endCursor: noticias.pageInfo.endCursor
    };
  } catch (error) {
    return {
      requested: limit,
      received: 0,
      error: error.message
    };
  }
}

// Probar diferentes límites para encontrar el máximo real
const limites = [50, 100, 150, 200, 250, 300, 500, 1000];

console.log('📊 PROBANDO DIFERENTES LÍMITES:\n');

for (const limite of limites) {
  console.log(`🔄 Probando límite ${limite}...`);
  const resultado = await testLimit(limite);
  
  if (resultado.error) {
    console.log(`❌ Error con límite ${limite}: ${resultado.error}`);
  } else {
    console.log(`   Solicitado: ${resultado.requested}`);  
    console.log(`   Recibido: ${resultado.received}`);
    console.log(`   ¿Hay más?: ${resultado.hasNextPage ? 'SÍ' : 'NO'}`);
    
    if (resultado.received < resultado.requested && resultado.received > 0) {
      console.log(`⚠️  LÍMITE ENCONTRADO: WordPress solo devuelve máximo ${resultado.received} noticias`);
      break;
    }
  }
  console.log('');
}

// Ahora probemos paginación para obtener TODAS las noticias
console.log('\n🔄 PROBANDO PAGINACIÓN PARA OBTENER TODAS LAS NOTICIAS...\n');

let allNoticias = [];
let hasNextPage = true;
let cursor = null;
let page = 1;

while (hasNextPage && page <= 10) { // Máximo 10 páginas para evitar bucle infinito
  console.log(`📄 Obteniendo página ${page}...`);
  
  const query = gql`
    query GetNoticiasWithPagination($first: Int!, $after: String) {
      noticias(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
        nodes {
          id
          title
          slug
          date
        }
      }
    }
  `;

  try {
    const variables = { first: 100 };
    if (cursor) variables.after = cursor;
    
    const { noticias } = await request(WORDPRESS_GRAPHQL_URL, query, variables);
    
    allNoticias = allNoticias.concat(noticias.nodes);
    hasNextPage = noticias.pageInfo.hasNextPage;
    cursor = noticias.pageInfo.endCursor;
    
    console.log(`   Noticias en esta página: ${noticias.nodes.length}`);
    console.log(`   Total acumulado: ${allNoticias.length}`);
    console.log(`   ¿Hay más páginas?: ${hasNextPage ? 'SÍ' : 'NO'}`);
    console.log('');
    
    page++;
  } catch (error) {
    console.error(`❌ Error en página ${page}:`, error.message);
    break;
  }
}

console.log('🎯 RESULTADOS FINALES:');
console.log(`📊 Total de noticias obtenidas con paginación: ${allNoticias.length}`);
console.log(`📄 Páginas utilizadas: ${page - 1}`);

if (allNoticias.length >= 260) {
  console.log('✅ ¡PERFECTO! Se pueden obtener todas las noticias usando paginación');
  console.log('\n💡 SOLUCIÓN: Necesitamos usar paginación en lugar de un límite alto');
} else {
  console.log('⚠️  Puede que haya más noticias, pero necesitamos más páginas');
}

console.log('\n🔧 PRÓXIMO PASO:');
if (allNoticias.length > 100) {
  console.log('Implementar paginación en el código de Astro para obtener TODAS las noticias');
} else {
  console.log('Investigar por qué no se obtienen más de 100 noticias');
}
