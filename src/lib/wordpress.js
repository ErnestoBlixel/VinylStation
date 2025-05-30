import { request, gql } from 'graphql-request';

const WORDPRESS_GRAPHQL_URL =
  import.meta.env.PUBLIC_WORDPRESS_GRAPHQL_URL ||
  'https://cms.vinylstation.es/graphql';

console.log('🔗 WordPress API URL:', WORDPRESS_GRAPHQL_URL);

function processImageURL(url) {
  if (!url) return '/images/placeholder-radio.jpg'; // Podríamos tener placeholders específicos por tipo
  if (/^https?:\/\//.test(url)) return url;
  const wpBase = import.meta.env.PUBLIC_WORDPRESS_API_URL
    ? import.meta.env.PUBLIC_WORDPRESS_API_URL.replace('/wp-json', '')
    : 'https://cms.vinylstation.es';
  return url.startsWith('/') ? `${wpBase}${url}` : url;
}

export async function getSiteLogo() {
  console.log('🎯 Obteniendo logo del sitio...');
  const LOGO = gql`
    query GetCustomLogo {
      customLogo {
        node {
          sourceUrl
          altText
          title
        }
      }
    }
  `;

  try {
    const { customLogo } = await request(WORDPRESS_GRAPHQL_URL, LOGO);
    if (customLogo?.node?.sourceUrl) {
      return {
        url: processImageURL(customLogo.node.sourceUrl),
        altText: customLogo.node.altText || 'VinylStation',
        source: 'customLogo',
      };
    }
  } catch {
    console.warn('⚠️ customLogo no disponible, usando fallback');
  }

  return {
    url: '/images/logos/vinyl-station-logo.svg', // Asegúrate que esta ruta es correcta
    altText: 'VinylStation',
    source: 'fallback',
  };
}

export async function getSiteInfo() {
  console.log('🔄 Obteniendo información del sitio desde WordPress...');
  const QUERY = gql`
    query GetSiteInfo {
      generalSettings {
        title
        description
        url
        timezone
        language
      }
    }
  `;
  try {
    const { generalSettings } = await request(WORDPRESS_GRAPHQL_URL, QUERY);

    if (!generalSettings?.title) {
      console.warn('⚠️ No se obtuvo el título desde generalSettings, usando fallback.');
      // Proporcionar un fallback si generalSettings falla
      const logoFallback = await getSiteLogo();
      return {
        title: 'VinylStation',
        description: 'Tu emisora de vinilo 24/7',
        url: import.meta.env.SITE || 'https://vinylstation.es',
        timezone: 'Europe/Madrid',
        language: 'es-ES',
        logo: logoFallback,
      };
    }

    const logo = await getSiteLogo();

    return {
      title: generalSettings.title,
      description: generalSettings.description,
      url: generalSettings.url,
      timezone: generalSettings.timezone,
      language: generalSettings.language,
      logo: {
        url: logo.url,
        altText: logo.altText,
        source: logo.source,
      },
    };
  } catch (error) {
    console.error("❌ Error en getSiteInfo:", error.message);
    const logoFallback = await getSiteLogo(); // Intenta obtener el logo incluso si generalSettings falla
    return { // Devuelve un objeto de fallback completo
        title: 'VinylStation (Error)',
        description: 'Error al cargar la información del sitio.',
        url: import.meta.env.SITE || 'https://vinylstation.es',
        timezone: 'Europe/Madrid',
        language: 'es-ES',
        logo: logoFallback,
      };
  }
}

export async function getProgramas({ limit = 10 } = {}) {
  console.log(`📻 Obteniendo ${limit} programas...`);
  const QUERY = gql`
    query GetProgramas($first: Int!) {
      programas(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
        pageInfo {
          hasNextPage
          hasPreviousPage # Si necesitas paginación hacia atrás
          endCursor
          startCursor   # Si necesitas paginación hacia atrás
        }
        nodes {
          id
          slug
          title
          date
          # excerpt # Eliminado si no está disponible
          content # Para generar excerpt manualmente
          imagenPrincipalUrl(size: "medium") 
          imagenPrincipal { 
            sourceUrl
            altText
          }
          featuredImage { 
            node {
              sourceUrl
              altText
            }
          }
          camposPrograma {
            vsDescripcion
          }
          seo {
            title
            metaDesc
            opengraphTitle
            opengraphDescription
            twitterTitle
            twitterDescription
          }
        }
      }
    }
  `;

  try {
    const { programas } = await request(
      WORDPRESS_GRAPHQL_URL,
      QUERY,
      { first: limit }
    );

    const nodes = programas?.nodes;
    if (!Array.isArray(nodes)) {
      console.warn('⚠️ getProgramas: respuesta inesperada o sin nodos', programas);
      return { programas: [], pageInfo: null };
    }

    const enviados = nodes.map((p) => {
      const imgUrl =
        p.imagenPrincipalUrl || 
        processImageURL(p.imagenPrincipal?.sourceUrl) || 
        processImageURL(p.featuredImage?.node?.sourceUrl) ||
        '/images/placeholder-radio.jpg';

      const alt =
        p.imagenPrincipal?.altText ||
        p.featuredImage?.node?.altText ||
        p.seo?.title ||
        p.title;
      
      let cleanExcerpt = '';
      if (p.content) { // Generar excerpt desde content
        cleanExcerpt = p.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        cleanExcerpt = cleanExcerpt.substring(0, 160) + (cleanExcerpt.length > 160 ? '...' : '');
      } else {
        cleanExcerpt = p.seo?.metaDesc || `Programa "${p.title}" - Música en vinilo`;
      }


      return {
        ...p,
        imagenPrincipalUrl: imgUrl,
        imagenPrincipal: { sourceUrl: imgUrl, altText: alt }, 
        excerpt: cleanExcerpt, 
        camposPrograma: {
          vsDescripcion:
            p.camposPrograma?.vsDescripcion ||
            cleanExcerpt,
        },
        seo:
          p.seo?.title ? p.seo : { 
            title: `${p.title} | VinylStation Programas`,
            metaDesc: cleanExcerpt,
          },
      };
    });

    return {
      programas: enviados,
      pageInfo: programas.pageInfo,
    };
  } catch (error) {
    console.error('❌ Error en getProgramas:', error.message);
    if (error.response?.errors) {
        console.error('GraphQL Errors (getProgramas):', JSON.stringify(error.response.errors, null, 2));
    }
    return { programas: [], pageInfo: null };
  }
}

// ===============================
// FUNCION getPageData (CORREGIDA)
// ===============================
export async function getPageData(slug) {
  console.log(`📄 Obteniendo página (corregido v2): ${slug || 'home'}`);
  const slugToId = { inicio: 1, home: 1, programas: 8034, vinilos: 8038 }; 
  let query, vars = {};

  const PAGE_FIELDS = gql`
    fragment PageFields on Page {
      id
      title
      content 
      slug
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      seo {
        title
        metaDesc
        opengraphTitle
        opengraphDescription
        twitterTitle
        twitterDescription
      }
    }
  `;

  if (!slug || slug === 'home' || slug === 'inicio') {
    query = gql`
      ${PAGE_FIELDS}
      query GetHomePage {
        page(id: "/", idType: URI) {
          ...PageFields
        }
      }
    `;
  } else if (slugToId[slug]) {
    query = gql`
      ${PAGE_FIELDS}
      query GetPageByDatabaseId($id: ID!) {
        page(id: $id, idType: DATABASE_ID) {
          ...PageFields
        }
      }
    `;
    vars = { id: slugToId[slug] };
  } else {
    query = gql`
      ${PAGE_FIELDS}
      query GetPageBySlug($slug: ID!) {
        page(id: $slug, idType: SLUG) {
          ...PageFields
        }
      }
    `;
    vars = { slug };
  }

  try {
    const { page } = await request(WORDPRESS_GRAPHQL_URL, query, vars);
    if (!page) throw new Error(`Página no encontrada para slug/id: ${slug || JSON.stringify(vars)}`);
    
    let cleanExcerpt = '';
    if (page.content) {
      cleanExcerpt = page.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(); 
      cleanExcerpt = cleanExcerpt.substring(0, 250) + (cleanExcerpt.length > 250 ? '...' : ''); 
    } else {
        cleanExcerpt = page.seo?.metaDesc || `Contenido de la página ${page.title || 'desconocida'}.`;
    }

    return {
      ...page,
      excerpt: cleanExcerpt, 
      featuredImage: page.featuredImage?.node
        ? {
            url: processImageURL(page.featuredImage.node.sourceUrl),
            altText: page.featuredImage.node.altText || page.title,
          }
        : null,
      seo:
        page.seo?.title ? page.seo : {
          title: `${page.title || 'Página'} | VinylStation`,
          metaDesc: cleanExcerpt.substring(0,160) || 'Tu emisora de vinilo 24/7',
        },
    };
  } catch (error) {
    console.error(`❌ Error en getPageData(${slug || JSON.stringify(vars)}):`, error.message);
    if (error.response?.errors) {
        console.error('GraphQL Errors (getPageData):', JSON.stringify(error.response.errors, null, 2));
    }
    const pageTitleFallback = slug ? (slug.charAt(0).toUpperCase() + slug.slice(1)) : 'VinylStation';
    return {
      id: 'fallback-page',
      title: pageTitleFallback,
      content: `<p>Error al cargar el contenido de la página. Por favor, inténtalo de nuevo más tarde.</p>`,
      excerpt: 'Error al cargar el contenido. Revisa la consola del servidor para más detalles.',
      slug: slug || 'error',
      date: new Date().toISOString(),
      featuredImage: null,
      seo: {
        title: `${pageTitleFallback} | VinylStation`,
        metaDesc: 'Error al cargar la descripción de la página.',
      },
    };
  }
}

// ===============================
// FUNCIONES PARA VINILOS (CORREGIDA Y SIMPLIFICADA)
// ===============================
export async function getVinilos({ limit = 200, page = null, itemsPerPage = 20 } = {}) {
  // Si se especifica una página, usar paginación eficiente
  if (page !== null) {
    return getVinilosPaginados({ page, itemsPerPage });
  }
  
  // Para Astro static generation, usar consulta simple y directa
  console.log(`📀 Obteniendo ${limit} vinilos para paginación estática...`);
  
  const QUERY = gql`
    query GetVinilosForPagination($first: Int!) {
      vinilos(first: $first, where: {orderby: {field: DATE, order: DESC}}) { 
        pageInfo {
          hasNextPage
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

  try {
    const variables = { first: Math.min(limit, 200) }; // Máximo 200 para evitar timeouts
    const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY, variables);
    
    const nodes = rawData?.vinilos?.nodes || [];
    const pageInfo = rawData?.vinilos?.pageInfo;

    if (!Array.isArray(nodes)) {
      console.warn('⚠️ getVinilos: nodes inválidos');
      return { vinilos: [], pageInfo: { hasNextPage: false, total: 0 } };
    }
    
    console.log(`📀 Obtenidos ${nodes.length} vinilos de la API`);

    const vinilosProcesados = nodes.map((v, index) => {
      const imgUrl =
        v.imagenPrincipalUrl ||
        processImageURL(v.imagenPrincipal?.sourceUrl) ||
        '/images/placeholder-vinyl.jpg';

      const alt = v.imagenPrincipal?.altText || v.title || `Vinilo ${v.databaseId || index}`;
      
      const generatedExcerpt = `Artista: ${v.camposVinilo?.vsArtista || 'N/A'}. Álbum: ${v.camposVinilo?.vsAlbum || 'N/A'}. Precio: ${v.camposVinilo?.vsPrecio || 'Consultar'}.`;

      return {
        ...v, 
        imagenPrincipalUrl: imgUrl,
        imagenPrincipal: { sourceUrl: imgUrl, altText: alt },
        excerpt: generatedExcerpt, 
        camposVinilo: { 
          vsPrecio: v.camposVinilo?.vsPrecio || '',
          vsArtista: v.camposVinilo?.vsArtista || '',
          vsAlbum: v.camposVinilo?.vsAlbum || '',
        },
        seo: {
          title: `${v.title || 'Vinilo'} | VinylStation`,
          metaDesc: generatedExcerpt.substring(0,160),
        },
      };
    });
    
    console.log(`✅ ${vinilosProcesados.length} vinilos procesados correctamente`);
    
    return {
      vinilos: vinilosProcesados,
      pageInfo: { 
        hasNextPage: pageInfo?.hasNextPage || false,
        total: vinilosProcesados.length
      }
    };
    
  } catch (error) {
    console.error('❌ Error en getVinilos:', error.message);
    if (error.response?.errors) {
        console.error('GraphQL Errors (getVinilos):', JSON.stringify(error.response.errors, null, 2));
    }
    return { 
        vinilos: [], 
        pageInfo: { hasNextPage: false, total: 0 } 
    };
  }
}

// Nueva función para paginación eficiente del servidor
export async function getVinilosPaginados({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`📀 Obteniendo página ${page} con ${itemsPerPage} vinilos (optimizado)...`);
  
  // Para las primeras 3 páginas, usar el método directo más eficiente
  if (page <= 3) {
    return getVinilosPaginadosOptimizado({ page, itemsPerPage });
  }
  
  // Para páginas posteriores, usar el método de cursor si es necesario
  return getVinilosPaginadosConCursor({ page, itemsPerPage });
}

// Función optimizada para paginación real del servidor
async function getVinilosPaginadosOptimizado({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`📄 Paginación simple: página ${page}, necesito ${itemsPerPage} elementos`);
  
  const QUERY = gql`
    query GetVinilosSimple($first: Int!) {
      vinilos(first: $first, where: {orderby: {field: DATE, order: DESC}}) { 
        pageInfo {
          hasNextPage
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

  try {
    // Cargar solo los elementos que necesito para esta página específica
    // Esto no es óptimo pero debería funcionar
    const totalNeeded = page * itemsPerPage;
    const variables = { first: Math.min(totalNeeded, 100) }; // Máximo 100 para evitar timeouts
    
    console.log(`📄 Pidiendo ${variables.first} elementos para página ${page}`);
    const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY, variables);
    
    const allNodes = rawData?.vinilos?.nodes || [];
    const pageInfo = rawData?.vinilos?.pageInfo;

    if (!Array.isArray(allNodes)) {
      console.warn('⚠️ Nodes inválidos');
      return { vinilos: [], pageInfo: { hasNext: false, hasPrevious: false, total: 4218, currentPage: page } };
    }
    
    // Slice simple: página 1 = 0-19, página 2 = 20-39, etc.
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const pageNodes = allNodes.slice(startIndex, endIndex);
    
    console.log(`✅ Página ${page}: extraídos ${pageNodes.length} vinilos (${startIndex} a ${endIndex-1})`);
    
    // Si no tengo suficientes elementos, devolver array vacío
    if (pageNodes.length === 0) {
      console.log('⚠️ No hay vinilos para esta página');
      return { vinilos: [], pageInfo: { hasNext: false, hasPrevious: page > 1, total: 4218, currentPage: page } };
    }
    
    const vinilosProcesados = pageNodes.map((v, index) => {
      const imgUrl = v.imagenPrincipalUrl || processImageURL(v.imagenPrincipal?.sourceUrl) || '/images/placeholder-vinyl.jpg';
      const alt = v.imagenPrincipal?.altText || v.title || `Vinilo ${v.databaseId || index}`;
      const generatedExcerpt = `Artista: ${v.camposVinilo?.vsArtista || 'N/A'}. Álbum: ${v.camposVinilo?.vsAlbum || 'N/A'}. Precio: ${v.camposVinilo?.vsPrecio || 'Consultar'}.`;

      return {
        ...v, 
        imagenPrincipalUrl: imgUrl,
        imagenPrincipal: { sourceUrl: imgUrl, altText: alt },
        excerpt: generatedExcerpt, 
        camposVinilo: { 
          vsPrecio: v.camposVinilo?.vsPrecio || '',
          vsArtista: v.camposVinilo?.vsArtista || '',
          vsAlbum: v.camposVinilo?.vsAlbum || '',
        },
        seo: {
          title: `${v.title || 'Vinilo'} | VinylStation`,
          metaDesc: generatedExcerpt.substring(0,160),
        },
      };
    });
    
    return {
      vinilos: vinilosProcesados,
      pageInfo: { 
        hasNext: pageNodes.length === itemsPerPage,
        hasPrevious: page > 1,
        total: 4218,
        totalPages: Math.ceil(4218 / itemsPerPage),
        currentPage: page,
        itemsPerPage
      }
    };
    
  } catch (error) {
    console.error('❌ Error simple:', error.message);
    return { 
      vinilos: [], 
      pageInfo: { hasNext: false, hasPrevious: page > 1, total: 4218, currentPage: page } 
    };
  }
}

// Función para páginas posteriores usando cursor (si es necesario)
async function getVinilosPaginadosConCursor({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`📀 Usando cursor para página ${page}...`);
  
  // Por ahora, usar el método simple (podría optimizarse más tarde con caching)
  return getVinilosPaginadosConCursorFallback({ page, itemsPerPage });
}

// Nueva función para obtener artistas únicos
export async function getArtistasUnicos() {
  console.log('🎤 Obteniendo artistas únicos...');
  
  const QUERY = gql`
    query GetArtistasUnicos {
      vinilos(first: 1000, where: {orderby: {field: DATE, order: DESC}}) {
        nodes {
          camposVinilo {
            vsArtista
          }
        }
      }
    }
  `;

  try {
    const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY);
    const nodes = rawData?.vinilos?.nodes || [];
    
    const artistasSet = new Set();
    nodes.forEach(vinilo => {
      const artista = vinilo.camposVinilo?.vsArtista;
      if (artista && artista.trim() && artista !== 'N/A') {
        artistasSet.add(artista.trim());
      }
    });
    
    const totalArtistas = artistasSet.size;
    console.log(`✅ Artistas únicos encontrados: ${totalArtistas}`);
    
    return {
      count: totalArtistas,
      artistas: Array.from(artistasSet)
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo artistas únicos:', error.message);
    // Fallback: usar un número estimado basado en el total de vinilos
    return {
      count: Math.floor(4218 * 0.3), // Estimar 30% de vinilos tienen artistas únicos
      artistas: []
    };
  }
}

// Función de fallback si offsetPagination no está disponible
async function getVinilosPaginadosConCursorFallback({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`🔄 Fallback: simulando paginación para página ${page}`);
  
  const QUERY = gql`
    query GetVinilosCursor($first: Int!) {
      vinilos(first: $first, where: {orderby: {field: DATE, order: DESC}}) { 
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

  try {
    // Cargar suficientes elementos para simular la página solicitada
    const itemsToLoad = page * itemsPerPage;
    const variables = { first: itemsToLoad };
    
    console.log(`📄 Fallback: cargando ${itemsToLoad} items para simular página ${page}`);
    const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY, variables);
    
    const allNodes = rawData?.vinilos?.nodes || [];
    const pageInfo = rawData?.vinilos?.pageInfo;

    if (!Array.isArray(allNodes)) {
      console.warn('⚠️ fallback: nodes inválidos');
      return { vinilos: [], pageInfo: { hasNext: false, hasPrevious: false, total: 0, currentPage: page } };
    }
    
    // Extraer solo los vinilos de la página actual (CORREGIDO)
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageNodes = allNodes.slice(startIndex, endIndex); // ✅ SLICE CORREGIDO
    
    console.log(`✅ Fallback página ${page}: ${pageNodes.length} vinilos (de ${startIndex} a ${endIndex-1})`);
    
    const vinilosProcesados = pageNodes.map((v, index) => {
      const imgUrl =
        v.imagenPrincipalUrl ||
        processImageURL(v.imagenPrincipal?.sourceUrl) ||
        '/images/placeholder-vinyl.jpg';

      const alt = v.imagenPrincipal?.altText || v.title || `Vinilo ${v.databaseId || index}`;
      
      const generatedExcerpt = `Artista: ${v.camposVinilo?.vsArtista || 'N/A'}. Álbum: ${v.camposVinilo?.vsAlbum || 'N/A'}. Precio: ${v.camposVinilo?.vsPrecio || 'Consultar'}.`;

      return {
        ...v, 
        imagenPrincipalUrl: imgUrl,
        imagenPrincipal: { sourceUrl: imgUrl, altText: alt },
        excerpt: generatedExcerpt, 
        camposVinilo: { 
          vsPrecio: v.camposVinilo?.vsPrecio || '',
          vsArtista: v.camposVinilo?.vsArtista || '',
          vsAlbum: v.camposVinilo?.vsAlbum || '',
        },
        seo: {
          title: `${v.title || 'Vinilo'} | VinylStation`,
          metaDesc: generatedExcerpt.substring(0,160),
        },
      };
    });
    
    // Calcular información de paginación para fallback
    const hasNext = pageInfo?.hasNextPage || (allNodes.length === itemsToLoad);
    const hasPrevious = page > 1;
    const totalEstimado = hasNext ? 4218 : allNodes.length; // Usar total conocido si hay más páginas
    const totalPaginas = Math.ceil(totalEstimado / itemsPerPage);
    
    console.log(`📊 Fallback: total=${totalEstimado}, páginas=${totalPaginas}, actual=${page}, hasNext=${hasNext}`);
    
    return {
      vinilos: vinilosProcesados,
      pageInfo: { 
        hasNext,
        hasPrevious,
        total: totalEstimado,
        totalPages: totalPaginas,
        currentPage: page,
        itemsPerPage
      }
    };
    
  } catch (error) {
    console.error('❌ Error en fallback:', error.message);
    return { 
      vinilos: [], 
      pageInfo: { hasNext: false, hasPrevious: false, total: 0, currentPage: page } 
    };
  }
}

// ===============================
// FUNCION getViniloBySlug (CORREGIDA)
// ===============================
export async function getViniloBySlug(slug) {
  console.log(`📀 Obteniendo vinilo (corregido v2): ${slug}`);
  const QUERY = gql`
    query GetViniloBySlug($slug: ID!) {
      vinilo(id: $slug, idType: SLUG) {
        databaseId
        title
        slug
        date
        content # Para generar excerpt
        imagenPrincipalUrl
        imagenPrincipal {
          sourceUrl(size: LARGE) 
          altText
        }
        camposVinilo {
          vsPrecio
          vsArtista
          vsAlbum
        }
        seo {
          title
          metaDesc
          opengraphTitle
          opengraphDescription
          twitterTitle
          twitterDescription
        }
      }
    }
  `;

  try {
    const { vinilo } = await request(WORDPRESS_GRAPHQL_URL, QUERY, { slug });
    if (!vinilo) {
        console.warn(`⚠️ No se encontró vinilo con slug: ${slug}`);
        return null;
    }

    const imgUrl =
      vinilo.imagenPrincipalUrl ||
      processImageURL(vinilo.imagenPrincipal?.sourceUrl) ||
      '/images/placeholder-vinyl.jpg';

    const alt =
      vinilo.imagenPrincipal?.altText ||
      vinilo.seo?.title ||
      vinilo.title;

    let cleanExcerpt = '';
    if (vinilo.content) {
      cleanExcerpt = vinilo.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      cleanExcerpt = cleanExcerpt.substring(0, 250) + (cleanExcerpt.length > 250 ? '...' : '');
    } else {
      cleanExcerpt = vinilo.seo?.metaDesc || `Detalles sobre el vinilo ${vinilo.title || 'desconocido'}.`;
    }

    return {
      ...vinilo,
      imagenPrincipalUrl: imgUrl,
      imagenPrincipal: { sourceUrl: imgUrl, altText: alt },
      excerpt: cleanExcerpt, 
      camposVinilo: {
        vsPrecio: vinilo.camposVinilo?.vsPrecio || '',
        vsArtista: vinilo.camposVinilo?.vsArtista || '',
        vsAlbum: vinilo.camposVinilo?.vsAlbum || '',
      },
      seo:
        vinilo.seo?.title ? vinilo.seo : {
          title: `${vinilo.title || 'Vinilo'} | VinylStation`,
          metaDesc:
            cleanExcerpt.substring(0, 160) ||
            `Descubre "${vinilo.title || 'este vinilo'}" en VinylStation`,
        },
    };
  } catch (error) {
    console.error(`❌ Error en getViniloBySlug(${slug}):`, error.message);
    if (error.response?.errors) {
        console.error('GraphQL Errors (getViniloBySlug):', JSON.stringify(error.response.errors, null, 2));
    }
    return null;
  }
}


// ===============================
// FUNCIONES PARA PROGRAMA POR SLUG (EXISTENTE, SIN CAMBIOS MAYORES)
// ===============================
export async function getProgramaBySlug(slug) {
  console.log(`📻 Obteniendo programa: ${slug}`);
  const QUERY = gql`
    query GetProgramaBySlug($slug: ID!) {
      programa(id: $slug, idType: SLUG) {
        id
        title
        slug
        date
        content
        # excerpt # Eliminado si no está disponible
        imagenPrincipalUrl(size: "large")
        imagenPrincipal {
          sourceUrl
          altText
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        camposPrograma {
          vsDescripcion
        }
        seo {
          title
          metaDesc
          opengraphTitle
          opengraphDescription
          twitterTitle
          twitterDescription
        }
      }
    }
  `;

  try {
    const { programa } = await request(
      WORDPRESS_GRAPHQL_URL,
      QUERY,
      { slug }
    );
    if (!programa) {
        console.warn(`⚠️ No se encontró programa con slug: ${slug}`);
        return null;
    }

    const imgUrl =
      programa.imagenPrincipalUrl ||
      processImageURL(programa.imagenPrincipal?.sourceUrl) ||
      processImageURL(programa.featuredImage?.node?.sourceUrl) ||
      '/images/placeholder-radio.jpg';

    const alt =
      programa.imagenPrincipal?.altText ||
      programa.featuredImage?.node?.altText ||
      programa.seo?.title ||
      programa.title;
    
    let cleanExcerpt = '';
    if (programa.content) { // Generar excerpt desde content
        cleanExcerpt = programa.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        cleanExcerpt = cleanExcerpt.substring(0, 160) + (cleanExcerpt.length > 160 ? '...' : '');
    } else {
        cleanExcerpt = programa.seo?.metaDesc || `Programa "${programa.title}" - Música en vinilo`;
    }

    return {
      ...programa,
      imagenPrincipalUrl: imgUrl,
      imagenPrincipal: { sourceUrl: imgUrl, altText: alt },
      excerpt: cleanExcerpt,
      camposPrograma: {
        vsDescripcion:
          programa.camposPrograma?.vsDescripcion ||
          cleanExcerpt,
      },
      seo:
        programa.seo?.title ? programa.seo : {
          title: `${programa.title || 'Programa'} | VinylStation`,
          metaDesc:
            cleanExcerpt ||
            `Escucha "${programa.title || 'este programa'}", programa de vinilo`,
        },
    };
  } catch (error) {
    console.error(`❌ Error en getProgramaBySlug(${slug}):`, error.message);
     if (error.response?.errors) {
        console.error('GraphQL Errors (getProgramaBySlug):', JSON.stringify(error.response.errors, null, 2));
    }
    return null;
  }
}


// ===============================
// EMISORA (EXISTENTE, SIN CAMBIOS)
// ===============================
export async function getEmisora() {
  console.log('🎵 Obteniendo información de la emisora (local)');
  return {
    id: 'vinylstation',
    title: 'VinylStation Radio',
    camposEmisora: {
      vsMp3StreamUrl: 'https://stream.zeno.fm/4g7qxnxrloluv',
      vsNombre: 'VinylStation Radio',
      vsDescripcion: 'Tu emisora de radio especializada en música vinilo',
    },
  };
}

// ===============================
// MENÚ DE NAVEGACIÓN (EXISTENTE, AJUSTADO)
// ===============================
export async function getMenuNavegacion(menuSlug = 'primary') {
  console.log(`🧭 Obteniendo menú de navegación: ${menuSlug}`);
  
  const QUERY = gql`
    query GetMenu($id: ID!) { 
      menu(id: $id, idType: NAME) { 
        id
        name
        slug
        menuItems(first: 20, where: {parentId: null}) { # Solo items de nivel superior y ordenados
          nodes {
            id
            label
            url 
            path 
            target
            title 
            cssClasses
            order
          }
        }
      }
    }
  `;

  try {
    const { menu } = await request(WORDPRESS_GRAPHQL_URL, QUERY, { id: menuSlug });
    
    if (!menu || !menu.menuItems?.nodes || menu.menuItems.nodes.length === 0) { 
      console.warn(`⚠️ No se encontró el menú "${menuSlug}" o no tiene items.`);
      return { items: getMenuFallback(), name: menuSlug, source: 'fallback' };
    }
    
    // Ordenar items aquí si la query no lo hace o para doble seguridad
    const sortedItems = [...menu.menuItems.nodes].sort((a,b) => (a.order || 0) - (b.order || 0));

    const items = sortedItems.map(item => ({
        id: item.id,
        label: item.label,
        url: item.path || processMenuUrl(item.url), 
        target: item.target || '_self',
        title: item.title || item.label, 
        cssClasses: item.cssClasses || [] 
      }));

    return { items, name: menu.name || menuSlug, source: 'wordpress' };
  } catch (error) {
    console.error(`❌ Error obteniendo menú "${menuSlug}":`, error.message);
    if (error.response?.errors) {
        console.error('GraphQL Errors (getMenuNavegacion):', JSON.stringify(error.response.errors, null, 2));
    }
    return { items: getMenuFallback(), name: menuSlug, source: 'fallback-error' };
  }
}

function processMenuUrl(url) { // Función helper existente
  if (!url || url === '#') return '/';
  try {
    const parsedUrl = new URL(url);
    const siteUrl = new URL(import.meta.env.SITE || 'http://localhost');
    const wpUrl = new URL(WORDPRESS_GRAPHQL_URL);
    if (parsedUrl.protocol.startsWith('http')) {
      if (parsedUrl.hostname !== siteUrl.hostname && parsedUrl.hostname !== wpUrl.hostname) {
        return url;
      }
      return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
    }
  } catch (e) { /* No es una URL absoluta */ }
  if (url.startsWith('/')) return url;
  return `/${url}`;
}

function getMenuFallback() { // Función helper existente
  console.log('⚠️ Usando menú de fallback.');
  return [
    { id: 'fb-1', label: 'Inicio', url: '/', target: '_self', title: 'Ir a Inicio' },
    { id: 'fb-2', label: 'Vinilos', url: '/vinilos', target: '_self', title: 'Ver Vinilos' },
    { id: 'fb-3', label: 'Programas', url: '/programas', target: '_self', title: 'Ver Programas' },
  ];
}

// ===============================
// NOTICIAS Y CATEGORÍAS (EXISTENTES, AJUSTADAS)
// ===============================
export async function getNoticias({ limit = 20000 } = {}) {
  console.log(`📰 Obteniendo HASTA ${limit} noticias con paginación...`);
  
  const QUERY = gql`
    query GetPaginatedNoticias($first: Int!, $after: String) {
      noticias(first: $first, after: $after, where: {orderby: {field: DATE, order: DESC}}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          slug
          title
          date
          # excerpt # Eliminado si no está disponible
          content # Para generar excerpt manualmente
          featuredImage {
            node {
              sourceUrl(size: MEDIUM) 
              altText
            }
          }
          categoriasNoticia { 
            nodes {
              id
              name
              slug
            }
          }
          seo {
            title
            metaDesc
          }
        }
      }
    }
  `;

  let allNoticias = [];
  let hasNextPage = true;
  let cursor = null;
  const ITEMS_PER_PAGE = 100;
  let pageCount = 1;
    
  try {
    while (hasNextPage && allNoticias.length < limit) {
      const remainingLimit = limit - allNoticias.length;
      const itemsToFetch = Math.min(ITEMS_PER_PAGE, remainingLimit);
      if (itemsToFetch <= 0) break;
      
      console.log(`📄 Petición ${pageCount} (Noticias): Obteniendo hasta ${itemsToFetch}.`);
      const variables = { first: itemsToFetch, after: cursor };
      const data = await request(WORDPRESS_GRAPHQL_URL, QUERY, variables);
      
      const nodes = data?.noticias?.nodes;
      const pageInfo = data?.noticias?.pageInfo;

      if (!Array.isArray(nodes) || !pageInfo) {
        console.warn(`⚠️ getNoticias (p${pageCount}): 'nodes' o 'pageInfo' inválidos. Deteniendo.`);
        break;
      }
      
      allNoticias = allNoticias.concat(nodes);
      hasNextPage = pageInfo.hasNextPage;
      cursor = pageInfo.endCursor;
      
      console.log(`  👍 Noticias p${pageCount}: ${nodes.length} recibidas. hasNextPage: ${hasNextPage}. Total: ${allNoticias.length}`);
      pageCount++;
      
      if (pageCount > 250) {
        console.warn('⚠️ Límite de páginas (250) alcanzado en getNoticias.');
        break;
      }
    }
    
    const noticiasProcessed = allNoticias.map((n) => {
      const imgUrl = processImageURL(n.featuredImage?.node?.sourceUrl) || 
                     '/images/placeholder-news.jpg';
      const alt = n.featuredImage?.node?.altText || n.seo?.title || n.title;
      
      let cleanExcerpt = '';
      if (n.content) {
        cleanExcerpt = n.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        cleanExcerpt = cleanExcerpt.substring(0, 160) + (cleanExcerpt.length > 160 ? '...' : '');
      } else {
        cleanExcerpt = n.seo?.metaDesc || `Lee la noticia "${n.title || 'desconocida'}".`;
      }

      return {
        ...n,
        imagenDestacadaUrl: imgUrl, 
        featuredImage: { node: { sourceUrl: imgUrl, altText: alt } }, 
        excerpt: cleanExcerpt,
        categories: n.categoriasNoticia?.nodes || [], 
        author: null, 
        seo: n.seo?.title ? n.seo : {
          title: `${n.title || 'Noticia'} | VinylStation Noticias`,
          metaDesc: cleanExcerpt
        }
      };
    });
    
    console.log(`✅ TOTAL FINAL (Noticias): ${noticiasProcessed.length} procesadas.`);
    
    return {
      noticias: noticiasProcessed,
      pageInfo: {
        hasNextPage: hasNextPage && allNoticias.length < limit,
        endCursor: cursor,
        total: noticiasProcessed.length
      }
    };
    
  } catch (error) {
    console.error('❌ Error en getNoticias:', error.message);
    if (error.response?.errors) {
      console.error('GraphQL Errors (getNoticias):', JSON.stringify(error.response.errors, null, 2));
    }
    return { noticias: [], pageInfo: { hasNextPage: false, endCursor: null, total: 0 } };
  }
}

export async function getNoticiaBySlug(slug) {
  console.log(`📰 Obteniendo noticia (corregido): ${slug}`);
  
  const QUERY = gql`
    query GetNoticiaBySlug($slug: ID!) {
      noticia(id: $slug, idType: SLUG) {
        id
        title
        slug
        date
        content # Para generar excerpt
        featuredImage {
          node {
            sourceUrl(size: LARGE) 
            altText
          }
        }
        categoriasNoticia {
          nodes {
            id
            name
            slug
          }
        }
        seo {
          title
          metaDesc
          opengraphTitle
          opengraphDescription
          twitterTitle
          twitterDescription
        }
      }
    }
  `;

  try {
    const { noticia } = await request(WORDPRESS_GRAPHQL_URL, QUERY, { slug });
    
    if (!noticia) {
        console.warn(`⚠️ No se encontró noticia con slug: ${slug}`);
        return null;
    }

    const imgUrl = processImageURL(noticia.featuredImage?.node?.sourceUrl) || 
                   '/images/placeholder-news.jpg';
    const alt = noticia.featuredImage?.node?.altText || noticia.seo?.title || noticia.title;
    
    let cleanExcerpt = '';
    if (noticia.content) {
        cleanExcerpt = noticia.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        cleanExcerpt = cleanExcerpt.substring(0, 160) + (cleanExcerpt.length > 160 ? '...' : '');
    } else {
        cleanExcerpt = noticia.seo?.metaDesc || `Lee la noticia "${noticia.title || 'desconocida'}".`;
    }


    return {
      ...noticia,
      imagenDestacadaUrl: imgUrl,
      featuredImage: { node: { sourceUrl: imgUrl, altText: alt } },
      excerpt: cleanExcerpt,
      categories: noticia.categoriasNoticia?.nodes || [],
      author: null, 
      seo: noticia.seo?.title ? noticia.seo : {
        title: `${noticia.title || 'Noticia'} | VinylStation Noticias`,
        metaDesc: cleanExcerpt
      }
    };
    
  } catch (error) {
    console.error(`❌ Error en getNoticiaBySlug(${slug}):`, error.message);
    if (error.response?.errors) {
        console.error('GraphQL Errors (getNoticiaBySlug):', JSON.stringify(error.response.errors, null, 2));
    }
    return null;
  }
}

export async function getCategoriasNoticias() {
  console.log('🏷️ Obteniendo categorías de noticias...');
  
  const QUERY = gql`
    query GetCategoriasNoticias {
      categoriasNoticia(first: 100, where: { hideEmpty: true, orderby: COUNT, order: DESC }) {
        nodes {
          id
          name
          slug
          count
          description
        }
      }
    }
  `;

  try {
    const { categoriasNoticia } = await request(WORDPRESS_GRAPHQL_URL, QUERY);
    
    const nodes = categoriasNoticia?.nodes || [];
    console.log(`✅ Obtenidas ${nodes.length} categorías de noticias.`);
    return { categorias: nodes }; 
    
  } catch (error) {
    console.error('❌ Error en getCategoriasNoticias:', error.message);
    if (error.response?.errors) {
        console.error('GraphQL Errors (getCategoriasNoticias):', JSON.stringify(error.response.errors, null, 2));
    }
    return { categorias: [] };
  }
}


// Exportación por defecto con todas las funciones
export default {
  getSiteLogo,
  getSiteInfo,
  getProgramas,
  getProgramaBySlug,
  getPageData, 
  getEmisora,
  getMenuNavegacion,
  getNoticias,
  getNoticiaBySlug,
  getCategoriasNoticias,
  getVinilos, 
  getViniloBySlug,
  getVinilosPaginados,
  getVinilosPaginadosOptimizado: getVinilosPaginados,
  getArtistasUnicos,
};