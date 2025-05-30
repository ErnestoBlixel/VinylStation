// debug-logo-updated.mjs
// Script mejorado para encontrar y establecer el logo-vinylstation como icono del sitio

console.log('🔍 Buscando logo-vinylstation en WordPress...\n');

async function findAndSetLogo() {
  try {
    // 1. Buscar específicamente "logo-vinylstation"
    console.log('🎯 Buscando específicamente "logo-vinylstation"...');
    
    const specificQuery = {
      query: `
        query SearchSpecificLogo {
          mediaItems(first: 20, where: { search: "logo-vinylstation" }) {
            nodes {
              id
              databaseId
              title
              sourceUrl
              altText
              slug
              mimeType
            }
          }
        }
      `
    };
    
    let response = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(specificQuery)
    });
    
    let result = await response.json();
    
    if (result.data?.mediaItems?.nodes && result.data.mediaItems.nodes.length > 0) {
      console.log(`✅ ${result.data.mediaItems.nodes.length} resultados para "logo-vinylstation":`);
      
      let logoFound = null;
      result.data.mediaItems.nodes.forEach((item, index) => {
        console.log(`   ${index + 1}. ID: ${item.databaseId} | GraphQL ID: ${item.id}`);
        console.log(`      Título: ${item.title}`);
        console.log(`      URL: ${item.sourceUrl}`);
        console.log(`      Slug: ${item.slug}`);
        console.log(`      Tipo: ${item.mimeType}`);
        console.log('      ---');
        
        // Buscar el PNG específico
        if (item.title === 'logo-vinylstation' || item.slug === 'logo-vinylstation') {
          logoFound = item;
        }
      });
      
      if (logoFound) {
        console.log(`\n🎯 Logo encontrado: ${logoFound.title}`);
        console.log(`   Database ID: ${logoFound.databaseId}`);
        console.log(`   URL: ${logoFound.sourceUrl}`);
        
        // Ahora intentar establecerlo como icono del sitio
        await setSiteIcon(logoFound.databaseId);
      } else {
        console.log('\n⚠️ No se encontró el logo exacto "logo-vinylstation"');
      }
      
    } else {
      console.log('⚠️ No se encontró "logo-vinylstation"');
      
      // Buscar con términos alternativos
      console.log('\n🔄 Probando búsquedas alternativas...');
      await searchAlternatives();
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

async function searchAlternatives() {
  const searches = ['vinylstation', 'vinyl station', 'logo vinyl'];
  
  for (const searchTerm of searches) {
    console.log(`\n🔍 Buscando: "${searchTerm}"`);
    
    try {
      const query = {
        query: `
          query SearchAlternative {
            mediaItems(first: 10, where: { search: "${searchTerm}" }) {
              nodes {
                id
                databaseId
                title
                sourceUrl
                slug
                mimeType
              }
            }
          }
        `
      };
      
      const response = await fetch('https://cms.vinylstation.es/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query)
      });
      
      const result = await response.json();
      
      if (result.data?.mediaItems?.nodes && result.data.mediaItems.nodes.length > 0) {
        console.log(`   ✅ ${result.data.mediaItems.nodes.length} resultados:`);
        result.data.mediaItems.nodes.forEach(item => {
          console.log(`      - ${item.title} (ID: ${item.databaseId}): ${item.sourceUrl}`);
        });
      } else {
        console.log(`   ⚠️ Sin resultados para "${searchTerm}"`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error buscando "${searchTerm}":`, error.message);
    }
  }
}

async function setSiteIcon(mediaId) {
  console.log(`\n⚙️ Intentando establecer el icono del sitio con ID: ${mediaId}`);
  
  try {
    // Nota: Esta operación requiere autenticación y permisos de administrador
    // Necesitarías un token JWT válido para esta operación
    console.log('ℹ️ Para establecer el icono del sitio necesitas:');
    console.log('   1. Autenticación JWT en WordPress');
    console.log('   2. Permisos de administrador');
    console.log('   3. Plugin que permita mutations para site_icon');
    console.log(`\n📋 Pasos manuales alternativos:`);
    console.log(`   1. Ve al panel de WordPress: https://cms.vinylstation.es/wp-admin`);
    console.log(`   2. Ve a Apariencia > Personalizar > Identidad del sitio`);
    console.log(`   3. Busca "Icono del sitio" y selecciona la imagen con ID: ${mediaId}`);
    console.log(`   4. O busca "logo-vinylstation.png" en la biblioteca de medios`);
    
    // Si tienes autenticación configurada, puedes intentar esto:
    /*
    const mutation = {
      query: `
        mutation SetSiteIcon {
          updateGeneralSettings(input: {
            siteIcon: ${mediaId}
          }) {
            generalSettings {
              title
            }
          }
        }
      `
    };
    
    const response = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_JWT_TOKEN'
      },
      body: JSON.stringify(mutation)
    });
    
    const result = await response.json();
    console.log('✅ Icono del sitio actualizado:', result);
    */
    
  } catch (error) {
    console.error('❌ Error estableciendo icono:', error.message);
  }
}

async function checkCurrentSiteIcon() {
  console.log('\n🔍 Verificando icono actual del sitio...');
  
  try {
    const query = {
      query: `
        query GetCurrentSiteIcon {
          generalSettings {
            title
            url
          }
          siteIcon {
            node {
              id
              databaseId
              sourceUrl
              altText
              title
            }
          }
        }
      `
    };
    
    const response = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query)
    });
    
    const result = await response.json();
    
    if (result.data?.siteIcon?.node) {
      console.log('✅ Icono actual del sitio:');
      console.log(`   Título: ${result.data.siteIcon.node.title}`);
      console.log(`   URL: ${result.data.siteIcon.node.sourceUrl}`);
      console.log(`   ID: ${result.data.siteIcon.node.databaseId}`);
    } else {
      console.log('⚠️ No hay icono del sitio configurado');
    }
    
  } catch (error) {
    console.error('❌ Error verificando icono actual:', error.message);
  }
}

// Ejecutar todas las funciones
async function runAll() {
  await checkCurrentSiteIcon();
  await findAndSetLogo();
}

runAll();