// debug-pages.mjs
// Script para verificar qué páginas existen en WordPress y sus títulos

console.log('🔍 Verificando páginas en WordPress...\n');

async function debugPages() {
  const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';
  
  try {
    // 1. Listar todas las páginas
    console.log('📄 Listando todas las páginas...');
    
    const pagesQuery = {
      query: `
        query GetAllPages {
          pages(first: 20) {
            nodes {
              id
              databaseId
              title
              slug
              uri
              content
              excerpt
              date
            }
          }
        }
      `
    };
    
    let response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pagesQuery)
    });
    
    let result = await response.json();
    
    if (result.data?.pages?.nodes && result.data.pages.nodes.length > 0) {
      console.log(`✅ Encontradas ${result.data.pages.nodes.length} páginas:`);
      result.data.pages.nodes.forEach((page, index) => {
        console.log(`   ${index + 1}. "${page.title}" (ID: ${page.databaseId})`);
        console.log(`      Slug: ${page.slug}`);
        console.log(`      URI: ${page.uri}`);
        console.log(`      Fecha: ${page.date}`);
        console.log('      ---');
      });
    } else {
      console.log('⚠️ No se encontraron páginas');
    }
    
    console.log('\n');
    
    // 2. Buscar páginas específicas
    const searchTerms = ['vinilos', 'programas', 'colección', 'programación'];
    
    for (const term of searchTerms) {
      console.log(`🔍 Buscando páginas con "${term}"...`);
      
      const searchQuery = {
        query: `
          query SearchPages($search: String!) {
            pages(first: 10, where: { search: $search }) {
              nodes {
                id
                databaseId
                title
                slug
                uri
                excerpt
              }
            }
          }
        `,
        variables: { search: term }
      };
      
      response = await fetch(WORDPRESS_GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchQuery)
      });
      
      result = await response.json();
      
      if (result.data?.pages?.nodes && result.data.pages.nodes.length > 0) {
        console.log(`   ✅ ${result.data.pages.nodes.length} resultados:`);
        result.data.pages.nodes.forEach(page => {
          console.log(`      - "${page.title}" (ID: ${page.databaseId}, Slug: ${page.slug})`);
        });
      } else {
        console.log(`   ⚠️ Sin resultados para "${term}"`);
      }
      console.log('');
    }
    
    // 3. Probar IDs específicos que estamos usando
    console.log('🧪 Probando IDs específicos que usa el código...');
    
    const testIds = [
      { name: 'vinilos', id: '39' },
      { name: 'programas', id: '42' },
      { name: 'home', id: '1' }
    ];
    
    for (const test of testIds) {
      console.log(`   Probando ID ${test.id} para "${test.name}"...`);
      
      const idQuery = {
        query: `
          query GetPageById($id: ID!) {
            page(id: $id, idType: DATABASE_ID) {
              id
              databaseId
              title
              slug
              uri
              excerpt
            }
          }
        `,
        variables: { id: test.id }
      };
      
      try {
        response = await fetch(WORDPRESS_GRAPHQL_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(idQuery)
        });
        
        result = await response.json();
        
        if (result.data?.page) {
          console.log(`      ✅ Encontrada: "${result.data.page.title}"`);
          console.log(`         Slug: ${result.data.page.slug}`);
          console.log(`         URI: ${result.data.page.uri}`);
        } else {
          console.log(`      ❌ No existe página con ID ${test.id}`);
        }
      } catch (error) {
        console.log(`      ❌ Error: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ ERROR GENERAL:', error.message);
  }
}

// Ejecutar debug
debugPages();