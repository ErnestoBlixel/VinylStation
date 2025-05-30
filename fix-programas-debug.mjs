// fix-programas-debug.mjs
// Script de diagnóstico y solución para programas

console.log('🚀 DIAGNÓSTICO Y REPARACIÓN DE PROGRAMAS VINYLSTATION');
console.log('==================================================\n');

// Función para hacer peticiones HTTP sin dependencias externas
async function makeGraphQLRequest(query, variables = {}) {
  try {
    const response = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'VinylStation/1.0'
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      console.log('❌ Errores GraphQL encontrados:');
      result.errors.forEach(error => {
        console.log(`   - ${error.message}`);
      });
      return null;
    }

    return result.data;
  } catch (error) {
    console.log(`❌ Error de conexión: ${error.message}`);
    return null;
  }
}

// Test 1: Verificar conexión básica
async function testBasicConnection() {
  console.log('📡 1. PROBANDO CONEXIÓN BÁSICA...');
  
  const query = `
    query BasicTest {
      generalSettings {
        title
        description
        url
      }
    }
  `;
  
  const result = await makeGraphQLRequest(query);
  
  if (result) {
    console.log('✅ Conexión exitosa');
    console.log(`   Título: ${result.generalSettings?.title}`);
    console.log(`   URL: ${result.generalSettings?.url}`);
    return true;
  } else {
    console.log('❌ No se pudo conectar con WordPress GraphQL');
    return false;
  }
}

// Test 2: Verificar tipos de contenido disponibles
async function testContentTypes() {
  console.log('\n📋 2. VERIFICANDO TIPOS DE CONTENIDO...');
  
  const query = `
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
  `;
  
  const result = await makeGraphQLRequest(query);
  
  if (result) {
    console.log('✅ Schema GraphQL obtenido');
    
    const fields = result.__schema.queryType.fields;
    const contentTypes = fields
      .filter(field => 
        field.name.includes('programa') || 
        field.name.includes('vinilo') || 
        field.name.includes('post') ||
        field.name.includes('page')
      )
      .map(field => field.name);
    
    console.log('📋 Tipos de contenido relacionados encontrados:');
    if (contentTypes.length > 0) {
      contentTypes.forEach(type => console.log(`   - ${type}`));
    } else {
      console.log('   ❌ No se encontraron tipos relacionados con "programa" o "vinilo"');
    }
    
    return contentTypes;
  } else {
    console.log('❌ No se pudo obtener el schema');
    return [];
  }
}

// Test 3: Probar diferentes nombres para programas
async function testProgramsQueries() {
  console.log('\n📻 3. PROBANDO CONSULTAS DE PROGRAMAS...');
  
  const queries = [
    { name: 'programas', query: 'query { programas { nodes { id title slug } } }' },
    { name: 'programa', query: 'query { programa { nodes { id title slug } } }' },
    { name: 'programs', query: 'query { programs { nodes { id title slug } } }' },
    { name: 'program', query: 'query { program { nodes { id title slug } } }' },
    { name: 'posts con filtro', query: 'query { posts(where: {categoryName: "programa"}) { nodes { id title slug } } }' }
  ];
  
  for (const test of queries) {
    console.log(`   Probando "${test.name}"...`);
    const result = await makeGraphQLRequest(test.query);
    
    if (result) {
      const data = result.programas || result.programa || result.programs || result.program || result.posts;
      if (data && data.nodes && data.nodes.length > 0) {
        console.log(`   ✅ ¡ÉXITO con "${test.name}"! Encontrados ${data.nodes.length} programas`);
        data.nodes.forEach(programa => {
          console.log(`      - ${programa.title} (${programa.slug})`);
        });
        return { type: test.name, data: data.nodes };
      }
    }
    console.log(`   ❌ "${test.name}" no funcionó`);
  }
  
  return null;
}

// Test 4: Verificar Posts genéricos
async function testGenericPosts() {
  console.log('\n📝 4. VERIFICANDO POSTS GENÉRICOS...');
  
  const query = `
    query GetAllPosts {
      posts(first: 20) {
        nodes {
          id
          title
          slug
          categories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
  `;
  
  const result = await makeGraphQLRequest(query);
  
  if (result && result.posts && result.posts.nodes) {
    console.log(`✅ Encontrados ${result.posts.nodes.length} posts genéricos`);
    
    // Buscar posts que podrían ser programas
    const possiblePrograms = result.posts.nodes.filter(post => 
      post.title.toLowerCase().includes('programa') ||
      post.categories.nodes.some(cat => 
        cat.name.toLowerCase().includes('programa') ||
        cat.slug.includes('programa')
      )
    );
    
    if (possiblePrograms.length > 0) {
      console.log(`📻 Posibles programas encontrados como posts:`);
      possiblePrograms.forEach(post => {
        console.log(`   - ${post.title} (${post.slug})`);
        if (post.categories.nodes.length > 0) {
          console.log(`     Categorías: ${post.categories.nodes.map(cat => cat.name).join(', ')}`);
        }
      });
      return possiblePrograms;
    } else {
      console.log('❌ No se encontraron posts que parezcan programas');
    }
  }
  
  return null;
}

// Test 5: Verificar ContentNodes
async function testContentNodes() {
  console.log('\n🔍 5. VERIFICANDO CONTENT NODES...');
  
  const query = `
    query GetContentNodes {
      contentNodes(first: 20) {
        nodes {
          __typename
          id
          title
          slug
          uri
        }
      }
    }
  `;
  
  const result = await makeGraphQLRequest(query);
  
  if (result && result.contentNodes && result.contentNodes.nodes) {
    console.log(`✅ Encontrados ${result.contentNodes.nodes.length} content nodes`);
    
    // Agrupar por tipo
    const nodesByType = {};
    result.contentNodes.nodes.forEach(node => {
      if (!nodesByType[node.__typename]) {
        nodesByType[node.__typename] = [];
      }
      nodesByType[node.__typename].push(node);
    });
    
    console.log('📊 Tipos de contenido encontrados:');
    Object.keys(nodesByType).forEach(type => {
      console.log(`   - ${type}: ${nodesByType[type].length} elementos`);
      if (type.toLowerCase().includes('programa') || type.toLowerCase().includes('vinilo')) {
        console.log(`     🎯 ¡Tipo relevante encontrado!`);
        nodesByType[type].slice(0, 3).forEach(node => {
          console.log(`        - ${node.title} (${node.slug})`);
        });
      }
    });
    
    return nodesByType;
  }
  
  return null;
}

// Función principal
async function runDiagnostic() {
  try {
    // Ejecutar todos los tests
    const connected = await testBasicConnection();
    if (!connected) {
      console.log('\n❌ PROBLEMA CRÍTICO: No se puede conectar con WordPress GraphQL');
      console.log('\n🔧 SOLUCIONES:');
      console.log('1. Verificar que WordPress esté online: https://cms.vinylstation.es/wp-admin');
      console.log('2. Verificar que WPGraphQL esté instalado y activado');
      console.log('3. Comprobar la URL GraphQL: https://cms.vinylstation.es/graphql');
      console.log('4. Verificar configuración de CORS en WordPress');
      return;
    }
    
    const contentTypes = await testContentTypes();
    const programsResult = await testProgramsQueries();
    const genericPosts = await testGenericPosts();
    const contentNodes = await testContentNodes();
    
    // Generar reporte final
    console.log('\n🎯 REPORTE FINAL Y RECOMENDACIONES');
    console.log('=====================================');
    
    if (programsResult) {
      console.log(`✅ ÉXITO: Programas encontrados usando "${programsResult.type}"`);
      console.log('💡 ACCIÓN: Actualizar wordpress.js para usar este nombre');
    } else if (genericPosts && genericPosts.length > 0) {
      console.log('⚠️ Los programas están como posts genéricos');
      console.log('💡 ACCIÓN: Usar consulta de posts con filtro de categoría');
    } else if (contentNodes) {
      console.log('⚠️ Programas podrían estar en contentNodes');
      console.log('💡 ACCIÓN: Revisar los tipos encontrados arriba');
    } else {
      console.log('❌ NO SE ENCONTRARON PROGRAMAS');
      console.log('\n🔧 SOLUCIONES EN WORDPRESS:');
      console.log('1. Verificar que el CPT "programas" esté registrado');
      console.log('2. Asegurarse de que esté expuesto en GraphQL');
      console.log('3. Verificar que hay programas publicados');
      console.log('4. Comprobar permisos de acceso');
    }
    
  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error.message);
  }
}

// Ejecutar diagnóstico
runDiagnostic();
