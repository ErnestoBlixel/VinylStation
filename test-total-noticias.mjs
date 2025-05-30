// Test para verificar cuántas noticias hay realmente
import { request, gql } from 'graphql-request';

const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';

console.log('🔍 VERIFICANDO TOTAL DE NOTICIAS DISPONIBLES...\n');

// Query para obtener información de paginación
const QUERY_INFO = gql`
  query GetNoticiasInfo {
    noticias(first: 1) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
  }
`;

// Query para obtener un número alto de noticias
const QUERY_MUCHAS = gql`
  query GetMuchasNoticias($first: Int!) {
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
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

try {
  console.log('📊 Obteniendo información de paginación...');
  const info = await request(WORDPRESS_GRAPHQL_URL, QUERY_INFO);
  console.log('PageInfo:', info.noticias.pageInfo);

  console.log('\n📰 Intentando obtener 100 noticias...');
  const { noticias: noticias100 } = await request(WORDPRESS_GRAPHQL_URL, QUERY_MUCHAS, { first: 100 });
  console.log(`✅ Con first: 100 → ${noticias100.nodes.length} noticias obtenidas`);
  console.log('¿Hay más páginas?', noticias100.pageInfo.hasNextPage);

  console.log('\n📰 Intentando obtener 200 noticias...');
  const { noticias: noticias200 } = await request(WORDPRESS_GRAPHQL_URL, QUERY_MUCHAS, { first: 200 });
  console.log(`✅ Con first: 200 → ${noticias200.nodes.length} noticias obtenidas`);
  console.log('¿Hay más páginas?', noticias200.pageInfo.hasNextPage);

  console.log('\n📰 Intentando obtener 300 noticias...');
  const { noticias: noticias300 } = await request(WORDPRESS_GRAPHQL_URL, QUERY_MUCHAS, { first: 300 });
  console.log(`✅ Con first: 300 → ${noticias300.nodes.length} noticias obtenidas`);
  console.log('¿Hay más páginas?', noticias300.pageInfo.hasNextPage);

  console.log('\n🎯 ANÁLISIS:');
  console.log(`- Máximo obtenido: ${Math.max(noticias100.nodes.length, noticias200.nodes.length, noticias300.nodes.length)} noticias`);
  
  if (noticias300.nodes.length === 260) {
    console.log('✅ ¡Perfecto! Se pueden obtener las 260 noticias');
  } else if (noticias300.nodes.length < 260) {
    console.log(`⚠️ Solo se obtienen ${noticias300.nodes.length} de 260 noticias`);
    console.log('Posibles causas:');
    console.log('- Límite de WordPress GraphQL');
    console.log('- Noticias en borrador/no publicadas');
    console.log('- Configuración de paginación');
  }

} catch (error) {
  console.error('❌ ERROR:', error.message);
  if (error.response?.errors) {
    error.response.errors.forEach(err => {
      console.log(`- ${err.message}`);
    });
  }
}
