// debug-logo-only.mjs
// Script específico para debuggear solo el problema del logo

console.log('🔍 Debug específico del logo...\n');

async function debugLogo() {
  const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';
  
  try {
    console.log('🌐 Conectando a:', WORDPRESS_GRAPHQL_URL);
    console.log('');
    
    // 1. Verificar siteIcon
    console.log('1️⃣ Verificando siteIcon...');
    
    const siteIconQuery = {
      query: `
        query GetSiteIcon {
          siteIcon {
            node {
              id
              databaseId
              title
              sourceUrl
              altText
              mimeType
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
      body: JSON.stringify(siteIconQuery)
    });
    
    let result = await response.json();
    
    console.log('   Respuesta siteIcon:', JSON.stringify(result, null, 2));
    
    if (result.errors) {
      console.log('   ❌ Errores en siteIcon:', result.errors);
    } else if (result.data?.siteIcon?.node) {
      console.log('   ✅ siteIcon encontrado:', result.data.siteIcon.node.title);
      console.log('   📸 URL:', result.data.siteIcon.node.sourceUrl);
      return; // Si encontramos siteIcon, terminamos aquí
    } else {
      console.log('   ⚠️ siteIcon está vacío');
    }
    
    console.log('');
    
    // 2. Buscar logo-vinylstation
    console.log('2️⃣ Buscando "logo-vinylstation"...');
    
    const logoQuery = {
      query: `
        query SearchLogo {
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
    
    response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logoQuery)
    });
    
    result = await response.json();
    
    console.log('   Respuesta logo-vinylstation:', JSON.stringify(result, null, 2));
    
    if (result.data?.mediaItems?.nodes && result.data.mediaItems.nodes.length > 0) {
      console.log('   ✅ Encontrados', result.data.mediaItems.nodes.length, 'resultados:');
      result.data.mediaItems.nodes.forEach((item, index) => {
        console.log(`      ${index + 1}. "${item.title}" (ID: ${item.databaseId})`);
        console.log(`         URL: ${item.sourceUrl}`);
        console.log(`         Slug: ${item.slug}`);
      });
    } else {
      console.log('   ⚠️ No se encontró "logo-vinylstation"');
    }
    
    console.log('');
    
    // 3. Buscar solo "logo"
    console.log('3️⃣ Buscando solo "logo"...');
    
    const simpleLogoQuery = {
      query: `
        query SearchSimpleLogo {
          mediaItems(first: 10, where: { search: "logo" }) {
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
    
    response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simpleLogoQuery)
    });
    
    result = await response.json();
    
    if (result.data?.mediaItems?.nodes && result.data.mediaItems.nodes.length > 0) {
      console.log('   ✅ Encontrados', result.data.mediaItems.nodes.length, 'resultados con "logo":');
      result.data.mediaItems.nodes.forEach((item, index) => {
        console.log(`      ${index + 1}. "${item.title}" (ID: ${item.databaseId})`);
        console.log(`         URL: ${item.sourceUrl}`);
        console.log(`         Slug: ${item.slug}`);
        console.log(`         Tipo: ${item.mimeType}`);
      });
    } else {
      console.log('   ⚠️ No se encontraron imágenes con "logo"');
    }
    
    console.log('');
    
    // 4. Listar TODAS las imágenes recientes
    console.log('4️⃣ Listando todas las imágenes recientes...');
    
    const allImagesQuery = {
      query: `
        query GetAllImages {
          mediaItems(first: 10, where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
              id
              databaseId
              title
              sourceUrl
              altText
              slug
              mimeType
              date
            }
          }
        }
      `
    };
    
    response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(allImagesQuery)
    });
    
    result = await response.json();
    
    if (result.data?.mediaItems?.nodes && result.data.mediaItems.nodes.length > 0) {
      console.log('   ✅ Imágenes recientes en WordPress:');
      result.data.mediaItems.nodes.forEach((item, index) => {
        console.log(`      ${index + 1}. "${item.title}" (ID: ${item.databaseId})`);
        console.log(`         URL: ${item.sourceUrl}`);
        console.log(`         Fecha: ${item.date}`);
        console.log(`         Tipo: ${item.mimeType}`);
      });
    } else {
      console.log('   ⚠️ No hay imágenes en WordPress');
    }
    
  } catch (error) {
    console.error('❌ ERROR GENERAL:', error.message);
    console.error('   Detalles:', error);
  }
}

// Ejecutar debug
debugLogo();