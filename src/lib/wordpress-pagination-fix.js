// SOLUCIÓN PARA PAGINACIÓN DE VINILOS
// Reemplazar la función getVinilosPaginadosConCursor en wordpress.js

// Función corregida usando cursor pagination correctamente
async function getVinilosPaginadosConCursorFixed({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`🔄 [CURSOR FIXED] Paginación correcta para página ${page}`);
  
  const QUERY_CURSOR = gql`
    query GetVinilosCursor($first: Int!, $after: String) {
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
    const BATCH_SIZE = 100;
    
    // Calcular cuántos elementos necesitamos cargar para llegar a la página solicitada
    const targetElements = page * itemsPerPage;
    
    console.log(`📄 [FIXED] Necesitamos cargar ${targetElements} elementos para página ${page}`);
    
    // Cargar elementos en lotes hasta llegar al número necesario
    let loadedCount = 0;
    let batchNumber = 1;
    
    while (hasMore && loadedCount < targetElements) {
      const itemsThisBatch = Math.min(BATCH_SIZE, targetElements - loadedCount);
      
      console.log(`   🔄 Lote ${batchNumber}: Cargando ${itemsThisBatch} elementos (cursor: ${cursor ? 'sí' : 'inicial'})`);
      
      const variables = { 
        first: itemsThisBatch,
        ...(cursor && { after: cursor })
      };
      
      const batchData = await request(WORDPRESS_GRAPHQL_URL, QUERY_CURSOR, variables);
      const batchNodes = batchData?.vinilos?.nodes || [];
      const batchPageInfo = batchData?.vinilos?.pageInfo;
      
      if (batchNodes.length > 0) {
        allNodes = allNodes.concat(batchNodes);
        loadedCount = allNodes.length;
        cursor = batchPageInfo?.endCursor;
        hasMore = batchPageInfo?.hasNextPage || false;
        
        console.log(`   ✅ Lote ${batchNumber}: ${batchNodes.length} elementos cargados (total: ${loadedCount})`);
        
        // Debug: mostrar algunos títulos para verificar que son diferentes
        if (batchNodes.length > 0) {
          console.log(`   📀 Primer vinilo del lote: "${batchNodes[0]?.title}" - ${batchNodes[0]?.camposVinilo?.vsArtista}`);
          if (batchNodes.length > 1) {
            console.log(`   📀 Último vinilo del lote: "${batchNodes[batchNodes.length-1]?.title}" - ${batchNodes[batchNodes.length-1]?.camposVinilo?.vsArtista}`);
          }
        }
      } else {
        console.log(`   ⚠️ Lote ${batchNumber}: Sin datos, deteniendo carga`);
        hasMore = false;
      }
      
      batchNumber++;
      
      // Límite de seguridad
      if (batchNumber > 50) {
        console.warn('⚠️ Límite de seguridad alcanzado (50 lotes)');
        break;
      }
    }
    
    // Ahora hacer el slice correcto para obtener SOLO la página solicitada
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    console.log(`🔍 [SLICE CORRECTO] Página ${page}:`);
    console.log(`   - Total cargados: ${allNodes.length}`);
    console.log(`   - Slice deseado: [${startIndex}:${endIndex}]`);
    
    const pageNodes = allNodes.slice(startIndex, endIndex);
    
    console.log(`   - Elementos en esta página: ${pageNodes.length}`);
    
    if (pageNodes.length > 0) {
      console.log(`   - Primer vinilo: "${pageNodes[0]?.title}" - ${pageNodes[0]?.camposVinilo?.vsArtista}`);
      console.log(`   - Último vinilo: "${pageNodes[pageNodes.length-1]?.title}" - ${pageNodes[pageNodes.length-1]?.camposVinilo?.vsArtista}`);
    }
    
    return processVinilosPage(pageNodes, allNodes, page, itemsPerPage, { hasNextPage: hasMore, endCursor: cursor });
    
  } catch (error) {
    console.error('❌ [CURSOR FIXED ERROR]:', error.message);
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

// ALTERNATIVAMENTE: Usar método más simple pero efectivo
async function getVinilosPaginadosSimple({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`📄 [SIMPLE] Método simple para página ${page}`);
  
  // Cargar siempre una cantidad fija grande de elementos y hacer slice local
  const ELEMENTOS_A_CARGAR = Math.max(500, page * itemsPerPage * 2);
  
  const QUERY = gql`
    query GetVinilosSimple($first: Int!) {
      vinilos(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
        pageInfo {
          hasNextPage
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
    const variables = { first: ELEMENTOS_A_CARGAR };
    const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY, variables);
    
    const allNodes = rawData?.vinilos?.nodes || [];
    const pageInfo = rawData?.vinilos?.pageInfo;
    
    console.log(`✅ [SIMPLE] Cargados ${allNodes.length} vinilos totales`);
    
    // Slice para la página específica
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const pageNodes = allNodes.slice(startIndex, endIndex);
    
    console.log(`🔍 [SIMPLE] Página ${page}: elementos [${startIndex}:${endIndex}] = ${pageNodes.length} vinilos`);
    
    if (pageNodes.length > 0) {
      console.log(`   📀 Primer vinilo: "${pageNodes[0]?.title}" - ${pageNodes[0]?.camposVinilo?.vsArtista}`);
      console.log(`   📀 Último vinilo: "${pageNodes[pageNodes.length-1]?.title}" - ${pageNodes[pageNodes.length-1]?.camposVinilo?.vsArtista}`);
    }
    
    // Verificar si hay elementos duplicados (debugging)
    const titulos = pageNodes.map(v => v.title);
    const titulosUnicos = new Set(titulos);
    if (titulos.length !== titulosUnicos.size) {
      console.warn(`⚠️ [DUPLICADOS] Se encontraron ${titulos.length - titulosUnicos.size} vinilos duplicados en la página ${page}`);
    }
    
    return processVinilosPage(pageNodes, allNodes, page, itemsPerPage, pageInfo);
    
  } catch (error) {
    console.error('❌ [SIMPLE ERROR]:', error.message);
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

export { getVinilosPaginadosConCursorFixed, getVinilosPaginadosSimple };
