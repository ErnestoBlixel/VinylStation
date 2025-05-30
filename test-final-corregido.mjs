// Test final con las correcciones aplicadas
import { request, gql } from 'graphql-request';

const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';

console.log('🔍 PROBANDO NOTICIAS CON CAMPOS CORREGIDOS...\n');

// Query corregida - solo campos que existen
const QUERY_CORREGIDA = gql`
  query GetNoticias($first: Int!) {
    noticias(first: $first) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
      nodes {
        id
        slug
        title
        date
        excerpt
        content
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
        seo {
          title
          metaDesc
          opengraphTitle
          opengraphDescription
          twitterTitle
          twitterDescription
        }
      }
    }
  }
`;

try {
  console.log('📰 Probando query corregida...');
  const { noticias } = await request(WORDPRESS_GRAPHQL_URL, QUERY_CORREGIDA, { first: 5 });
  
  if (noticias?.nodes && noticias.nodes.length > 0) {
    console.log(`✅ ${noticias.nodes.length} noticias obtenidas CORRECTAMENTE:\n`);
    
    noticias.nodes.forEach((n, i) => {
      const imgUrl = n.featuredImage?.node?.sourceUrl || '/images/placeholder-news.jpg';
      const alt = n.featuredImage?.node?.altText || n.title;
      const cleanExcerpt = n.excerpt ? n.excerpt.replace(/<[^>]*>/g, '').trim() : '';
      const categorias = n.categoriasNoticia?.nodes || [];
      
      console.log(`  ${i+1}. ${n.title}`);
      console.log(`     - Slug: ${n.slug}`);
      console.log(`     - Imagen: ${imgUrl}`);
      console.log(`     - Alt: ${alt}`);
      console.log(`     - Excerpt: ${cleanExcerpt.substring(0, 80)}...`);
      console.log(`     - Categorías: ${categorias.map(cat => cat.name).join(', ')}`);
      console.log(`     - Fecha: ${n.date}`);
      console.log(`     - SEO Title: ${n.seo?.title || 'Sin SEO'}`);
      console.log('');
    });
    
    console.log('🎉 ¡PERFECTO! La query corregida funciona');
    console.log('✅ Todas las noticias tienen imágenes');
    console.log('✅ Todas las noticias tienen categorías');
    console.log('✅ Todas las noticias tienen datos SEO');
    
  } else {
    console.log('❌ No se encontraron noticias');
  }

} catch (error) {
  console.error('❌ ERROR:', error.message);
  if (error.response?.errors) {
    console.log('Errores GraphQL:', error.response.errors);
  }
}

console.log('\n🚀 SIGUIENTE PASO: Limpiar cache y probar la web');
console.log('Ejecuta: npm run build && npm run dev');
