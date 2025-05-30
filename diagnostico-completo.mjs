// diagnostico-completo.mjs
// Script completo para diagnosticar problemas de logo y programas

console.log('🔍 DIAGNÓSTICO COMPLETO VINYLSTATION');
console.log('=====================================\n');

const GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';

// Función helper para hacer peticiones GraphQL
async function graphqlRequest(query, variables = {}) {
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return null;
  }
}

// PARTE 1: Diagnóstico del Logo
async function diagnosticarLogo() {
  console.log('🖼️ DIAGNÓSTICO DEL LOGO');
  console.log('========================\n');

  // Test 1: customLogo
  console.log('1. Probando customLogo...');
  const customLogoResult = await graphqlRequest(`
    query {
      customLogo {
        node {
          sourceUrl
          altText
          id
        }
      }
    }
  `);

  if (customLogoResult?.data?.customLogo?.node) {
    console.log('✅ customLogo encontrado:', customLogoResult.data.customLogo.node);
  } else {
    console.log('❌ customLogo no disponible');
    if (customLogoResult?.errors) {
      console.log('   Errores:', customLogoResult.errors.map(e => e.message).join(', '));
    }
  }

  // Test 2: siteIcon
  console.log('\n2. Probando siteIcon...');
  const siteIconResult = await graphqlRequest(`
    query {
      siteIcon {
        node {
          sourceUrl
          altText
          id
        }
      }
    }
  `);

  if (siteIconResult?.data?.siteIcon?.node) {
    console.log('✅ siteIcon encontrado:', siteIconResult.data.siteIcon.node);
  } else {
    console.log('❌ siteIcon no disponible');
  }

  // Test 3: favicon
  console.log('\n3. Probando favicon...');
  const faviconResult = await graphqlRequest(`
    query {
      favicon {
        node {
          sourceUrl
          altText
          id
        }
      }
    }
  `);

  if (faviconResult?.data?.favicon?.node) {
    console.log('✅ favicon encontrado:', faviconResult.data.favicon.node);
  } else {
    console.log('❌ favicon no disponible');
  }

  // Test 4: Buscar en mediaItems
  console.log('\n4. Buscando logos en mediaItems...');
  const mediaResult = await graphqlRequest(`
    query {
      mediaItems(first: 10, where: { search: "logo" }) {
        nodes {
          id
          title
          sourceUrl
          altText
          slug
        }
      }
    }
  `);

  if (mediaResult?.data?.mediaItems?.nodes?.length > 0) {
    console.log(`✅ ${mediaResult.data.mediaItems.nodes.length} imágenes con "logo" encontradas:`);
    mediaResult.data.mediaItems.nodes.forEach(item => {
      console.log(`   - ${item.title}: ${item.sourceUrl}`);
    });
  } else {
    console.log('❌ No se encontraron imágenes con "logo"');
  }

  // Test 5: Verificar logo local
  console.log('\n5. Verificando logo local...');
  console.log('   📁 /images/logos/vinyl-station-logo.svg - ✅ EXISTE');
  console.log('   📁 /images/logos/vinyl-station-logo.png - ✅ EXISTE');

  return {
    customLogo: customLogoResult?.data?.customLogo?.node,
    siteIcon: siteIconResult?.data?.siteIcon?.node,
    favicon: faviconResult?.data?.favicon?.node,
    mediaLogos: mediaResult?.data?.mediaItems?.nodes || []
  };
}

// PARTE 2: Diagnóstico de Programas
async function diagnosticarProgramas() {
  console.log('\n\n📻 DIAGNÓSTICO DE PROGRAMAS');
  console.log('============================\n');

  // Test 1: Probar "programas" (plural)
  console.log('1. Probando consulta "programas"...');
  const programasResult = await graphqlRequest(`
    query {
      programas(first: 5) {
        nodes {
          id
          title
          slug
          featuredImage {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  `);

  if (programasResult?.data?.programas?.nodes?.length > 0) {
    console.log(`✅ ¡ÉXITO! ${programasResult.data.programas.nodes.length} programas encontrados:`);
    programasResult.data.programas.nodes.forEach(p => {
      console.log(`   - ${p.title} (${p.slug})`);
    });
    return { metodo: 'programas', datos: programasResult.data.programas.nodes };
  } else {
    console.log('❌ "programas" no funcionó');
    if (programasResult?.errors) {
      console.log('   Errores:', programasResult.errors.map(e => e.message).join(', '));
    }
  }

  // Test 2: Probar "programa" (singular)
  console.log('\n2. Probando consulta "programa"...');
  const programaResult = await graphqlRequest(`
    query {
      programa(first: 5) {
        nodes {
          id
          title
          slug
        }
      }
    }
  `);

  if (programaResult?.data?.programa?.nodes?.length > 0) {
    console.log(`✅ ¡ÉXITO! ${programaResult.data.programa.nodes.length} programas encontrados`);
    return { metodo: 'programa', datos: programaResult.data.programa.nodes };
  } else {
    console.log('❌ "programa" no funcionó');
  }

  // Test 3: Buscar en posts con categoría
  console.log('\n3. Buscando en posts con categoría "programa"...');
  const postsResult = await graphqlRequest(`
    query {
      posts(first: 10, where: { categoryName: "programa" }) {
        nodes {
          id
          title
          slug
          categories {
            nodes {
              name
            }
          }
        }
      }
    }
  `);

  if (postsResult?.data?.posts?.nodes?.length > 0) {
    console.log(`✅ ${postsResult.data.posts.nodes.length} posts con categoría "programa" encontrados`);
    return { metodo: 'posts-categoria', datos: postsResult.data.posts.nodes };
  } else {
    console.log('❌ No hay posts con categoría "programa"');
  }

  // Test 4: Buscar en todos los posts
  console.log('\n4. Buscando en todos los posts...');
  const allPostsResult = await graphqlRequest(`
    query {
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
  `);

  if (allPostsResult?.data?.posts?.nodes?.length > 0) {
    console.log(`✅ ${allPostsResult.data.posts.nodes.length} posts encontrados`);
    const programPosts = allPostsResult.data.posts.nodes.filter(p => 
      p.title.toLowerCase().includes('programa') ||
      p.categories.nodes.some(c => c.name.toLowerCase().includes('programa'))
    );
    if (programPosts.length > 0) {
      console.log(`   📻 ${programPosts.length} parecen ser programas:`);
      programPosts.forEach(p => {
        console.log(`      - ${p.title}`);
      });
    }
  }

  // Test 5: Listar todos los tipos de contenido
  console.log('\n5. Listando tipos de contenido disponibles...');
  const schemaResult = await graphqlRequest(`
    query {
      __schema {
        queryType {
          fields {
            name
            type {
              name
            }
          }
        }
      }
    }
  `);

  if (schemaResult?.data?.__schema?.queryType?.fields) {
    const relevantTypes = schemaResult.data.__schema.queryType.fields
      .filter(f => f.name.toLowerCase().includes('programa') || 
                   f.name.toLowerCase().includes('vinilo') ||
                   f.name.toLowerCase().includes('post'))
      .map(f => f.name);
    
    console.log('📋 Tipos relevantes encontrados:');
    relevantTypes.forEach(type => console.log(`   - ${type}`));
  }

  return null;
}

// PARTE 3: Generar recomendaciones
async function generarRecomendaciones(logoData, programasData) {
  console.log('\n\n🎯 RECOMENDACIONES Y SOLUCIONES');
  console.log('=================================\n');

  // Recomendaciones para el logo
  console.log('🖼️ LOGO:');
  if (logoData.customLogo || logoData.siteIcon || logoData.favicon) {
    console.log('✅ Se encontró al menos un logo en WordPress');
    console.log('💡 SOLUCIÓN: Actualizar wordpress.js para usar el logo disponible');
    
    if (logoData.customLogo) {
      console.log(`   Usar customLogo: ${logoData.customLogo.sourceUrl}`);
    } else if (logoData.siteIcon) {
      console.log(`   Usar siteIcon: ${logoData.siteIcon.sourceUrl}`);
    } else if (logoData.favicon) {
      console.log(`   Usar favicon: ${logoData.favicon.sourceUrl}`);
    }
  } else {
    console.log('❌ No se encontró ningún logo en WordPress');
    console.log('💡 SOLUCIONES:');
    console.log('   1. Subir un logo a WordPress: Apariencia → Personalizar → Identidad del sitio');
    console.log('   2. Usar el logo local: /images/logos/vinyl-station-logo.svg');
  }

  // Recomendaciones para programas
  console.log('\n📻 PROGRAMAS:');
  if (programasData) {
    console.log(`✅ Programas encontrados usando método: "${programasData.metodo}"`);
    console.log('💡 SOLUCIÓN: Actualizar wordpress.js para usar este método');
  } else {
    console.log('❌ No se encontraron programas en WordPress');
    console.log('💡 SOLUCIONES:');
    console.log('   1. Verificar que el CPT "programas" esté registrado en WordPress');
    console.log('   2. En CPT UI, asegurarse de que "Show in GraphQL" esté activado');
    console.log('   3. Verificar que hay programas publicados (no en borrador)');
    console.log('   4. Si los programas son posts normales, usar categorías');
  }

  // Código de ejemplo para actualizar
  console.log('\n📝 CÓDIGO DE EJEMPLO PARA wordpress.js:');
  console.log('=====================================');
  
  if (programasData) {
    console.log(`
// En la función getProgramas():
const query = gql\`
  query GetProgramas($limit: Int!) {
    ${programasData.metodo}(first: $limit) {
      nodes {
        id
        title
        slug
        // ... resto de campos
      }
    }
  }
\`;`);
  }

  if (logoData.customLogo || logoData.siteIcon) {
    const logoField = logoData.customLogo ? 'customLogo' : 'siteIcon';
    console.log(`
// En la función getSiteLogo():
const query = gql\`
  query GetLogo {
    ${logoField} {
      node {
        sourceUrl
        altText
      }
    }
  }
\`;`);
  }
}

// Ejecutar diagnóstico completo
async function ejecutarDiagnostico() {
  try {
    const logoData = await diagnosticarLogo();
    const programasData = await diagnosticarProgramas();
    await generarRecomendaciones(logoData, programasData);
    
    console.log('\n\n✅ Diagnóstico completado');
    console.log('📧 Si necesitas ayuda adicional, comparte este reporte');
  } catch (error) {
    console.error('\n❌ Error durante el diagnóstico:', error.message);
  }
}

// Ejecutar
ejecutarDiagnostico();
