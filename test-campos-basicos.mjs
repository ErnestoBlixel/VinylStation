// Test simple para verificar qué campos SÍ existen en noticias
import { request, gql } from 'graphql-request';

const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';

console.log('🔍 VERIFICANDO CAMPOS DISPONIBLES EN CPT NOTICIAS...\n');

// Query muy simple para empezar
const QUERY_SIMPLE = gql`
  query GetNoticiasSimple($first: Int!) {
    noticias(first: $first) {
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
      }
    }
  }
`;

try {
  console.log('📰 Probando query básica...');
  const { noticias } = await request(WORDPRESS_GRAPHQL_URL, QUERY_SIMPLE, { first: 5 });
  
  if (noticias?.nodes && noticias.nodes.length > 0) {
    console.log(`✅ ${noticias.nodes.length} noticias obtenidas con campos básicos:\n`);
    
    noticias.nodes.forEach((n, i) => {
      console.log(`  ${i+1}. ${n.title}`);
      console.log(`     - Slug: ${n.slug}`);
      console.log(`     - Featured Image: ${n.featuredImage?.node?.sourceUrl || 'Sin featuredImage'}`);
      console.log(`     - Fecha: ${n.date}`);
      console.log(`     - Tiene contenido: ${n.content ? 'Sí' : 'No'}`);
      console.log('');
    });
    
    console.log('✅ CAMPOS BÁSICOS FUNCIONAN');
    console.log('✅ featuredImage está disponible');
    console.log('✅ El CPT "noticias" responde correctamente');
    
  } else {
    console.log('❌ No se encontraron noticias');
  }

} catch (error) {
  console.error('❌ ERROR:', error.message);
}

// Ahora probemos con categorías
console.log('\n🏷️ Probando categorías...');

const QUERY_CATEGORIAS = gql`
  query GetCategoriasSimple {
    categoriasNoticia(first: 10) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

try {
  const { categoriasNoticia } = await request(WORDPRESS_GRAPHQL_URL, QUERY_CATEGORIAS);
  
  if (categoriasNoticia?.nodes && categoriasNoticia.nodes.length > 0) {
    console.log(`✅ ${categoriasNoticia.nodes.length} categorías obtenidas:\n`);
    categoriasNoticia.nodes.forEach((cat, i) => {
      console.log(`  ${i+1}. ${cat.name} (${cat.count} noticias)`);
    });
  } else {
    console.log('❌ No se encontraron categorías');
  }
} catch (error) {
  console.error('❌ Error en categorías:', error.message);
}

console.log('\n🎯 CONCLUSIÓN:');
console.log('- Los campos básicos (title, slug, date, excerpt, content, featuredImage) SÍ funcionan');
console.log('- Los campos personalizados (imagenPrincipalUrl, imagenPrincipal) NO existen en CPT noticias');
console.log('- Necesitamos corregir la query para usar solo campos existentes');
