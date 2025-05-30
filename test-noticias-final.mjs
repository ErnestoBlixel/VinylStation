// Test de noticias que funciona con Node.js
import { request, gql } from 'graphql-request';

// URL hardcodeada para el test
const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';

console.log('🔍 VERIFICANDO NOTICIAS...\n');
console.log('🔗 Conectando a:', WORDPRESS_GRAPHQL_URL);

// Query para obtener noticias
const GET_NOTICIAS = gql`
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
        imagenPrincipalUrl(size: "medium")
        imagenPrincipal {
          sourceUrl
          altText
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        camposNoticia {
          vsFechaPublicacionCustom
          vsAutorEquipo {
            ... on MiembroEquipo {
              title
            }
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

// Query para obtener categorías
const GET_CATEGORIAS = gql`
  query GetCategoriasNoticias {
    categoriasNoticia(first: 50, where: { hideEmpty: true }) {
      nodes {
        id
        name
        slug
        count
        description
      }
    }
  }
`;

try {
  // Obtener noticias
  console.log('📰 Obteniendo noticias...');
  const { noticias } = await request(WORDPRESS_GRAPHQL_URL, GET_NOTICIAS, { first: 10 });
  
  if (noticias?.nodes && noticias.nodes.length > 0) {
    console.log(`✅ ${noticias.nodes.length} noticias obtenidas:\n`);
    
    noticias.nodes.forEach((n, i) => {
      console.log(`  ${i+1}. ${n.title}`);
      console.log(`     - Slug: ${n.slug}`);
      console.log(`     - Imagen Principal URL: ${n.imagenPrincipalUrl || 'Sin imagenPrincipalUrl'}`);
      console.log(`     - Imagen Principal: ${n.imagenPrincipal?.sourceUrl || 'Sin imagenPrincipal'}`);
      console.log(`     - Featured Image: ${n.featuredImage?.node?.sourceUrl || 'Sin featuredImage'}`);
      console.log(`     - Fecha: ${n.date}`);
      console.log(`     - Excerpt: ${n.excerpt ? n.excerpt.substring(0, 100) + '...' : 'Sin excerpt'}`);
      console.log(`     - Categorías: ${n.categoriasNoticia?.nodes?.map(cat => cat.name).join(', ') || 'Sin categorías'}`);
      console.log('');
    });
  } else {
    console.log('❌ No se encontraron noticias');
    console.log('Estructura de respuesta:', JSON.stringify(noticias, null, 2));
  }

  // Obtener categorías
  console.log('🏷️ Obteniendo categorías...');
  const { categoriasNoticia } = await request(WORDPRESS_GRAPHQL_URL, GET_CATEGORIAS);
  
  if (categoriasNoticia?.nodes && categoriasNoticia.nodes.length > 0) {
    console.log(`✅ ${categoriasNoticia.nodes.length} categorías obtenidas:\n`);
    categoriasNoticia.nodes.forEach((cat, i) => {
      console.log(`  ${i+1}. ${cat.name} (${cat.count} noticias) - slug: ${cat.slug}`);
    });
  } else {
    console.log('❌ No se encontraron categorías');
  }

  console.log('\n🎉 ¡CONEXIÓN EXITOSA!');
  console.log('✅ El CPT "noticias" está funcionando correctamente');
  console.log('✅ Las queries GraphQL funcionan');
  console.log('✅ Los campos de imagen están disponibles');

} catch (error) {
  console.error('❌ ERROR:', error.message);
  console.log('\n🔧 Detalles del error:');
  console.log('- Nombre:', error.name);
  console.log('- Mensaje:', error.message);
  if (error.response) {
    console.log('- Respuesta:', JSON.stringify(error.response, null, 2));
  }
  
  console.log('\n🔧 Posibles soluciones:');
  console.log('1. Verificar conexión a WordPress: https://cms.vinylstation.es/graphql');
  console.log('2. Comprobar que el CPT "noticias" esté activo');
  console.log('3. Verificar que hay noticias publicadas');
  console.log('4. Revisar configuración de GraphQL');
}
