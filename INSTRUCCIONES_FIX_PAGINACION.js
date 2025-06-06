// INSTRUCCIONES PARA APLICAR EL FIX DE PAGINACIÓN

// PASO 1: Abrir el archivo src/lib/wordpress.js

// PASO 2: Buscar la función getVinilosPaginadosConCursor (aproximadamente línea 380)

// PASO 3: Reemplazar TODA la función getVinilosPaginadosConCursor con esta versión corregida:

async function getVinilosPaginadosConCursor({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`🔄 [CURSOR FIXED] Paginación corregida para página ${page}`);
  
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
    // ESTRATEGIA CORREGIDA: Cargar elementos secuencialmente hasta llegar a la página deseada
    let allNodes = [];
    let cursor = null;
    let hasMore = true;
    const BATCH_SIZE = 50; // Lotes más pequeños para mejor control
    
    // Calcular exactamente cuántos elementos necesitamos
    const targetStartIndex = (page - 1) * itemsPerPage;
    const targetEndIndex = targetStartIndex + itemsPerPage;
    const elementsNeeded = targetEndIndex;
    
    console.log(`📄 [FIXED] Necesitamos llegar al índice ${targetEndIndex} para página ${page}`);
    
    let batchNumber = 1;
    
    // Cargar elementos hasta tener suficientes para hacer el slice correcto
    while (hasMore && allNodes.length < elementsNeeded) {
      const remainingElements = elementsNeeded - allNodes.length;
      const elementsThisBatch = Math.min(BATCH_SIZE, remainingElements + 10); // Buffer pequeño
      
      console.log(`   🔄 Lote ${batchNumber}: Cargando ${elementsThisBatch} elementos (total actual: ${allNodes.length})`);
      
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
        
        console.log(`   ✅ Lote ${batchNumber}: +${batchNodes.length} elementos (total: ${allNodes.length})`);
        
        // Mostrar debug de algunos elementos para verificar progresión
        if (batchNodes.length > 0) {
          const firstVinyl = batchNodes[0];
          console.log(`   📀 Ejemplo lote ${batchNumber}: "${firstVinyl?.title}" - ${firstVinyl?.camposVinilo?.vsArtista || 'N/A'}`);
        }
      } else {
        console.log(`   ⚠️ Lote ${batchNumber}: Sin más datos, deteniendo`);
        hasMore = false;
      }
      
      batchNumber++;
      
      // Límite de seguridad
      if (batchNumber > 30) {
        console.warn(`⚠️ Límite de seguridad alcanzado (30 lotes) para página ${page}`);
        break;
      }
    }
    
    // HACER EL SLICE CORRECTO
    console.log(`🔍 [SLICE CORRECTO] Página ${page}:`);
    console.log(`   - Total elementos cargados: ${allNodes.length}`);
    console.log(`   - Índices para slice: [${targetStartIndex}:${targetEndIndex}]`);
    
    const pageNodes = allNodes.slice(targetStartIndex, targetEndIndex);
    
    console.log(`   - Elementos obtenidos para esta página: ${pageNodes.length}`);
    
    if (pageNodes.length > 0) {
      console.log(`   📀 PRIMER vinilo página ${page}: "${pageNodes[0]?.title}" - ${pageNodes[0]?.camposVinilo?.vsArtista || 'N/A'}`);
      console.log(`   📀 ÚLTIMO vinilo página ${page}: "${pageNodes[pageNodes.length-1]?.title}" - ${pageNodes[pageNodes.length-1]?.camposVinilo?.vsArtista || 'N/A'}`);
    } else {
      console.warn(`   ⚠️ No se obtuvieron elementos para página ${page}. Puede que hayamos llegado al final.`);
    }
    
    // Verificación anti-duplicados
    const titles = pageNodes.map(v => v.title);
    const uniqueTitles = new Set(titles);
    if (titles.length !== uniqueTitles.size) {
      console.warn(`   ⚠️ DUPLICADOS detectados: ${titles.length - uniqueTitles.size} elementos duplicados en página ${page}`);
    } else {
      console.log(`   ✅ Sin duplicados en página ${page}`);
    }
    
    return processVinilosPage(pageNodes, allNodes, page, itemsPerPage, { 
      hasNextPage: hasMore && allNodes.length >= targetEndIndex, 
      endCursor: cursor 
    });
    
  } catch (error) {
    console.error(`❌ [CURSOR FIXED ERROR] Error en página ${page}:`, error.message);
    if (error.response?.errors) {
      console.error('GraphQL Errors:', JSON.stringify(error.response.errors, null, 2));
    }
    
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

// PASO 4: Guardar el archivo
// PASO 5: Reiniciar el servidor de desarrollo (npm run dev)
// PASO 6: Probar en el navegador:
//   http://localhost:3000/vinilos?p=1
//   http://localhost:3000/vinilos?p=2  
//   http://localhost:3000/vinilos?p=3

// PASO 7: Verificar en la consola del navegador (F12) que aparezcan logs como:
//   "🔄 [CURSOR FIXED] Paginación corregida para página 2"
//   "📀 PRIMER vinilo página 2: [título diferente al de página 1]"

// ============================================================================
// ALTERNATIVA MÁS SIMPLE (si la anterior no funciona):
// Reemplazar getVinilosPaginadosConCursor con esta versión simplificada:
// ============================================================================

async function getVinilosPaginadosConCursorSimple({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`📄 [SIMPLE FIX] Método simplificado para página ${page}`);
  
  // Cargar una cantidad fija grande y hacer slice
  const ELEMENTOS_MAXIMOS = 1000; // Ajustar según tus necesidades
  
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
    console.log(`📄 [SIMPLE] Cargando ${ELEMENTOS_MAXIMOS} elementos máximo`);
    
    const variables = { first: ELEMENTOS_MAXIMOS };
    const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY, variables);
    
    const allNodes = rawData?.vinilos?.nodes || [];
    const pageInfo = rawData?.vinilos?.pageInfo;
    
    console.log(`✅ [SIMPLE] Total elementos cargados: ${allNodes.length}`);
    
    // Slice para la página específica
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const pageNodes = allNodes.slice(startIndex, endIndex);
    
    console.log(`🔍 [SIMPLE] Página ${page}: slice [${startIndex}:${endIndex}] = ${pageNodes.length} elementos`);
    
    if (pageNodes.length > 0) {
      console.log(`📀 [SIMPLE] Primer vinilo página ${page}: "${pageNodes[0]?.title}" - ${pageNodes[0]?.camposVinilo?.vsArtista || 'N/A'}`);
      console.log(`📀 [SIMPLE] Último vinilo página ${page}: "${pageNodes[pageNodes.length-1]?.title}" - ${pageNodes[pageNodes.length-1]?.camposVinilo?.vsArtista || 'N/A'}`);
    } else {
      console.warn(`⚠️ [SIMPLE] No hay elementos para página ${page}`);
    }
    
    return processVinilosPage(pageNodes, allNodes, page, itemsPerPage, pageInfo);
    
  } catch (error) {
    console.error(`❌ [SIMPLE ERROR] Error:`, error.message);
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
