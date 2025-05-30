// get-site-logo.mjs
// Función específica para obtener el logo del sitio desde WordPress

export async function getSiteLogo() {
  const WORDPRESS_GRAPHQL_URL = 'https://cms.vinylstation.es/graphql';
  
  console.log('🎯 Obteniendo logo del sitio...');
  
  try {
    // 1. Intentar obtener el siteIcon configurado
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
    
    if (result.data?.siteIcon?.node) {
      console.log('✅ Logo obtenido desde siteIcon:');
      console.log(`   Título: ${result.data.siteIcon.node.title}`);
      console.log(`   URL: ${result.data.siteIcon.node.sourceUrl}`);
      
      return {
        url: result.data.siteIcon.node.sourceUrl,
        altText: result.data.siteIcon.node.altText || result.data.siteIcon.node.title || 'VinylStation',
        source: 'siteIcon'
      };
    }
    
    // 2. Buscar específicamente "logo-vinylstation"
    console.log('🔍 Buscando logo-vinylstation en mediaItems...');
    
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
    
    if (result.data?.mediaItems?.nodes && result.data.mediaItems.nodes.length > 0) {
      // Buscar el más específico
      const exactMatch = result.data.mediaItems.nodes.find(item => 
        item.title === 'logo-vinylstation' || item.slug === 'logo-vinylstation'
      );
      
      const logoItem = exactMatch || result.data.mediaItems.nodes[0];
      
      console.log('✅ Logo encontrado en mediaItems:');
      console.log(`   Título: ${logoItem.title}`);
      console.log(`   URL: ${logoItem.sourceUrl}`);
      
      return {
        url: logoItem.sourceUrl,
        altText: logoItem.altText || logoItem.title || 'VinylStation',
        source: 'mediaItems',
        databaseId: logoItem.databaseId
      };
    }
    
    // 3. Buscar con términos alternativos
    console.log('🔍 Buscando con términos alternativos...');
    
    const alternativeSearches = ['vinylstation logo', 'vinyl station', 'logo'];
    
    for (const searchTerm of alternativeSearches) {
      const altQuery = {
        query: `
          query SearchAlternative {
            mediaItems(first: 10, where: { search: "${searchTerm}" }) {
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
        body: JSON.stringify(altQuery)
      });
      
      result = await response.json();
      
      if (result.data?.mediaItems?.nodes && result.data.mediaItems.nodes.length > 0) {
        const logoItem = result.data.mediaItems.nodes.find(item => 
          item.title.toLowerCase().includes('logo')
        ) || result.data.mediaItems.nodes[0];
        
        console.log(`✅ Logo encontrado con "${searchTerm}":`, logoItem.title);
        
        return {
          url: logoItem.sourceUrl,
          altText: logoItem.altText || logoItem.title || 'VinylStation',
          source: `search:${searchTerm}`,
          databaseId: logoItem.databaseId
        };
      }
    }
    
    // 4. Fallback a logo local
    console.log('⚠️ No se encontró logo en WordPress, usando fallback');
    
    return {
      url: '/images/logos/vinyl-station-logo.svg',
      altText: 'VinylStation',
      source: 'fallback'
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo logo:', error.message);
    
    return {
      url: '/images/logos/vinyl-station-logo.svg',
      altText: 'VinylStation',
      source: 'error'
    };
  }
}

// Función para usar en Astro
export async function getLogoForAstro() {
  const logo = await getSiteLogo();
  
  console.log(`🎯 Logo para Astro: ${logo.url} (fuente: ${logo.source})`);
  
  return logo;
}

// Si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  getSiteLogo().then(logo => {
    console.log('\n📋 Resultado final:');
    console.log('Logo:', logo);
  });
}