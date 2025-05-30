// debug-programas.mjs
// Script específico para debuggear la consulta de programas

console.log('🔍 Debuggeando consulta de programas...\n');

async function debugProgramas() {
  try {
    console.log('1️⃣ Probando diferentes variaciones de consulta de programas...\n');
    
    // Consulta básica
    const basicQuery = {
      query: `
        query BasicProgramas {
          programas {
            nodes {
              id
              title
              slug
            }
          }
        }
      `
    };
    
    console.log('📡 Ejecutando consulta básica...');
    let response = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(basicQuery)
    });
    
    let result = await response.json();
    console.log('Resultado consulta básica:', JSON.stringify(result, null, 2));
    
    // Si falla, probar con diferentes nombres
    if (result.errors || !result.data?.programas) {
      console.log('\n2️⃣ Probando con "programa" (singular)...');
      
      const singularQuery = {
        query: `
          query SingularProgramas {
            programa {
              nodes {
                id
                title
                slug
              }
            }
          }
        `
      };
      
      response = await fetch('https://cms.vinylstation.es/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(singularQuery)
      });
      
      result = await response.json();
      console.log('Resultado consulta singular:', JSON.stringify(result, null, 2));
    }
    
    // Probar listando todos los tipos de contenido disponibles
    console.log('\n3️⃣ Listando tipos de contenido disponibles...');
    
    const typesQuery = {
      query: `
        query GetContentTypes {
          __schema {
            queryType {
              fields {
                name
                type {
                  name
                  kind
                }
              }
            }
          }
        }
      `
    };
    
    response = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(typesQuery)
    });
    
    result = await response.json();
    
    if (result.data?.__schema?.queryType?.fields) {
      console.log('✅ Tipos de contenido disponibles:');
      const contentTypes = result.data.__schema.queryType.fields
        .filter(field => field.name.includes('programa') || field.name.includes('vinilo') || field.name.includes('post'))
        .map(field => field.name);
      
      contentTypes.forEach(type => {
        console.log(`   - ${type}`);
      });
      
      if (contentTypes.length === 0) {
        console.log('❌ No se encontraron tipos relacionados con programas');
        
        // Mostrar todos los tipos disponibles
        console.log('\n📋 Todos los tipos disponibles:');
        result.data.__schema.queryType.fields.forEach(field => {
          console.log(`   - ${field.name}`);
        });
      }
    }
    
    // Probar consulta de posts genéricos
    console.log('\n4️⃣ Probando consulta de posts genéricos...');
    
    const postsQuery = {
      query: `
        query AllPosts {
          posts(first: 10) {
            nodes {
              id
              title
              slug
              postTypeId
            }
          }
        }
      `
    };
    
    response = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postsQuery)
    });
    
    result = await response.json();
    console.log('Posts encontrados:', JSON.stringify(result, null, 2));
    
    // Probar con contentNodes
    console.log('\n5️⃣ Probando con contentNodes...');
    
    const contentNodesQuery = {
      query: `
        query AllContentNodes {
          contentNodes(first: 10) {
            nodes {
              __typename
              id
              title
              slug
              uri
            }
          }
        }
      `
    };
    
    response = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentNodesQuery)
    });
    
    result = await response.json();
    console.log('ContentNodes encontrados:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error en debugging:', error.message);
  }
}

// Ejecutar debug
debugProgramas();