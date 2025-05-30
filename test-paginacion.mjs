// Test de paginación implementada
import { request, gql } from 'graphql-request';

const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';

console.log('🔍 PROBANDO PAGINACIÓN IMPLEMENTADA...\n');

// Simulando la función getNoticias con paginación
async function testPaginacion() {
  const QUERY = gql`
    query GetNoticias($first: Int!, $after: String) {
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
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categoriasNoticia {
            nodes {
              id
              name
              slug
            }
          }
        }
      }
    }
  `;

  let allNoticias = [];
  let hasNextPage = true;
  let cursor = null;
  let page = 1;
  
  console.log('📄 Iniciando paginación automática...\n');
  
  while (hasNextPage && allNoticias.length < 20000) {
    console.log(`🔄 Obteniendo página ${page}...`);
    
    const variables = { first: 100 };
    if (cursor) variables.after = cursor;
    
    try {
      const { noticias } = await request(WORDPRESS_GRAPHQL_URL, QUERY, variables);
      
      if (!noticias?.nodes || noticias.nodes.length === 0) {
        console.log('   ❌ No hay más noticias');
        break;
      }
      
      allNoticias = allNoticias.concat(noticias.nodes);
      hasNextPage = noticias.pageInfo.hasNextPage;
      cursor = noticias.pageInfo.endCursor;
      
      console.log(`   ✅ Página ${page}: ${noticias.nodes.length} noticias`);
      console.log(`   📊 Total acumulado: ${allNoticias.length}`);
      console.log(`   🔄 ¿Hay más páginas?: ${hasNextPage ? 'SÍ' : 'NO'}`);
      console.log('');
      
      page++;
      
      if (page > 50) {
        console.warn('⚠️ Límite de páginas alcanzado');
        break;
      }
    } catch (error) {
      console.error(`❌ Error en página ${page}:`, error.message);
      break;
    }
  }
  
  return allNoticias;
}

// Ejecutar test
const noticias = await testPaginacion();

console.log('🎯 RESULTADOS FINALES:');
console.log(`📊 Total de noticias obtenidas: ${noticias.length}`);

if (noticias.length > 100) {
  console.log('🎉 ¡ÉXITO! La paginación funciona y obtiene más de 100 noticias');
  
  // Contar noticias con imagen
  const conImagen = noticias.filter(n => n.featuredImage?.node?.sourceUrl).length;
  console.log(`📸 Noticias con imagen: ${conImagen}/${noticias.length} (${Math.round(conImagen/noticias.length*100)}%)`);
  
  // Contar por categorías
  const categoriaCount = {};
  noticias.forEach(n => {
    const cats = n.categoriasNoticia?.nodes || [];
    cats.forEach(cat => {
      categoriaCount[cat.name] = (categoriaCount[cat.name] || 0) + 1;
    });
  });
  
  console.log('\n🏷️ DISTRIBUCIÓN POR CATEGORÍAS:');
  Object.entries(categoriaCount).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} noticias`);
  });
  
  console.log('\n📋 MUESTRA DE LAS ÚLTIMAS 3 NOTICIAS:');
  noticias.slice(0, 3).forEach((n, i) => {
    console.log(`   ${i+1}. ${n.title}`);
    console.log(`      - Fecha: ${n.date}`);
    console.log(`      - Imagen: ${n.featuredImage?.node?.sourceUrl ? '✅ Sí' : '❌ No'}`);
    console.log('');
  });
  
} else {
  console.log('❌ La paginación no está funcionando correctamente');
}

console.log('\n🚀 SIGUIENTE PASO:');
console.log('Si el test es exitoso, ejecuta: .\\limpiar-y-test.bat');
console.log('El contador mostrará el total real de noticias');
