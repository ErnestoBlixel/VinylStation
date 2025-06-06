// TEST ESPECÍFICO PARA OFFSET PAGINATION
// Guardar este archivo como test-offset-debug.js y ejecutar desde consola del navegador

// PASO 1: Probar la consulta offset directamente en WPGraphiQL
// Ir a: https://cms.vinylstation.es/wp-admin/admin.php?page=graphql
// Ejecutar esta consulta:

/*
query TestOffsetPage2 {
  vinilos(first: 32, where: { offsetPagination: { offset: 32 } }) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      total
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

// PASO 2: Si la consulta anterior funciona, probar esta función en la consola:

async function testOffsetDirectly() {
  const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';
  
  console.group('🧪 TEST OFFSET PAGINATION');
  
  // Test página 1
  const page1Query = `
    query TestPage1 {
      vinilos(first: 32, where: { orderby: { field: DATE, order: DESC } }) {
        pageInfo {
          hasNextPage
          total
        }
        nodes {
          title
          databaseId
          camposVinilo {
            vsArtista
          }
        }
      }
    }
  `;
  
  // Test página 2 con offset
  const page2Query = `
    query TestPage2 {
      vinilos(first: 32, where: { 
        offsetPagination: { offset: 32 }
        orderby: { field: DATE, order: DESC } 
      }) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          total
          totalPages
          nextPage
          previousPage
        }
        nodes {
          title
          databaseId
          camposVinilo {
            vsArtista
          }
        }
      }
    }
  `;
  
  try {
    console.log('📄 Probando página 1...');
    const response1 = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: page1Query })
    });
    const data1 = await response1.json();
    
    console.log('✅ Página 1 - Primeros 3 vinilos:');
    data1.data?.vinilos?.nodes?.slice(0, 3).forEach((v, i) => {
      console.log(`   ${i + 1}. "${v.title}" - ${v.camposVinilo?.vsArtista || 'N/A'}`);
    });
    
    console.log('📄 Probando página 2 con offset...');
    const response2 = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: page2Query })
    });
    const data2 = await response2.json();
    
    if (data2.errors) {
      console.error('❌ Error en consulta página 2:', data2.errors);
      return;
    }
    
    console.log('✅ Página 2 - Primeros 3 vinilos:');
    data2.data?.vinilos?.nodes?.slice(0, 3).forEach((v, i) => {
      console.log(`   ${i + 33}. "${v.title}" - ${v.camposVinilo?.vsArtista || 'N/A'}`);
    });
    
    // Comparar resultados
    const page1Titles = data1.data?.vinilos?.nodes?.map(v => v.title) || [];
    const page2Titles = data2.data?.vinilos?.nodes?.map(v => v.title) || [];
    const commonTitles = page1Titles.filter(title => page2Titles.includes(title));
    
    if (commonTitles.length > 0) {
      console.error(`❌ PROBLEMA: ${commonTitles.length} títulos duplicados entre páginas`);
      console.log('🔍 Títulos duplicados:', commonTitles.slice(0, 3));
    } else {
      console.log('✅ Sin duplicados - Offset pagination funciona correctamente');
    }
    
    console.log('📊 PageInfo página 2:', data2.data?.vinilos?.pageInfo);
    
  } catch (error) {
    console.error('❌ Error en test:', error);
  }
  
  console.groupEnd();
}

// PASO 3: Ejecutar el test
// testOffsetDirectly();

// PASO 4: Si el offset funciona en GraphiQL pero no en tu código, 
// el problema está en cómo se construye la consulta en wordpress.js

// PASO 5: Debug de la función getVinilosPaginados
// Añadir estos logs temporalmente en wordpress.js:

function debugVinilosPaginados(page, itemsPerPage) {
  const offset = (page - 1) * itemsPerPage;
  
  console.group(`🔍 DEBUG getVinilosPaginados`);
  console.log(`📄 Página solicitada: ${page}`);
  console.log(`📊 Items por página: ${itemsPerPage}`);
  console.log(`🧮 Offset calculado: ${offset}`);
  console.log(`🎯 Variables que se envían a GraphQL:`, { first: itemsPerPage, offset });
  
  // Mostrar la consulta exacta que se está enviando
  const queryString = `
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
  
  console.log('📝 Query GraphQL:', queryString);
  console.groupEnd();
}

// PASO 6: Verificar exactamente qué respuesta devuelve tu función actual
function logVinilosResponse(vinilosData, page) {
  console.group(`📤 RESPUESTA getVinilosPaginados - Página ${page}`);
  console.log(`📊 Vinilos recibidos: ${vinilosData?.vinilos?.length || 0}`);
  console.log(`📈 PageInfo:`, vinilosData?.pageInfo);
  
  if (vinilosData?.vinilos?.length > 0) {
    console.log(`🎵 Primer vinilo: "${vinilosData.vinilos[0]?.title}" - ${vinilosData.vinilos[0]?.camposVinilo?.vsArtista || 'N/A'}`);
    console.log(`🎵 Último vinilo: "${vinilosData.vinilos[vinilosData.vinilos.length-1]?.title}" - ${vinilosData.vinilos[vinilosData.vinilos.length-1]?.camposVinilo?.vsArtista || 'N/A'}`);
  }
  console.groupEnd();
}

export { testOffsetDirectly, debugVinilosPaginados, logVinilosResponse };
