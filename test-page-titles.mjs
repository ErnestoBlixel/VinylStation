// test-page-titles.mjs
// Script simple para probar qué títulos está devolviendo

console.log('🧪 Probando títulos de páginas...\n');

async function testPageTitles() {
  const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';
  
  // Probar directamente las URLs que mencionaste
  const testCases = [
    { name: 'Vinilos', url: 'https://cms.vinylstation.es/vinilos/' },
    { name: 'Programas', url: 'https://cms.vinylstation.es/programas/' }
  ];
  
  console.log('🌐 Primero, probando acceso directo a las URLs...');
  
  for (const testCase of testCases) {
    try {
      console.log(`   Probando: ${testCase.url}`);
      const response = await fetch(testCase.url, { method: 'HEAD' });
      console.log(`   Status: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`   Error: ${error.message}`);
    }
  }
  
  console.log('\n📋 Ahora probando GraphQL...');
  
  // 1. Listar páginas más simples
  try {
    const simpleQuery = {
      query: `
        query GetSimplePages {
          pages(first: 10) {
            nodes {
              databaseId
              title
              slug
              uri
            }
          }
        }
      `
    };
    
    const response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simpleQuery)
    });
    
    const result = await response.json();
    
    if (result.errors) {
      console.log('❌ Errores GraphQL:', result.errors);
      return;
    }
    
    if (result.data?.pages?.nodes) {
      console.log('✅ Páginas encontradas:');
      result.data.pages.nodes.forEach(page => {
        console.log(`   - "${page.title}" (ID: ${page.databaseId})`);
        console.log(`     Slug: ${page.slug}`);
        console.log(`     URI: ${page.uri}`);
        console.log('     ---');
      });
      
      // Buscar páginas que contengan "vinilo" o "programa"
      const vinilosPage = result.data.pages.nodes.find(p => 
        p.title.toLowerCase().includes('vinilo') || 
        p.slug.includes('vinilo') ||
        p.uri.includes('vinilo')
      );
      
      const programasPage = result.data.pages.nodes.find(p => 
        p.title.toLowerCase().includes('programa') || 
        p.slug.includes('programa') ||
        p.uri.includes('programa')
      );
      
      console.log('\n🎯 Páginas relevantes encontradas:');
      if (vinilosPage) {
        console.log(`   Vinilos: "${vinilosPage.title}" (ID: ${vinilosPage.databaseId})`);
      } else {
        console.log('   Vinilos: No encontrada');
      }
      
      if (programasPage) {
        console.log(`   Programas: "${programasPage.title}" (ID: ${programasPage.databaseId})`);
      } else {
        console.log('   Programas: No encontrada');
      }
      
    } else {
      console.log('⚠️ No hay datos de páginas');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPageTitles();