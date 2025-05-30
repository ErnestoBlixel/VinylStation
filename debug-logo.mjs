// debug-logo.mjs
// Script para encontrar el logo del sitio en WordPress

console.log('🔍 Buscando el logo del sitio en WordPress...\n');

async function debugLogo() {
  try {
    // 1. Probar con customLogo
    console.log('1️⃣ Probando con customLogo...');
    
    const customLogoQuery = {
      query: `
        query GetCustomLogo {
          customLogo {
            node {
              sourceUrl
              altText
              id
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
      body: JSON.stringify(customLogoQuery)
    });
    
    let result = await response.json();
    
    if (result.errors) {
      console.log('❌ Error con customLogo:', result.errors[0].message);
    } else if (result.data?.customLogo) {
      console.log('✅ customLogo encontrado:', result.data.customLogo);
    } else {
      console.log('⚠️ customLogo existe pero está vacío');
    }
    
    // 2. Probar con siteIcon
    console.log('\n2️⃣ Probando con siteIcon...');
    
    const siteIconQuery = {
      query: `
        query GetSiteIcon {
          generalSettings {
            title
            url
          }
          siteIcon {
            node {
              sourceUrl
              altText
              id
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
      body: JSON.stringify(siteIconQuery)
    });
    
    result = await response.json();
    
    if (result.errors) {
      console.log('❌ Error con siteIcon:', result.errors[0].message);
    } else if (result.data?.siteIcon) {
      console.log('✅ siteIcon encontrado:', result.data.siteIcon);
    } else {
      console.log('⚠️ siteIcon existe pero está vacío');
    }
    
    // 3. Probar con favicon
    console.log('\n3️⃣ Probando con favicon...');
    
    const faviconQuery = {
      query: `
        query GetFavicon {
          favicon {
            node {
              sourceUrl
              altText
              id
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
      body: JSON.stringify(faviconQuery)
    });
    
    result = await response.json();
    
    if (result.errors) {
      console.log('❌ Error con favicon:', result.errors[0].message);
    } else if (result.data?.favicon) {
      console.log('✅ favicon encontrado:', result.data.favicon);
    } else {
      console.log('⚠️ favicon existe pero está vacío');
    }
    
    // 4. Buscar en mediaItems con palabra clave "logo"
    console.log('\n4️⃣ Buscando en mediaItems...');
    
    const mediaQuery = {
      query: `
        query SearchLogo {
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
      `
    };
    
    response = await fetch('https://cms.vinylstation.es/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mediaQuery)
    });
    
    result = await response.json();
    
    if (result.data?.mediaItems?.nodes) {
      console.log(`✅ ${result.data.mediaItems.nodes.length} mediaItems encontrados:`);
      result.data.mediaItems.nodes.forEach(item => {
        console.log(`   - ${item.title}: ${item.sourceUrl}`);
      });
    } else {
      console.log('⚠️ No se encontraron mediaItems con "logo"');
    }
    
    // 5. Listar todos los mediaItems recientes
    console.log('\n5️⃣ Listando mediaItems recientes...');
    
    const recentMediaQuery = {
      query: `
        query GetRecentMedia {
          mediaItems(first: 5, where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
              id
              title
              sourceUrl
              altText
              slug
              date
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
      body: JSON.stringify(recentMediaQuery)
    });
    
    result = await response.json();
    
    if (result.data?.mediaItems?.nodes) {
      console.log(`✅ ${result.data.mediaItems.nodes.length} mediaItems recientes:`);
      result.data.mediaItems.nodes.forEach(item => {
        console.log(`   - ${item.title} (${item.date}): ${item.sourceUrl}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar debug
debugLogo();