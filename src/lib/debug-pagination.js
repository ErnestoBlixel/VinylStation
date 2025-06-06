// GUÍA DE DEBUGGING PARA PAGINACIÓN GRAPHQL
// Basada en mejores prácticas WPGraphQL

// ============================================================================
// PASO 1: PROBAR GRAPHQL DIRECTAMENTE EN WPGRAPHIQL
// ============================================================================

// 1.1 Acceder a: https://cms.vinylstation.es/wp-admin/admin.php?page=graphql

// 1.2 Probar consulta básica (página 1):
/*
query TestPage1 {
  vinilos(first: 32) {
    pageInfo {
      hasNextPage
      endCursor
      startCursor
    }
    nodes {
      title
      databaseId
      camposVinilo {
        vsArtista
        vsAlbum
      }
    }
  }
}
*/

// 1.3 Probar consulta con offset (página 2) - REQUIERE PLUGIN:
/*
query TestPage2WithOffset {
  vinilos(first: 32, where: { offsetPagination: { offset: 32 } }) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      totalPages
      nextPage
      previousPage
    }
    nodes {
      title
      databaseId
      camposVinilo {
        vsArtista
        vsAlbum
      }
    }
  }
}
*/

// 1.4 Probar consulta con cursor (página 2) - MÉTODO ESTÁNDAR:
/*
query TestPage1ForCursor {
  vinilos(first: 32) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      title
      databaseId
    }
  }
}

// Después, usar el endCursor de la respuesta anterior:
query TestPage2WithCursor {
  vinilos(first: 32, after: "CURSOR_DE_LA_RESPUESTA_ANTERIOR") {
    pageInfo {
      hasNextPage
      endCursor
      hasPreviousPage
      startCursor
    }
    nodes {
      title
      databaseId
      camposVinilo {
        vsArtista
        vsAlbum
      }
    }
  }
}
*/

// ============================================================================
// PASO 2: VERIFICAR CONFIGURACIÓN WORDPRESS
// ============================================================================

// 2.1 Verificar plugins instalados:
// WordPress Admin → Plugins → Buscar "wp-graphql-offset-pagination"

// 2.2 Si no está instalado, añadir a wp-config.php para debugging:
/*
define( 'GRAPHQL_DEBUG', true );
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
*/

// 2.3 Verificar que WPGraphQL está funcionando:
/*
query TestBasic {
  generalSettings {
    title
    description
  }
}
*/

// ============================================================================
// PASO 3: DEBUGGING EN EL FRONTEND (ASTRO)
// ============================================================================

// 3.1 Añadir logs detallados en wordpress.js:

function debugPaginationRequest(page, itemsPerPage, method = 'unknown') {
  console.group(`🔍 [DEBUG] Pagination Request - ${method}`);
  console.log(`📄 Página solicitada: ${page}`);
  console.log(`📊 Items por página: ${itemsPerPage}`);
  console.log(`🧮 Offset calculado: ${(page - 1) * itemsPerPage}`);
  console.log(`🎯 Elementos objetivo: ${page * itemsPerPage}`);
  console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
  console.groupEnd();
}

function debugPaginationResponse(data, page, method = 'unknown') {
  console.group(`📤 [DEBUG] Pagination Response - ${method}`);
  console.log(`📄 Página: ${page}`);
  console.log(`📊 Elementos recibidos: ${data?.vinilos?.length || 0}`);
  console.log(`📈 Total estimado: ${data?.pageInfo?.total || 'N/A'}`);
  console.log(`➡️ Tiene siguiente: ${data?.pageInfo?.hasNext || false}`);
  console.log(`⬅️ Tiene anterior: ${data?.pageInfo?.hasPrevious || false}`);
  
  if (data?.vinilos?.length > 0) {
    console.log(`🎵 Primer vinilo: "${data.vinilos[0]?.title}" - ${data.vinilos[0]?.camposVinilo?.vsArtista}`);
    console.log(`🎵 Último vinilo: "${data.vinilos[data.vinilos.length-1]?.title}" - ${data.vinilos[data.vinilos.length-1]?.camposVinilo?.vsArtista}`);
    
    // Verificar duplicados
    const titles = data.vinilos.map(v => v.title);
    const uniqueTitles = new Set(titles);
    if (titles.length !== uniqueTitles.size) {
      console.warn(`⚠️ DUPLICADOS: ${titles.length - uniqueTitles.size} elementos duplicados`);
    }
  }
  console.groupEnd();
}

// 3.2 Función de prueba para verificar diferentes métodos:

async function testPaginationMethods(page = 2) {
  console.group(`🧪 [TEST] Probando métodos de paginación para página ${page}`);
  
  // Método 1: Offset (requiere plugin)
  try {
    debugPaginationRequest(page, 32, 'OFFSET');
    const offsetResult = await testOffsetPagination(page, 32);
    debugPaginationResponse(offsetResult, page, 'OFFSET');
  } catch (error) {
    console.error('❌ OFFSET falló:', error.message);
  }
  
  // Método 2: Cursor
  try {
    debugPaginationRequest(page, 32, 'CURSOR');
    const cursorResult = await testCursorPagination(page, 32);
    debugPaginationResponse(cursorResult, page, 'CURSOR');
  } catch (error) {
    console.error('❌ CURSOR falló:', error.message);
  }
  
  console.groupEnd();
}

async function testOffsetPagination(page, itemsPerPage) {
  const offset = (page - 1) * itemsPerPage;
  
  const QUERY = gql`
    query TestOffset($first: Int!, $offset: Int!) {
      vinilos(first: $first, where: { offsetPagination: { offset: $offset } }) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          totalPages
        }
        nodes {
          title
          databaseId
          camposVinilo {
            vsArtista
            vsAlbum
          }
        }
      }
    }
  `;
  
  const result = await request(WORDPRESS_GRAPHQL_URL, QUERY, { first: itemsPerPage, offset });
  return {
    vinilos: result.vinilos.nodes,
    pageInfo: {
      hasNext: result.vinilos.pageInfo.hasNextPage,
      hasPrevious: result.vinilos.pageInfo.hasPreviousPage,
      total: result.vinilos.pageInfo.totalPages * itemsPerPage // Estimación
    }
  };
}

async function testCursorPagination(page, itemsPerPage) {
  // Implementar cursor pagination correcta
  let allNodes = [];
  let cursor = null;
  const targetElements = page * itemsPerPage;
  
  while (allNodes.length < targetElements) {
    const QUERY = gql`
      query TestCursor($first: Int!, $after: String) {
        vinilos(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            title
            databaseId
            camposVinilo {
              vsArtista
              vsAlbum
            }
          }
        }
      }
    `;
    
    const batchSize = Math.min(100, targetElements - allNodes.length);
    const result = await request(WORDPRESS_GRAPHQL_URL, QUERY, { first: batchSize, after: cursor });
    
    allNodes = allNodes.concat(result.vinilos.nodes);
    cursor = result.vinilos.pageInfo.endCursor;
    
    if (!result.vinilos.pageInfo.hasNextPage) break;
  }
  
  const startIndex = (page - 1) * itemsPerPage;
  const pageNodes = allNodes.slice(startIndex, startIndex + itemsPerPage);
  
  return {
    vinilos: pageNodes,
    pageInfo: {
      hasNext: allNodes.length >= page * itemsPerPage,
      hasPrevious: page > 1,
      total: allNodes.length
    }
  };
}

// ============================================================================
// PASO 4: VERIFICAR URLS Y PARÁMETROS
// ============================================================================

function debugUrlParams() {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location);
    const page = url.searchParams.get('p') || '1';
    const search = url.searchParams.get('search') || '';
    
    console.group('🔗 [DEBUG] URL Parameters');
    console.log(`🌐 URL completa: ${url.href}`);
    console.log(`📄 Parámetro 'p': ${page}`);
    console.log(`🔍 Parámetro 'search': ${search}`);
    console.log(`🧮 Página convertida: ${Math.max(1, parseInt(page, 10))}`);
    console.groupEnd();
  }
}

// ============================================================================
// PASO 5: COMPARAR RESULTADOS ENTRE PÁGINAS
// ============================================================================

function comparePageResults(page1Data, page2Data) {
  console.group('🔄 [DEBUG] Comparando resultados entre páginas');
  
  const page1Titles = page1Data.vinilos?.map(v => v.title) || [];
  const page2Titles = page2Data.vinilos?.map(v => v.title) || [];
  
  console.log(`📊 Página 1: ${page1Titles.length} elementos`);
  console.log(`📊 Página 2: ${page2Titles.length} elementos`);
  
  // Buscar títulos comunes
  const commonTitles = page1Titles.filter(title => page2Titles.includes(title));
  
  if (commonTitles.length > 0) {
    console.error(`❌ PROBLEMA: ${commonTitles.length} títulos duplicados entre páginas`);
    console.log('🔍 Títulos duplicados:', commonTitles.slice(0, 5));
  } else {
    console.log('✅ Sin duplicados entre páginas');
  }
  
  console.log('🎵 Primeros 3 títulos página 1:', page1Titles.slice(0, 3));
  console.log('🎵 Primeros 3 títulos página 2:', page2Titles.slice(0, 3));
  
  console.groupEnd();
}

// ============================================================================
// USO: Añadir estas líneas en index.astro para debugging
// ============================================================================

/*
// En el componente Astro, después de obtener vinilosData:
debugUrlParams();
debugPaginationRequest(page, itemsPerPage, 'CURRENT_METHOD');
debugPaginationResponse(vinilosData, page, 'CURRENT_METHOD');

// Para probar todos los métodos:
// testPaginationMethods(2).catch(console.error);
*/

export {
  debugPaginationRequest,
  debugPaginationResponse,
  testPaginationMethods,
  testOffsetPagination,
  testCursorPagination,
  debugUrlParams,
  comparePageResults
};
