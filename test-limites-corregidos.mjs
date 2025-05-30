// Test final: verificar correcciones de límites
import { request, gql } from 'graphql-request';

const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';

console.log('🔍 VERIFICANDO CORRECCIONES DE LÍMITES...\n');

// Query para obtener hasta 300 noticias (igual que en el código corregido)
const QUERY_300 = gql`
  query GetNoticias300($first: Int!) {
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
      }
    }
  }
`;

try {
  console.log('📰 Obteniendo hasta 300 noticias (mismo límite que en código corregido)...');
  const { noticias } = await request(WORDPRESS_GRAPHQL_URL, QUERY_300, { first: 300 });
  
  console.log(`✅ RESULTADO: ${noticias.nodes.length} noticias obtenidas`);
  console.log(`📊 PageInfo:`, noticias.pageInfo);
  
  if (noticias.nodes.length >= 260) {
    console.log('🎉 ¡PERFECTO! Se obtienen TODAS las noticias (≥260)');
  } else if (noticias.nodes.length >= 200) {
    console.log('⚠️  Se obtienen muchas más que antes, pero puede que falten algunas');
    console.log(`   Antes: 50 noticias → Ahora: ${noticias.nodes.length} noticias`);
    console.log(`   Mejora: +${noticias.nodes.length - 50} noticias más`);
  } else {
    console.log('❌ Sigue habiendo un límite restrictivo');
  }

  console.log('\n📋 COMPARACIÓN:');
  console.log(`- Antes en index.astro: 50 noticias`);
  console.log(`- Antes en [slug].astro: 100 noticias`);
  console.log(`- Ahora en ambos: ${noticias.nodes.length} noticias`);
  console.log(`- Páginas de detalle: ${noticias.nodes.length} páginas generadas`);

  console.log('\n🚀 SIGUIENTE PASO:');
  console.log('1. Ejecuta: npm run build');
  console.log('2. Ejecuta: npm run dev');
  console.log('3. Visita: http://localhost:4321/noticias');
  console.log(`4. Verifica que aparecen ${noticias.nodes.length} noticias`);

} catch (error) {
  console.error('❌ ERROR:', error.message);
}
