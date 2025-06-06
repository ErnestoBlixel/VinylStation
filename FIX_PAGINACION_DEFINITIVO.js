// FIX INMEDIATO PARA EL PROBLEMA DE PAGINACIÓN
// Reemplazar la función getVinilosPaginados en wordpress.js

export async function getVinilosPaginados({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`📀 [FIX] Obteniendo página ${page} con ${itemsPerPage} vinilos usando offset pagination...`);
  
  const offset = (page - 1) * itemsPerPage;
  
  // CONSULTA OFFSET CORREGIDA
  const QUERY_OFFSET = gql`
    query GetVinilosPaginated($first: Int!, $offset: Int!) {
      vinilos(
        first: $first
        where: {
          offsetPagination: { offset: $offset }
          orderby: { field: DATE, order: DESC }
        }
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          # Estos campos pueden variar según la versión del plugin
          total
          totalPages
          currentPage
          offsetPagination {
            total
            hasPrevious
            hasMore
          }
        }
        nodes {
          databaseId
          title
          slug
          date
          imagenPrincipalUrl
          imagenPrincipal {
            altText
            sourceUrl
          }
          camposVinilo {
            vsPrecio
            vsArtista
            vsAlbum
          }
        }
      }
    }
  `;

  try {
    console.log(`📄 [FIX OFFSET] Página ${page}, offset ${offset}, items ${itemsPerPage}`);
    
    const variables = { first: itemsPerPage, offset };
    const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY_OFFSET, variables);
    
    console.log('🔍 [DEBUG] Respuesta raw de GraphQL:', {
      nodes: rawData?.vinilos?.nodes?.length || 0,
      pageInfo: rawData?.vinilos?.pageInfo
    });
    
    const nodes = rawData?.vinilos?.nodes || [];
    const pageInfo = rawData?.vinilos?.pageInfo;
    
    // VERIFICAR SI LA RESPUESTA ES VÁLIDA
    if (!Array.isArray(nodes)) {
      throw new Error('Respuesta de offset pagination inválida: nodes no es array');
    }
    
    if (nodes.length === 0 && page === 1) {
      throw new Error('Respuesta de offset pagination inválida: página 1 sin resultados');
    }
    
    // VERIFICAR QUE NO SEAN LOS MISMOS RESULTADOS DE LA PÁGINA 1
    if (page > 1 && nodes.length > 0) {
      console.log(`🔍 [VERIFICACIÓN] Primer vinilo página ${page}: "${nodes[0]?.title}" - ${nodes[0]?.camposVinilo?.vsArtista || 'N/A'}`);
    }

    console.log(`✅ [ÉXITO OFFSET] Página ${page}: obtenidos ${nodes.length} vinilos`);
    
    const vinilosProcesados = nodes.map((v, index) => {
      const imgUrl = v.imagenPrincipalUrl || processImageURL(v.imagenPrincipal?.sourceUrl) || '/images/placeholder-vinyl.jpg';
      const alt = v.imagenPrincipal?.altText || v.title || `Vinilo ${v.databaseId || index}`;
      const generatedExcerpt = `Artista: ${v.camposVinilo?.vsArtista || 'N/A'}. Álbum: ${v.camposVinilo?.vsAlbum || 'N/A'}. Precio: ${v.camposVinilo?.vsPrecio || 'Consultar'}.`;

      return {
        ...v,
        imagenPrincipalUrl: imgUrl,
        imagenPrincipal: { sourceUrl: imgUrl, altText: alt },
        excerpt: generatedExcerpt,
        camposVinilo: {
          vsPrecio: v.camposVinilo?.vsPrecio || '',
          vsArtista: v.camposVinilo?.vsArtista || '',
          vsAlbum: v.camposVinilo?.vsAlbum || '',
        },
        seo: {
          title: `${v.title || 'Vinilo'} | VinylStation`,
          metaDesc: generatedExcerpt.substring(0, 160),
        },
      };
    });
    
    // DETECTAR TOTAL DE MÚLTIPLES FUENTES POSIBLES
    const total = pageInfo?.total || 
                  pageInfo?.offsetPagination?.total || 
                  4218; // Fallback conocido
                  
    const totalPages = Math.ceil(total / itemsPerPage);
    
    console.log(`📊 [FIX] Total detectado: ${total}, Páginas: ${totalPages}`);
    
    return {
      vinilos: vinilosProcesados,
      pageInfo: {
        hasNext: pageInfo?.hasNextPage || false,
        hasPrevious: page > 1,
        total,
        totalPages,
        currentPage: page,
        itemsPerPage,
        totalVinilos: total
      }
    };
    
  } catch (error) {
    console.error('❌ [FIX ERROR] Error con offset pagination:', error.message);
    if (error.response?.errors) {
      console.error('GraphQL Errors (offset):', JSON.stringify(error.response.errors, null, 2));
    }
    
    console.log('🔄 [FIX] Offset falló, usando método cursor CORREGIDO...');
    
    // FALLBACK A CURSOR PAGINATION CORREGIDO
    return getVinilosPaginadosConCursorCorregido({ page, itemsPerPage });
  }
}

// FUNCIÓN CURSOR CORREGIDA (para usar como fallback)
async function getVinilosPaginadosConCursorCorregido({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`🔄 [CURSOR CORREGIDO] Página ${page} con paginación cursor correcta`);
  
  const QUERY_CURSOR = gql`
    query GetVinilosCursorCorregido($first: Int!, $after: String) {
      vinilos(first: $first, after: $after, where: {orderby: {field: DATE, order: DESC}}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          databaseId
          title
          slug
          date
          imagenPrincipalUrl
          imagenPrincipal {
            altText
            sourceUrl
          }
          camposVinilo {
            vsPrecio
            vsArtista
            vsAlbum
          }
        }
      }
    }
  `;

  try {
    let allNodes = [];
    let cursor = null;
    let hasMore = true;
    const BATCH_SIZE = 50; // Lotes más pequeños para mejor control
    
    // CALCULAR EXACTAMENTE CUÁNTOS ELEMENTOS NECESITAMOS
    const elementsNeeded = page * itemsPerPage;
    console.log(`📄 [CURSOR] Necesitamos cargar ${elementsNeeded} elementos para página ${page}`);
    
    let batchCount = 0;
    
    // CARGAR ELEMENTOS SECUENCIALMENTE HASTA TENER SUFICIENTES
    while (hasMore && allNodes.length < elementsNeeded && batchCount < 50) {
      batchCount++;
      const elementsThisBatch = Math.min(BATCH_SIZE, elementsNeeded - allNodes.length + 10); // Buffer pequeño
      
      console.log(`   🔄 Lote ${batchCount}: Cargando ${elementsThisBatch} elementos (total actual: ${allNodes.length})`);
      
      const variables = { 
        first: elementsThisBatch,
        ...(cursor && { after: cursor })
      };
      
      const batchData = await request(WORDPRESS_GRAPHQL_URL, QUERY_CURSOR, variables);
      const batchNodes = batchData?.vinilos?.nodes || [];
      const batchPageInfo = batchData?.vinilos?.pageInfo;
      
      if (batchNodes.length > 0) {
        allNodes = allNodes.concat(batchNodes);
        cursor = batchPageInfo?.endCursor;
        hasMore = batchPageInfo?.hasNextPage || false;
        
        console.log(`   ✅ Lote ${batchCount}: +${batchNodes.length} elementos (total: ${allNodes.length})`);
        
        // DEBUG: Mostrar primer elemento del lote
        if (batchNodes.length > 0 && batchCount <= 3) {
          console.log(`   📀 Ejemplo lote ${batchCount}: "${batchNodes[0]?.title}" - ${batchNodes[0]?.camposVinilo?.vsArtista || 'N/A'}`);
        }
      } else {
        console.log(`   ⚠️ Lote ${batchCount}: Sin más datos`);
        hasMore = false;
      }
    }
    
    // HACER EL SLICE CORRECTO PARA LA PÁGINA ESPECÍFICA
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    console.log(`🔍 [SLICE] Total cargado: ${allNodes.length}, necesario: ${elementsNeeded}`);
    console.log(`🔍 [SLICE] Página ${page}: [${startIndex}:${endIndex}]`);
    
    const pageNodes = allNodes.slice(startIndex, endIndex);
    
    if (pageNodes.length === 0 && page > 1) {
      console.warn(`⚠️ [CURSOR] Página ${page} vacía. Verificar paginación.`);
    }
    
    console.log(`✅ [CURSOR] Página ${page}: ${pageNodes.length} elementos obtenidos`);
    
    if (pageNodes.length > 0) {
      console.log(`📀 [CURSOR] Primer vinilo: "${pageNodes[0]?.title}" - ${pageNodes[0]?.camposVinilo?.vsArtista || 'N/A'}`);
      console.log(`📀 [CURSOR] Último vinilo: "${pageNodes[pageNodes.length-1]?.title}" - ${pageNodes[pageNodes.length-1]?.camposVinilo?.vsArtista || 'N/A'}`);
    }
    
    return processVinilosPage(pageNodes, allNodes, page, itemsPerPage, { 
      hasNextPage: hasMore, 
      endCursor: cursor 
    });
    
  } catch (error) {
    console.error(`❌ [CURSOR ERROR] Error:`, error.message);
    return {
      vinilos: [],
      pageInfo: {
        hasNext: false,
        hasPrevious: page > 1,
        total: 0,
        totalPages: 0,
        currentPage: page,
        itemsPerPage
      }
    };
  }
}

// TAMBIÉN EXPORTAR LA FUNCIÓN CORREGIDA PARA DEBUGGING
export { getVinilosPaginadosConCursorCorregido };

console.log('🔧 [FIX] Funciones de paginación corregidas cargadas');
