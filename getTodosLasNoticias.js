// Función específica para cargar TODAS las noticias para paginación estática
export async function getTodosLasNoticias() {
  console.log('🔍 Cargando TODAS las noticias para paginación estática...');
  
  const QUERY_ALL = gql`
    query GetAllNoticias($first: Int!, $after: String) {
      noticias(first: $first, after: $after, where: {orderby: {field: DATE, order: DESC}}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          slug
          title
          date
          content
          featuredImage {
            node {
              sourceUrl(size: MEDIUM)
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
          }
        }
      }
    }
  `;

  let allNoticias = [];
  let hasNextPage = true;
  let cursor = null;
  const BATCH_SIZE = 100; // Tamaño de cada lote
  let pageCount = 0;
  
  try {
    while (hasNextPage) {
      pageCount++;
      console.log(`📄 Cargando lote ${pageCount} de noticias...`);
      
      const variables = { 
        first: BATCH_SIZE,
        ...(cursor && { after: cursor })
      };
      
      const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY_ALL, variables);
      const nodes = rawData?.noticias?.nodes || [];
      const pageInfo = rawData?.noticias?.pageInfo;
      
      if (nodes.length > 0) {
        allNoticias = allNoticias.concat(nodes);
        console.log(`   ✅ Lote ${pageCount}: ${nodes.length} noticias cargadas (total: ${allNoticias.length})`);
      }
      
      hasNextPage = pageInfo?.hasNextPage || false;
      cursor = pageInfo?.endCursor;
      
      // Límite de seguridad
      if (pageCount > 100) {
        console.warn('⚠️ Alcanzado límite de seguridad de 100 páginas');
        break;
      }
    }
    
    console.log(`✅ Total de noticias cargadas: ${allNoticias.length}`);
    
    // Procesar todas las noticias
    const noticiasProcesadas = allNoticias.map((n, index) => {
      const imgUrl = processImageURL(n.featuredImage?.node?.sourceUrl) || '/images/placeholder-news.jpg';
      const alt = n.featuredImage?.node?.altText || n.seo?.title || n.title;
      
      let cleanExcerpt = '';
      if (n.content) {
        cleanExcerpt = n.content.replace(/<[^>]*>/g, '').replace(/\\s+/g, ' ').trim();
        cleanExcerpt = cleanExcerpt.substring(0, 160) + (cleanExcerpt.length > 160 ? '...' : '');
      } else {
        cleanExcerpt = n.seo?.metaDesc || `Lee la noticia "${n.title || 'desconocida'}".`;
      }

      return {
        ...n,
        imagenDestacadaUrl: imgUrl,
        featuredImage: { node: { sourceUrl: imgUrl, altText: alt } },
        excerpt: cleanExcerpt,
        categorias: n.categoriasNoticia,
        seo: n.seo?.title ? n.seo : {
          title: `${n.title || 'Noticia'} | VinylStation Noticias`,
          metaDesc: cleanExcerpt
        }
      };
    });
    
    return {
      noticias: noticiasProcesadas,
      total: noticiasProcesadas.length
    };
    
  } catch (error) {
    console.error('❌ Error cargando todas las noticias:', error.message);
    if (error.response?.errors) {
      console.error('GraphQL Errors:', JSON.stringify(error.response.errors, null, 2));
    }
    return {
      noticias: [],
      total: 0
    };
  }
}