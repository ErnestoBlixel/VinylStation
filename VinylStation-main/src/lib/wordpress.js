import { request, gql } from 'graphql-request';
import { 
  getCachedSiteInfo, setCachedSiteInfo,
  getCachedSiteLogo, setCachedSiteLogo,
  getCachedMenu, setCachedMenu,
  getCacheStats
} from './cache.js';

const WORDPRESS_GRAPHQL_URL =
  import.meta.env.PUBLIC_WORDPRESS_GRAPHQL_URL ||
  'https://cms.vinylstation.es/graphql';

console.log('🔗 WordPress API URL:', WORDPRESS_GRAPHQL_URL);

function processImageURL(url) {
  if (!url) return '/images/placeholder-radio.jpg';
  if (/^https?:\/\//.test(url)) return url;
  const wpBase = import.meta.env.PUBLIC_WORDPRESS_API_URL
    ? import.meta.env.PUBLIC_WORDPRESS_API_URL.replace('/wp-json', '')
    : 'https://cms.vinylstation.es';
  return url.startsWith('/') ? `${wpBase}${url}` : url;
}

export async function getSiteLogo() {
  // 🚀 Verificar cache primero
  const cached = getCachedSiteLogo();
  if (cached) {
    console.log('⚡ Logo cargado desde cache');
    return cached;
  }

  console.log('🎯 Obteniendo logo del sitio (primera vez)...');
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
    let result;
    
    if (customLogo?.node?.sourceUrl) {
      result = {
        url: processImageURL(customLogo.node.sourceUrl),
        altText: customLogo.node.altText || 'VinylStation',
        source: 'customLogo',
      };
    } else {
      console.warn('⚠️ customLogo no disponible, usando fallback');
      result = {
        url: '/images/logos/vinyl-station-logo.svg',
        altText: 'VinylStation',
        source: 'fallback',
      };
    }
    
    // 💾 Guardar en cache
    setCachedSiteLogo(result);
    return result;
    
  } catch (error) {
    console.warn('⚠️ Error obteniendo customLogo, usando fallback');
    const fallback = {
      url: '/images/logos/vinyl-station-logo.svg',
      altText: 'VinylStation',
      source: 'fallback',
    };
    setCachedSiteLogo(fallback);
    return fallback;
  }
}

export async function getSiteInfo() {
  // 🚀 Verificar cache primero
  const cached = getCachedSiteInfo();
  if (cached) {
    console.log('⚡ SiteInfo cargado desde cache');
    return cached;
  }

  console.log('🔄 Obteniendo información del sitio (primera vez)...');
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

    let result;
    if (!generalSettings?.title) {
      console.warn('⚠️ No se obtuvo el título desde generalSettings, usando fallback.');
      const logoFallback = await getSiteLogo();
      result = {
        title: 'VinylStation',
        description: 'Tu emisora de vinilo 24/7',
        url: import.meta.env.SITE || 'https://vinylstation.es',
        timezone: 'Europe/Madrid',
        language: 'es-ES',
        logo: logoFallback,
      };
    } else {
      const logo = await getSiteLogo();
      result = {
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
    }
    
    // 💾 Guardar en cache
    setCachedSiteInfo(result);
    return result;
    
  } catch (error) {
    console.error("❌ Error en getSiteInfo:", error.message);
    const logoFallback = await getSiteLogo();
    const fallback = {
      title: 'VinylStation (Error)',
      description: 'Error al cargar la información del sitio.',
      url: import.meta.env.SITE || 'https://vinylstation.es',
      timezone: 'Europe/Madrid',
      language: 'es-ES',
      logo: logoFallback,
    };
    setCachedSiteInfo(fallback);
    return fallback;
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
          imagenPrincipalUrl 
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
            vsFacebook
            vsInstagram
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
          vsFacebook: p.camposPrograma?.vsFacebook || '',
          vsInstagram: p.camposPrograma?.vsInstagram || '',
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
// FUNCIÓN PARA OBTENER PODCASTS
// ===============================
export async function getPodcasts({ limit = 50 } = {}) {
  console.log(`🎙️ Obteniendo ${limit} podcasts...`);
  const QUERY = gql`
    query GetPodcasts($first: Int!) {
      podcasts(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          slug
          title
          date
          content
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          camposPodcast {
            vsSoundcloud
            vsYoutube
            vsFechaEmision
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
    const { podcasts } = await request(
      WORDPRESS_GRAPHQL_URL,
      QUERY,
      { first: limit }
    );

    const nodes = podcasts?.nodes;
    if (!Array.isArray(nodes)) {
      console.warn('⚠️ getPodcasts: respuesta inesperada o sin nodos', podcasts);
      return { podcasts: [], pageInfo: null };
    }

    const podcastsProcesados = nodes.map((p) => {
      const imgUrl =
        processImageURL(p.featuredImage?.node?.sourceUrl) ||
        '/images/placeholder-podcast.jpg';

      const alt =
        p.featuredImage?.node?.altText ||
        p.seo?.title ||
        p.title;
      
      let cleanExcerpt = '';
      if (p.content) {
        cleanExcerpt = p.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        cleanExcerpt = cleanExcerpt.substring(0, 160) + (cleanExcerpt.length > 160 ? '...' : '');
      } else {
        cleanExcerpt = p.seo?.metaDesc || `Podcast "${p.title}" - Programa grabado`;
      }

      // Formatear fecha de emisión
      const fechaEmision = p.camposPodcast?.vsFechaEmision 
        ? new Date(p.camposPodcast.vsFechaEmision).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : new Date(p.date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

      return {
        ...p,
        imagenDestacadaUrl: imgUrl,
        featuredImage: { node: { sourceUrl: imgUrl, altText: alt } },
        excerpt: cleanExcerpt,
        fechaEmisionFormateada: fechaEmision,
        camposPodcast: {
          vsSoundcloud: p.camposPodcast?.vsSoundcloud || '',
          vsYoutube: p.camposPodcast?.vsYoutube || '',
          vsFechaEmision: p.camposPodcast?.vsFechaEmision || p.date,
        },
        seo:
          p.seo?.title ? p.seo : { 
            title: `${p.title} | VinylStation Podcasts`,
            metaDesc: cleanExcerpt,
          },
      };
    });

    console.log(`✅ ${podcastsProcesados.length} podcasts procesados correctamente`);

    return {
      podcasts: podcastsProcesados,
      pageInfo: podcasts.pageInfo,
    };
  } catch (error) {
    console.error('❌ Error en getPodcasts:', error.message);
    if (error.response?.errors) {
        console.error('GraphQL Errors (getPodcasts):', JSON.stringify(error.response.errors, null, 2));
    }
    return { podcasts: [], pageInfo: null };
  }
}

// ===============================
// FUNCION getPageData (CORREGIDA)
// ===============================
export async function getPageData(slug) {
  console.log(`📄 Obteniendo página (corregido v2): ${slug || 'home'}`);
  const slugToId = { inicio: 1, home: 1, programas: 8034, vinilos: 8038, noticias: 8040 }; 
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
        page(id: $slug, idType: URI) {
          ...PageFields
        }
      }
    `;
    vars = { slug: `/${slug}/` }; // Usar formato URI
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
          metaDesc: cleanExcerpt.substring(0,500) || 'Tu emisora de vinilo 24/7',
        },
    };
  } catch (error) {
    console.error(`❌ Error en getPageData(${slug || JSON.stringify(vars)}):`, error.message);
    if (error.response?.errors) {
        console.error('GraphQL Errors (getPageData):', JSON.stringify(error.response.errors, null, 2));
    }
    // Fallbacks específicos por página
    const pageFallbacks = {
      noticias: {
        title: 'Últimas Noticias',
        content: '<p>Mantente al día con las últimas noticias de música, vinilo y cultura musical.</p>',
        excerpt: 'Mantente al día con las últimas noticias de música, vinilo y cultura musical',
        metaDesc: 'Últimas noticias de música, vinilo y cultura musical en VinylStation Radio'
      },
      vinilos: {
        title: 'Vinilos recomendados por VinylStation Radio',
        content: '<p>Descubre nuestra selección cuidada de vinilos clásicos, ediciones limitadas y novedades.</p>',
        excerpt: 'Descubre nuestra selección cuidada de vinilos clásicos, ediciones limitadas y novedades.',
        metaDesc: 'Vinilos clásicos, ediciones limitadas y novedades recomendadas por VinylStation Radio'
      },
      programas: {
        title: 'Programas de Radio',
        content: '<p>Descubre todos nuestros programas de radio especializados en música vinilo.</p>',
        excerpt: 'Descubre todos nuestros programas de radio especializados en música vinilo.',
        metaDesc: 'Programas de radio especializados en música vinilo en VinylStation Radio'
      }
    };
    
    const fallback = pageFallbacks[slug] || {
      title: slug ? (slug.charAt(0).toUpperCase() + slug.slice(1)) : 'VinylStation',
      content: `<p>Contenido de la página ${slug || 'principal'}.</p>`,
      excerpt: `Contenido de la página ${slug || 'principal'}.`,
      metaDesc: `Página ${slug || 'principal'} de VinylStation Radio`
    };
    
    return {
      id: 'fallback-page',
      title: fallback.title,
      content: fallback.content,
      excerpt: fallback.excerpt,
      slug: slug || 'error',
      date: new Date().toISOString(),
      featuredImage: null,
      seo: {
        title: `${fallback.title} | VinylStation`,
        metaDesc: fallback.metaDesc,
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
            vsLinkAmazon
          }
          categoriasVinilo {
            nodes {
              id
              name
              slug
            }
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
          vsLinkAmazon: v.camposVinilo?.vsLinkAmazon || '',
        },
        categoriasVinilo: v.categoriasVinilo || { nodes: [] },
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

// Función específica para cargar TODOS los vinilos para búsqueda
export async function getTodosLosVinilos() {
  console.log('🔍 Cargando TODOS los vinilos para búsqueda global...');
  
  const QUERY_ALL = gql`
    query GetAllVinilos($first: Int!, $after: String) {
      vinilos(first: $first, after: $after, where: {orderby: {field: DATE, order: DESC}}) {
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
            vsLinkAmazon
          }
        }
      }
    }
  `;

  let allVinilos = [];
  let hasNextPage = true;
  let cursor = null;
  const BATCH_SIZE = 100; // Tamaño de cada lote
  let pageCount = 0;
  
  try {
    while (hasNextPage) {
      pageCount++;
      console.log(`📄 Cargando lote ${pageCount} de vinilos...`);
      
      const variables = { 
        first: BATCH_SIZE,
        ...(cursor && { after: cursor })
      };
      
      const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY_ALL, variables);
      const nodes = rawData?.vinilos?.nodes || [];
      const pageInfo = rawData?.vinilos?.pageInfo;
      
      if (nodes.length > 0) {
        allVinilos = allVinilos.concat(nodes);
        console.log(`   ✅ Lote ${pageCount}: ${nodes.length} vinilos cargados (total: ${allVinilos.length})`);
      }
      
      hasNextPage = pageInfo?.hasNextPage || false;
      cursor = pageInfo?.endCursor;
      
      // Límite de seguridad removido para cargar todos los vinilos
      // if (pageCount > 100) {
      //   console.warn('⚠️ Alcanzado límite de seguridad de 100 páginas');
      //   break;
      // }
    }
    
    console.log(`✅ Total de vinilos cargados: ${allVinilos.length}`);
    
    // Procesar todos los vinilos
    const vinilosProcesados = allVinilos.map((v, index) => {
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
          vsLinkAmazon: v.camposVinilo?.vsLinkAmazon || '',
        },
        seo: {
          title: `${v.title || 'Vinilo'} | VinylStation`,
          metaDesc: generatedExcerpt.substring(0, 160),
        },
      };
    });
    
    return {
      vinilos: vinilosProcesados,
      total: vinilosProcesados.length
    };
    
  } catch (error) {
    console.error('❌ Error cargando todos los vinilos:', error.message);
    if (error.response?.errors) {
      console.error('GraphQL Errors:', JSON.stringify(error.response.errors, null, 2));
    }
    return {
      vinilos: [],
      total: 0
    };
  }
}

// ===============================
// SOLUCIÓN DEFINITIVA: CURSOR PAGINATION QUE SIMULA OFFSET
// ===============================
export async function getVinilosPaginados({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`📀 [CURSOR FIX] Página ${page} con ${itemsPerPage} vinilos usando cursor pagination`);
  
  const QUERY_CURSOR = gql`
    query GetVinilosCursorPagination($first: Int!, $after: String) {
      vinilos(first: $first, after: $after, where: {orderby: {field: DATE, order: DESC}}) {
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
            vsLinkAmazon
          }
        }
      }
    }
  `;

  try {
    // CALCULAR CUÁNTOS ELEMENTOS NECESITAMOS CARGAR
    const elementsNeeded = page * itemsPerPage;
    console.log(`📄 [CURSOR] Necesitamos cargar ${elementsNeeded} elementos para página ${page}`);
    
    let allNodes = [];
    let cursor = null;
    let hasMore = true;
    let batchCount = 0;
    const BATCH_SIZE = 100; // Tamaño óptimo por lote
    
    // CARGAR ELEMENTOS HASTA TENER SUFICIENTES PARA LA PÁGINA SOLICITADA
    while (hasMore && allNodes.length < elementsNeeded && batchCount < 200) {
      batchCount++;
      
      // Calcular cuántos elementos cargar en este lote
      const remainingNeeded = elementsNeeded - allNodes.length;
      const currentBatchSize = Math.min(BATCH_SIZE, remainingNeeded + 64); // Buffer de 64
      
      console.log(`   🔄 Lote ${batchCount}: Cargando ${currentBatchSize} elementos (total actual: ${allNodes.length})`);
      
      const variables = { 
        first: currentBatchSize,
        ...(cursor && { after: cursor })
      };
      
      const batchData = await request(WORDPRESS_GRAPHQL_URL, QUERY_CURSOR, variables);
      const batchNodes = batchData?.vinilos?.nodes || [];
      const batchPageInfo = batchData?.vinilos?.pageInfo;
      
      if (batchNodes.length > 0) {
        allNodes = allNodes.concat(batchNodes);
        cursor = batchPageInfo?.endCursor;
        hasMore = batchPageInfo?.hasNextPage || false;
        
        console.log(`   ✅ Lote ${batchCount}: +${batchNodes.length} elementos (total: ${allNodes.length})`);
        
        // Si ya tenemos suficientes elementos, podemos parar
        if (allNodes.length >= elementsNeeded) {
          console.log(`   🎯 Ya tenemos suficientes elementos (${allNodes.length}) para página ${page}`);
          break;
        }
      } else {
        console.log(`   ⚠️ Lote ${batchCount}: Sin más datos disponibles`);
        hasMore = false;
      }
    }
    
    // APLICAR SLICE PARA OBTENER SOLO LOS ELEMENTOS DE ESTA PÁGINA
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    console.log(`🔪 [SLICE] Aplicando slice [${startIndex}:${endIndex}] de ${allNodes.length} elementos totales`);
    
    const pageNodes = allNodes.slice(startIndex, endIndex);
    
    if (pageNodes.length === 0 && page > 1) {
      console.warn(`⚠️ Página ${page} no tiene elementos. Total cargado: ${allNodes.length}`);
      return {
        vinilos: [],
        pageInfo: {
          hasNext: false,
          hasPrevious: page > 1,
          total: allNodes.length,
          totalPages: Math.ceil(allNodes.length / itemsPerPage),
          currentPage: page,
          itemsPerPage,
          totalVinilos: allNodes.length
        }
      };
    }
    
    console.log(`✅ [SUCCESS] Página ${page}: Obtenidos ${pageNodes.length} vinilos`);
    
    if (pageNodes.length > 0) {
      console.log(`📀 [PRIMER VINILO] "${pageNodes[0]?.title}" - ${pageNodes[0]?.camposVinilo?.vsArtista || 'N/A'}`);
      console.log(`📀 [ULTIMO VINILO] "${pageNodes[pageNodes.length-1]?.title}" - ${pageNodes[pageNodes.length-1]?.camposVinilo?.vsArtista || 'N/A'}`);
    }
    
    // PROCESAR LOS VINILOS
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
          vsLinkAmazon: v.camposVinilo?.vsLinkAmazon || '',
        },
        seo: {
          title: `${v.title || 'Vinilo'} | VinylStation`,
          metaDesc: generatedExcerpt.substring(0, 160),
        },
      };
    });
    
    // CALCULAR INFORMACIÓN DE PAGINACIÓN
    const estimatedTotal = hasMore ? Math.max(allNodes.length * 2, 4218) : allNodes.length;
    const totalPages = Math.ceil(estimatedTotal / itemsPerPage);
    const hasNext = hasMore || (startIndex + itemsPerPage < allNodes.length);
    
    return {
      vinilos: vinilosProcesados,
      pageInfo: {
        hasNext,
        hasPrevious: page > 1,
        total: estimatedTotal,
        totalPages,
        currentPage: page,
        itemsPerPage,
        totalVinilos: estimatedTotal
      }
    };
    
  } catch (error) {
    console.error('❌ [CURSOR ERROR] Error en cursor pagination:', error.message);
    if (error.response?.errors) {
      console.error('GraphQL Errors:', JSON.stringify(error.response.errors, null, 2));
    }
    
    // Fallback con datos vacíos pero estructura correcta
    return {
      vinilos: [],
      pageInfo: {
        hasNext: false,
        hasPrevious: page > 1,
        total: 0,
        totalPages: 0,
        currentPage: page,
        itemsPerPage,
        totalVinilos: 0
      }
    };
  }
}

// ===============================
// FUNCIÓN DE FALLBACK CORREGIDA - CURSOR PAGINATION
// ===============================
async function getVinilosPaginadosConCursorCorregido({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`🔄 [CURSOR CORREGIDO] Página ${page}`);
  
  const QUERY_CURSOR = gql`
    query GetVinilosCursorCorregido($first: Int!, $after: String) {
      vinilos(first: $first, after: $after, where: {orderby: {field: DATE, order: DESC}}) {
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
    let allNodes = [];
    let cursor = null;
    let hasMore = true;
    
    const elementsNeeded = page * itemsPerPage;
    console.log(`📄 [CURSOR] Cargando ${elementsNeeded} elementos para página ${page}`);
    
    let batchCount = 0;
    
    while (hasMore && allNodes.length < elementsNeeded && batchCount < 50) {
      batchCount++;
      const batchSize = Math.min(100, elementsNeeded - allNodes.length + 10);
      
      const variables = { 
        first: batchSize,
        ...(cursor && { after: cursor })
      };
      
      const batchData = await request(WORDPRESS_GRAPHQL_URL, QUERY_CURSOR, variables);
      const batchNodes = batchData?.vinilos?.nodes || [];
      const batchPageInfo = batchData?.vinilos?.pageInfo;
      
      if (batchNodes.length > 0) {
        allNodes = allNodes.concat(batchNodes);
        cursor = batchPageInfo?.endCursor;
        hasMore = batchPageInfo?.hasNextPage || false;
        
        console.log(`   ✅ Lote ${batchCount}: +${batchNodes.length} (total: ${allNodes.length})`);
      } else {
        hasMore = false;
      }
    }
    
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageNodes = allNodes.slice(startIndex, endIndex);
    
    console.log(`✅ [CURSOR] Página ${page}: ${pageNodes.length} elementos`);
    
    if (pageNodes.length > 0) {
      console.log(`📀 [CURSOR] Primer vinilo: "${pageNodes[0]?.title}" - ${pageNodes[0]?.camposVinilo?.vsArtista || 'N/A'}`);
    }
    
    return processVinilosPage(pageNodes, allNodes, page, itemsPerPage, { 
      hasNextPage: hasMore, 
      endCursor: cursor 
    });
    
  } catch (error) {
    console.error(`❌ [CURSOR ERROR]:`, error.message);
    return {
      vinilos: [],
      pageInfo: {
        hasNext: false,
        hasPrevious: page > 1,
        total: 0,
        totalPages: 0,
        currentPage: page,
        itemsPerPage
      }
    };
  }
}

// Función fallback usando cursor pagination para simular offset (DEPRECADA)
async function getVinilosPaginadosConCursor({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`🔄 [CURSOR FALLBACK] Simulando offset con cursor para página ${page}`);
  
  const QUERY_CURSOR = gql`
    query GetVinilosCursor($first: Int!, $after: String) {
      vinilos(first: $first, after: $after, where: {orderby: {field: DATE, order: DESC}}) {
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
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // ESTRATEGIA MEJORADA: Carga inteligente según la página
    let allNodes = [];
    let cursor = null;
    let hasMore = true;
    const BATCH_SIZE = 200; // Tamaño de cada lote
    
    // Para páginas bajas (1-10), carga directa
    if (page <= 10) {
      const itemsToLoad = page * itemsPerPage + 40; // Buffer extra para evitar edge cases
      console.log(`📄 [CURSOR] Página ${page} (baja): Carga directa de ${itemsToLoad} items`);
      
      const variables = { first: itemsToLoad };
      const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY_CURSOR, variables);
      allNodes = rawData?.vinilos?.nodes || [];
      
    } else {
      // Para páginas altas, carga por bloques para evitar timeouts
      console.log(`📄 [CURSOR] Página ${page} (alta): Carga por bloques hasta índice ${endIndex}`);
      
      let loadedCount = 0;
      let attempts = 0;
      const maxAttempts = Math.ceil(endIndex / BATCH_SIZE) + 1;
      
      while (hasMore && loadedCount < endIndex && attempts < maxAttempts) {
        attempts++;
        console.log(`   🔄 Bloque ${attempts}: Cargando ${BATCH_SIZE} items (cursor: ${cursor ? 'sí' : 'no'})`);
        
        const variables = { 
          first: BATCH_SIZE,
          ...(cursor && { after: cursor })
        };
        
        try {
          const batchData = await request(WORDPRESS_GRAPHQL_URL, QUERY_CURSOR, variables);
          const batchNodes = batchData?.vinilos?.nodes || [];
          const batchPageInfo = batchData?.vinilos?.pageInfo;
          
          if (batchNodes.length > 0) {
            allNodes = allNodes.concat(batchNodes);
            loadedCount = allNodes.length;
            cursor = batchPageInfo?.endCursor;
            hasMore = batchPageInfo?.hasNextPage || false;
            
            console.log(`   ✅ Bloque ${attempts}: ${batchNodes.length} items cargados (total: ${loadedCount})`);
            
            // Si ya tenemos suficientes para esta página, parar
            if (loadedCount >= endIndex) {
              console.log(`   🎯 Suficientes items cargados para página ${page}`);
              break;
            }
          } else {
            console.log(`   ⚠️ Bloque ${attempts}: Sin datos, deteniendo carga`);
            hasMore = false;
          }
        } catch (batchError) {
          console.error(`   ❌ Error en bloque ${attempts}:`, batchError.message);
          hasMore = false;
        }
      }
      
      console.log(`📊 [CURSOR] Carga completa: ${allNodes.length} items totales para página ${page}`);
    }
    
    const pageInfo = { hasNextPage: hasMore, endCursor: cursor };

    if (!Array.isArray(allNodes) || allNodes.length === 0) {
      console.warn('⚠️ [CURSOR] No se obtuvieron vinilos');
      return {
        vinilos: [],
        pageInfo: {
          hasNext: false,
          hasPrevious: page > 1,
          total: 0,
          totalPages: 0,
          currentPage: page,
          itemsPerPage
        }
      };
    }
    
    // Realizar el slice para obtener solo los elementos de esta página
    const pageNodes = allNodes.slice(startIndex, endIndex);
    
    console.log(`🔍 [DEBUG SLICE] Página ${page}:`);
    console.log(`   - Total cargados: ${allNodes.length}`);
    console.log(`   - Slice: [${startIndex}:${endIndex}] = ${pageNodes.length} items`);
    console.log(`   - Primer vinilo: ${pageNodes[0]?.title || 'N/A'} (${pageNodes[0]?.camposVinilo?.vsArtista || 'N/A'})`);
    console.log(`   - Último vinilo: ${pageNodes[pageNodes.length-1]?.title || 'N/A'} (${pageNodes[pageNodes.length-1]?.camposVinilo?.vsArtista || 'N/A'})`);
    
    if (pageNodes.length === 0 && allNodes.length > 0) {
      console.warn(`⚠️ [CURSOR] Slice vacío. Posible problema con la paginación.`);
      console.warn(`   - Página solicitada: ${page}`);
      console.warn(`   - Items necesarios: ${endIndex}`);
      console.warn(`   - Items cargados: ${allNodes.length}`);
      
      // Devolver página vacía pero con información correcta
      return {
        vinilos: [],
        pageInfo: {
          hasNext: false,
          hasPrevious: page > 1,
          total: 4218,
          totalPages: Math.ceil(4218 / itemsPerPage),
          currentPage: page,
          itemsPerPage
        }
      };
    }
    
    console.log(`✅ [CURSOR] Página ${page}: extraídos ${pageNodes.length} vinilos correctamente`);
    
    return processVinilosPage(pageNodes, allNodes, page, itemsPerPage, pageInfo);
    
  } catch (error) {
    console.error('❌ [CURSOR ERROR] Error en fallback cursor:', error.message);
    if (error.response?.errors) {
      console.error('GraphQL Errors (cursor):', JSON.stringify(error.response.errors, null, 2));
    }
    
    // Último fallback: devolver datos vacíos pero con estructura correcta
    return {
      vinilos: [],
      pageInfo: {
        hasNext: false,
        hasPrevious: page > 1,
        total: 4218, // Usar el total conocido
        totalPages: Math.ceil(4218 / itemsPerPage),
        currentPage: page,
        itemsPerPage
      }
    };
  }
}

// Función helper para procesar la página de vinilos (evitar duplicación de código)
function processVinilosPage(pageNodes, allNodes, page, itemsPerPage, pageInfo) {
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
        metaDesc: generatedExcerpt.substring(0, 160),
      },
    };
  });
  
  // Estimar total y páginas
  const estimatedTotal = pageInfo?.hasNextPage ? 4218 : allNodes.length;
  const totalPages = Math.ceil(estimatedTotal / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const hasNext = pageNodes.length === itemsPerPage && (pageInfo?.hasNextPage || startIndex + itemsPerPage < allNodes.length);
  
  return {
    vinilos: vinilosProcesados,
    pageInfo: {
      hasNext,
      hasPrevious: page > 1,
      total: estimatedTotal,
      totalPages,
      currentPage: page,
      itemsPerPage
    }
  };
}

// Función legacy - mantenida para compatibilidad pero ya no se usa
// TODO: Remover en futuras versiones una vez confirmado que offset pagination funciona
async function getVinilosPaginadosLegacy({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`⚠️ Usando método legacy (no recomendado) para página ${page}`);
  // Esta función ya no se usa pero se mantiene como fallback temporal
  return getVinilosPaginados({ page, itemsPerPage });
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

// Función de fallback solo para casos extremos donde offset pagination falle
async function getVinilosPaginadosFallback({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`🚨 FALLBACK EXTREMO: usando cursor para página ${page} (solo si offset pagination falló)`);
  
  const QUERY = gql`
    query GetVinilosFallback($first: Int!) {
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
    // Solo cargar lo mínimo necesario en caso de emergencia
    const itemsToLoad = Math.min(page * itemsPerPage, 200); // Límite de emergencia
    const variables = { first: itemsToLoad };
    
    console.log(`🚨 Fallback de emergencia: cargando máximo ${itemsToLoad} items`);
    const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY, variables);
    
    const allNodes = rawData?.vinilos?.nodes || [];
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageNodes = allNodes.slice(startIndex, endIndex);
    
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
          metaDesc: generatedExcerpt.substring(0, 160),
        },
      };
    });
    
    return {
      vinilos: vinilosProcesados,
      pageInfo: {
        hasNext: pageNodes.length === itemsPerPage && allNodes.length === itemsToLoad,
        hasPrevious: page > 1,
        total: Math.max(allNodes.length, 4218), // Estimación conservadora
        totalPages: Math.ceil(4218 / itemsPerPage),
        currentPage: page,
        itemsPerPage
      }
    };
    
  } catch (error) {
    console.error('❌ Error en fallback de emergencia:', error.message);
    return {
      vinilos: [],
      pageInfo: {
        hasNext: false,
        hasPrevious: page > 1,
        total: 0,
        totalPages: 0,
        currentPage: page,
        itemsPerPage
      }
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
          vsLinkAmazon
        }
        categoriasVinilo {
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
        vsLinkAmazon: vinilo.camposVinilo?.vsLinkAmazon || '',
      },
      categoriasVinilo: vinilo.categoriasVinilo || { nodes: [] },
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
// FUNCIÓN PARA OBTENER PODCAST POR SLUG
// ===============================
export async function getPodcastBySlug(slug) {
  console.log(`🎙️ Obteniendo podcast: ${slug}`);
  const QUERY = gql`
    query GetPodcastBySlug($slug: ID!) {
      podcast(id: $slug, idType: SLUG) {
        id
        title
        slug
        date
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        camposPodcast {
          vsSoundcloud
          vsYoutube
          vsFechaEmision
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
    const { podcast } = await request(
      WORDPRESS_GRAPHQL_URL,
      QUERY,
      { slug }
    );
    if (!podcast) {
        console.warn(`⚠️ No se encontró podcast con slug: ${slug}`);
        return null;
    }

    const imgUrl =
      processImageURL(podcast.featuredImage?.node?.sourceUrl) ||
      '/images/placeholder-podcast.jpg';

    const alt =
      podcast.featuredImage?.node?.altText ||
      podcast.seo?.title ||
      podcast.title;
    
    let cleanExcerpt = '';
    if (podcast.content) {
        cleanExcerpt = podcast.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        cleanExcerpt = cleanExcerpt.substring(0, 160) + (cleanExcerpt.length > 160 ? '...' : '');
    } else {
        cleanExcerpt = podcast.seo?.metaDesc || `Podcast "${podcast.title}" - Programa grabado`;
    }

    // Formatear fecha de emisión
    const fechaEmision = podcast.camposPodcast?.vsFechaEmision 
      ? new Date(podcast.camposPodcast.vsFechaEmision).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : new Date(podcast.date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

    return {
      ...podcast,
      imagenDestacadaUrl: imgUrl,
      featuredImage: { node: { sourceUrl: imgUrl, altText: alt } },
      excerpt: cleanExcerpt,
      fechaEmisionFormateada: fechaEmision,
      camposPodcast: {
        vsSoundcloud: podcast.camposPodcast?.vsSoundcloud || '',
        vsYoutube: podcast.camposPodcast?.vsYoutube || '',
        vsFechaEmision: podcast.camposPodcast?.vsFechaEmision || podcast.date,
      },
      seo:
        podcast.seo?.title ? podcast.seo : {
          title: `${podcast.title || 'Podcast'} | VinylStation`,
          metaDesc:
            cleanExcerpt ||
            `Escucha "${podcast.title || 'este podcast'}" en VinylStation`,
        },
    };
  } catch (error) {
    console.error(`❌ Error en getPodcastBySlug(${slug}):`, error.message);
     if (error.response?.errors) {
        console.error('GraphQL Errors (getPodcastBySlug):', JSON.stringify(error.response.errors, null, 2));
    }
    return null;
  }
}

// ===============================
// FUNCIONES PARA EQUIPO
// ===============================
export async function getEquipo({ limit = 50 } = {}) {
  console.log(`👥 Obteniendo ${limit} miembros del equipo...`);
  const QUERY = gql`
    query GetEquipo($first: Int!) {
      miembrosEquipo(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          slug
          title
          date
          content
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          camposEquipo {
            vsFacebook
            vsInstagram
            vsWhatsapp
            vsTiktok
            vsYoutube
            vsSoundcloud
            vsPaginaWeb
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
    const { miembrosEquipo } = await request(
      WORDPRESS_GRAPHQL_URL,
      QUERY,
      { first: limit }
    );

    const nodes = miembrosEquipo?.nodes;
    if (!Array.isArray(nodes)) {
      console.warn('⚠️ getEquipo: respuesta inesperada o sin nodos', miembrosEquipo);
      return { equipo: [], pageInfo: null };
    }

    const equipoProcesado = nodes.map((e) => {
      const imgUrl =
        processImageURL(e.featuredImage?.node?.sourceUrl) ||
        '/images/placeholder-team.jpg';

      const alt =
        e.featuredImage?.node?.altText ||
        e.seo?.title ||
        e.title;
      
      let cleanExcerpt = '';
      if (e.content) {
        cleanExcerpt = e.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        cleanExcerpt = cleanExcerpt.substring(0, 160) + (cleanExcerpt.length > 160 ? '...' : '');
      } else {
        cleanExcerpt = e.seo?.metaDesc || `Miembro del equipo "${e.title}"`;
      }

      return {
        ...e,
        imagenDestacadaUrl: imgUrl,
        featuredImage: { node: { sourceUrl: imgUrl, altText: alt } },
        excerpt: cleanExcerpt,
        camposEquipo: {
          vsFacebook: e.camposEquipo?.vsFacebook || '',
          vsInstagram: e.camposEquipo?.vsInstagram || '',
          vsWhatsapp: e.camposEquipo?.vsWhatsapp || '',
          vsTiktok: e.camposEquipo?.vsTiktok || '',
          vsYoutube: e.camposEquipo?.vsYoutube || '',
          vsSoundcloud: e.camposEquipo?.vsSoundcloud || '',
          vsPaginaWeb: e.camposEquipo?.vsPaginaWeb || '',
        },
        seo:
          e.seo?.title ? e.seo : { 
            title: `${e.title} | VinylStation Equipo`,
            metaDesc: cleanExcerpt,
          },
      };
    });

    console.log(`✅ ${equipoProcesado.length} miembros del equipo procesados correctamente`);

    return {
      equipo: equipoProcesado,
      pageInfo: miembrosEquipo.pageInfo,
    };
  } catch (error) {
    console.error('❌ Error en getEquipo:', error.message);
    if (error.response?.errors) {
        console.error('GraphQL Errors (getEquipo):', JSON.stringify(error.response.errors, null, 2));
    }
    return { equipo: [], pageInfo: null };
  }
}

export async function getEquipoBySlug(slug) {
  console.log(`👤 Obteniendo miembro del equipo: ${slug}`);
  const QUERY = gql`
    query GetEquipoBySlug($slug: ID!) {
      miembroEquipo(id: $slug, idType: SLUG) {
        id
        title
        slug
        date
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        camposEquipo {
          vsFacebook
          vsInstagram
          vsWhatsapp
          vsTiktok
          vsYoutube
          vsSoundcloud
          vsPaginaWeb
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
    const { miembroEquipo } = await request(
      WORDPRESS_GRAPHQL_URL,
      QUERY,
      { slug }
    );
    if (!miembroEquipo) {
        console.warn(`⚠️ No se encontró miembro del equipo con slug: ${slug}`);
        return null;
    }

    const imgUrl =
      processImageURL(miembroEquipo.featuredImage?.node?.sourceUrl) ||
      '/images/placeholder-team.jpg';

    const alt =
      miembroEquipo.featuredImage?.node?.altText ||
      miembroEquipo.seo?.title ||
      miembroEquipo.title;
    
    let cleanExcerpt = '';
    if (miembroEquipo.content) {
        cleanExcerpt = miembroEquipo.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        cleanExcerpt = cleanExcerpt.substring(0, 160) + (cleanExcerpt.length > 160 ? '...' : '');
    } else {
        cleanExcerpt = miembroEquipo.seo?.metaDesc || `Miembro del equipo "${miembroEquipo.title}"`;
    }

    return {
      ...miembroEquipo,
      imagenDestacadaUrl: imgUrl,
      featuredImage: { node: { sourceUrl: imgUrl, altText: alt } },
      excerpt: cleanExcerpt,
      camposEquipo: {
        vsFacebook: miembroEquipo.camposEquipo?.vsFacebook || '',
        vsInstagram: miembroEquipo.camposEquipo?.vsInstagram || '',
        vsWhatsapp: miembroEquipo.camposEquipo?.vsWhatsapp || '',
        vsTiktok: miembroEquipo.camposEquipo?.vsTiktok || '',
        vsYoutube: miembroEquipo.camposEquipo?.vsYoutube || '',
        vsSoundcloud: miembroEquipo.camposEquipo?.vsSoundcloud || '',
        vsPaginaWeb: miembroEquipo.camposEquipo?.vsPaginaWeb || '',
      },
      seo:
        miembroEquipo.seo?.title ? miembroEquipo.seo : {
          title: `${miembroEquipo.title} | VinylStation`,
          metaDesc:
            cleanExcerpt ||
            `Conoce a ${miembroEquipo.title}, parte del equipo de VinylStation`,
        },
    };
  } catch (error) {
    console.error(`❌ Error en getEquipoBySlug(${slug}):`, error.message);
     if (error.response?.errors) {
        console.error('GraphQL Errors (getEquipoBySlug):', JSON.stringify(error.response.errors, null, 2));
    }
    return null;
  }
}

// ===============================
// FUNCIONES PARA PROGRAMA POR SLUG
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
          vsFacebook
          vsInstagram
          vsWhatsapp
          vsTiktok
          vsYoutube
          vsSoundcloud
          vsEquipo {
            nodes {
              id
              title
              slug
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
              camposEquipo {
                vsFacebook
                vsInstagram
                vsWhatsapp
                vsTiktok
                vsYoutube
                vsSoundcloud
                vsPaginaWeb
              }
            }
          }
          vsPodcasts {
            nodes {
              id
              title
              slug
              date
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
              camposPodcast {
                vsSoundcloud
                vsYoutube
                vsFechaEmision
              }
            }
          }
          vsPatrocinadores {
            nodes {
              id
              title
              slug
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
            }
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
        vsFacebook: programa.camposPrograma?.vsFacebook || '',
        vsInstagram: programa.camposPrograma?.vsInstagram || '',
        vsWhatsapp: programa.camposPrograma?.vsWhatsapp || '',
        vsTiktok: programa.camposPrograma?.vsTiktok || '',
        vsYoutube: programa.camposPrograma?.vsYoutube || '',
        vsSoundcloud: programa.camposPrograma?.vsSoundcloud || '',
        vsEquipo: programa.camposPrograma?.vsEquipo || { nodes: [] },
        vsPodcasts: programa.camposPrograma?.vsPodcasts || { nodes: [] },
        vsPatrocinadores: programa.camposPrograma?.vsPatrocinadores || { nodes: [] },
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
// EMISORA - OBTIENE DATOS REALES DE WORDPRESS
// ===============================
export async function getEmisora() {
  console.log('🎵 Obteniendo información de la emisora desde WordPress...');
  
  const QUERY = gql`
    query ObtenerPrimeraEmisora {
      emisoras(first: 1) {
        nodes {
          id
          databaseId
          title
          slug
          camposEmisora {
            vsProtocolo
            vsUrlStream
            vsPuerto
            vsFormato
            vsUrlCompleta
          }
        }
      }
    }
  `;

  try {
    const { emisoras } = await request(WORDPRESS_GRAPHQL_URL, QUERY);
    
    const emisora = emisoras?.nodes?.[0];
    
    if (!emisora) {
      console.warn('⚠️ No se encontró ninguna emisora en WordPress, usando fallback');
      return getFallbackEmisora();
    }

    console.log(`✅ Emisora obtenida: ${emisora.title}`);
    
    // Construir URL del stream desde los campos
    const streamUrl = emisora.camposEmisora?.vsUrlCompleta || 
                     `${emisora.camposEmisora?.vsProtocolo || 'https'}://${emisora.camposEmisora?.vsUrlStream || 'stream.zeno.fm/4g7qxnxrloluv'}${emisora.camposEmisora?.vsPuerto ? ':' + emisora.camposEmisora.vsPuerto : ''}`;
    
    return {
      id: emisora.slug || emisora.databaseId?.toString() || 'vinylstation',
      databaseId: emisora.databaseId,
      title: emisora.title || 'VinylStation Radio',
      slug: emisora.slug,
      camposEmisora: {
        // Mantener compatibilidad con el código existente
        vsMp3StreamUrl: streamUrl,
        // Campos originales de ACF
        vsProtocolo: emisora.camposEmisora?.vsProtocolo || 'https',
        vsUrlStream: emisora.camposEmisora?.vsUrlStream || 'stream.zeno.fm/4g7qxnxrloluv',
        vsPuerto: emisora.camposEmisora?.vsPuerto || '',
        vsFormato: emisora.camposEmisora?.vsFormato || 'MP3',
        vsUrlCompleta: streamUrl,
        // Datos adicionales para compatibilidad
        vsNombre: emisora.title || 'VinylStation Radio',
        vsDescripcion: `Emisora de radio ${emisora.title || 'VinylStation'}`,
      },
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo emisora desde WordPress:', error.message);
    if (error.response?.errors) {
      console.error('GraphQL Errors (getEmisora):', JSON.stringify(error.response.errors, null, 2));
    }
    return getFallbackEmisora();
  }
}

// Función helper para fallback de emisora
function getFallbackEmisora() {
  console.log('⚠️ Usando datos de emisora por defecto (fallback)');
  return {
    id: 'vinylstation',
    title: 'VinylStation Radio',
    camposEmisora: {
      vsMp3StreamUrl: 'https://stream.zeno.fm/4g7qxnxrloluv',
      vsProtocolo: 'https',
      vsUrlStream: 'stream.zeno.fm/4g7qxnxrloluv',
      vsPuerto: '',
      vsFormato: 'MP3',
      vsUrlCompleta: 'https://stream.zeno.fm/4g7qxnxrloluv',
      vsNombre: 'VinylStation Radio',
      vsDescripcion: 'Tu emisora de radio especializada en música vinilo',
    },
  };
}

// ===============================
// MENÚ DE NAVEGACIÓN (EXISTENTE, AJUSTADO)
// ===============================
export async function getMenuNavegacion(menuSlug = 'Menu') {
  // 🚀 Verificar cache primero
  const cached = getCachedMenu();
  if (cached) {
    console.log('⚡ Menú cargado desde cache');
    return cached;
  }

  console.log(`🧭 Obteniendo menú de navegación (primera vez): ${menuSlug}`);
  
  const QUERY = gql`
    query GetMenu($id: ID!) { 
      menu(id: $id, idType: NAME) { 
        id
        name
        slug
        menuItems(first: 20, where: {parentId: null}) {
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
    
    let result;
    if (!menu || !menu.menuItems?.nodes || menu.menuItems.nodes.length === 0) { 
      console.warn(`⚠️ No se encontró el menú "${menuSlug}" o no tiene items.`);
      result = { items: getMenuFallback(), name: menuSlug, source: 'fallback' };
    } else {
      const sortedItems = [...menu.menuItems.nodes].sort((a,b) => (a.order || 0) - (b.order || 0));
      const items = sortedItems.map(item => ({
          id: item.id,
          label: item.label,
          url: item.path || processMenuUrl(item.url), 
          target: item.target || '_self',
          title: item.title || item.label, 
          cssClasses: item.cssClasses || [] 
        }));

      result = { items, name: menu.name || menuSlug, source: 'wordpress' };
    }
    
    // 💾 Guardar en cache
    setCachedMenu(result);
    console.log(`✅ Menú cargado dinámicamente: ${result.items.length} elementos`);
    return result;
    
  } catch (error) {
    console.error(`❌ Error obteniendo menú "${menuSlug}":`, error.message);
    if (error.response?.errors) {
        console.error('GraphQL Errors (getMenuNavegacion):', JSON.stringify(error.response.errors, null, 2));
    }
    const fallback = { items: getMenuFallback(), name: menuSlug, source: 'fallback-error' };
    setCachedMenu(fallback);
    return fallback;
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
// Nueva función para obtener noticias paginadas
export async function getNoticiasPaginadas({ page = 1, itemsPerPage = 12, categoria = null } = {}) {
  console.log(`📰 Obteniendo página ${page} con ${itemsPerPage} noticias${categoria ? ` (categoría: ${categoria})` : ''}...`);
  
  // Obtener más noticias de las necesarias para poder filtrar y paginar
  const itemsToLoad = Math.max(100, page * itemsPerPage * 3); // Cargar suficientes para filtrar
  
  const QUERY = gql`
    query GetAllNoticiasPaginated($first: Int!) {
      noticias(
        first: $first
        where: {
          orderby: { field: DATE, order: DESC }
        }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          slug
          title
          date
          content
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

  try {
    console.log(`📄 [SIMPLE] Página ${page}: Cargando ${itemsToLoad} noticias...`);
    
    const variables = { first: itemsToLoad };
    
    const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY, variables);
    
    let allNodes = rawData?.noticias?.nodes || [];
    const pageInfo = rawData?.noticias?.pageInfo;
    
    console.log(`✅ Obtenidas ${allNodes.length} noticias totales`);
    
    if (!Array.isArray(allNodes) || allNodes.length === 0) {
      console.warn('⚠️ No se obtuvieron noticias');
      return {
        noticias: [],
        pageInfo: {
          hasNext: false,
          hasPrevious: page > 1,
          total: 0,
          totalNoticias: 0,
          totalPages: 0,
          currentPage: page,
          itemsPerPage
        }
      };
    }
    
    // FILTRAR POR CATEGORÍA si se especifica una
    if (categoria && categoria !== 'all') {
      allNodes = allNodes.filter(noticia => {
        const categoriasNoticia = noticia.categoriasNoticia?.nodes || [];
        return categoriasNoticia.some(cat => cat.slug === categoria);
      });
      console.log(`🔍 Después del filtro por categoría '${categoria}': ${allNodes.length} noticias`);
    }
    
    // Calcular índices para paginación
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // Realizar el slice para obtener solo los elementos de esta página
    const pageNodes = allNodes.slice(startIndex, endIndex);
    
    console.log(`🔍 Página ${page}: mostrando ${pageNodes.length} noticias [${startIndex}:${endIndex}]`);
    
    const noticiasProcesadas = pageNodes.map((n) => {
      const imgUrl = processImageURL(n.featuredImage?.node?.sourceUrl) || '/images/placeholder-news.jpg';
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
        categorias: n.categoriasNoticia,
        // author: null, // Campo no disponible en el tipo Noticia
        seo: n.seo?.title ? n.seo : {
          title: `${n.title || 'Noticia'} | VinylStation Noticias`,
          metaDesc: cleanExcerpt
        }
      };
    });
    
    // Detectar si hay más páginas basado en el array filtrado
    const totalFiltered = allNodes.length;
    const hasMoreItems = totalFiltered > endIndex;
    
    // Para obtener más datos si es necesario
    let needMoreData = false;
    if (categoria && categoria !== 'all' && totalFiltered <= endIndex && pageInfo?.hasNextPage) {
      needMoreData = true;
      console.log('🔄 Puede que necesitemos más datos para esta categoría...');
    }
    
    const totalPages = Math.ceil(totalFiltered / itemsPerPage);
    
    return {
      noticias: noticiasProcesadas,
      pageInfo: {
        hasNext: hasMoreItems || (needMoreData && pageInfo?.hasNextPage),
        hasPrevious: page > 1,
        total: totalFiltered,
        totalNoticias: totalFiltered,
        totalPages,
        currentPage: page,
        itemsPerPage
      }
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo noticias:', error.message);
    if (error.response?.errors) {
      console.error('GraphQL Errors:', JSON.stringify(error.response.errors, null, 2));
    }
    
    return {
      noticias: [],
      pageInfo: {
        hasNext: false,
        hasPrevious: page > 1,
        total: 0,
        totalNoticias: 0,
        totalPages: 0,
        currentPage: page,
        itemsPerPage
      }
    };
  }
}

// Función fallback usando cursor pagination para noticias
async function getNoticiasPaginadasConCursor({ page = 1, itemsPerPage = 12, categoria = null } = {}) {
  console.log(`🔄 [CURSOR FALLBACK] Simulando offset con cursor para página ${page} de noticias`);
  
  const whereClause = categoria
    ? `where: {orderby: {field: DATE, order: DESC}, categoryName: "${categoria}"}`
    : `where: {orderby: {field: DATE, order: DESC}}`;
  
  const QUERY_CURSOR = gql`
    query GetNoticiasCursor($first: Int!, $after: String) {
      noticias(first: $first, after: $after, ${whereClause}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          slug
          title
          date
          content
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

  try {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // Cargar suficientes noticias para cubrir la página solicitada
    const itemsToLoad = Math.min(page * itemsPerPage + 50, 500); // Máximo 500 para evitar timeouts
    
    console.log(`📄 [CURSOR] Página ${page}: Carga directa de ${itemsToLoad} items`);
    
    const variables = { first: itemsToLoad };
    const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY_CURSOR, variables);
    
    const allNodes = rawData?.noticias?.nodes || [];
    const pageInfo = rawData?.noticias?.pageInfo;
    
    if (!Array.isArray(allNodes) || allNodes.length === 0) {
      console.warn('⚠️ [CURSOR] No se obtuvieron noticias');
      return {
        noticias: [],
        pageInfo: {
          hasNext: false,
          hasPrevious: page > 1,
          total: 0,
          totalNoticias: 0,
          totalPages: 0,
          currentPage: page,
          itemsPerPage
        }
      };
    }
    
    // Realizar el slice para obtener solo los elementos de esta página
    const pageNodes = allNodes.slice(startIndex, endIndex);
    
    console.log(`🔍 [DEBUG SLICE] Página ${page} de noticias:`);
    console.log(`   - Total cargadas: ${allNodes.length}`);
    console.log(`   - Slice: [${startIndex}:${endIndex}] = ${pageNodes.length} items`);
    
    const noticiasProcesadas = pageNodes.map((n) => {
      const imgUrl = processImageURL(n.featuredImage?.node?.sourceUrl) || '/images/placeholder-news.jpg';
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
        categorias: n.categoriasNoticia,
        // author: null, // Campo no disponible en el tipo Noticia
        seo: n.seo?.title ? n.seo : {
          title: `${n.title || 'Noticia'} | VinylStation Noticias`,
          metaDesc: cleanExcerpt
        }
      };
    });
    
    // Estimar total y páginas
    const estimatedTotal = pageInfo?.hasNextPage ? 500 : allNodes.length; // Estimación conservadora
    const totalPages = Math.ceil(estimatedTotal / itemsPerPage);
    const hasNext = pageNodes.length === itemsPerPage && (pageInfo?.hasNextPage || startIndex + itemsPerPage < allNodes.length);
    
    return {
      noticias: noticiasProcesadas,
      pageInfo: {
        hasNext,
        hasPrevious: page > 1,
        total: estimatedTotal,
        totalNoticias: estimatedTotal,
        totalPages,
        currentPage: page,
        itemsPerPage
      }
    };
    
  } catch (error) {
    console.error('❌ [CURSOR ERROR] Error en fallback cursor:', error.message);
    if (error.response?.errors) {
      console.error('GraphQL Errors (cursor):', JSON.stringify(error.response.errors, null, 2));
    }
    
    return {
      noticias: [],
      pageInfo: {
        hasNext: false,
        hasPrevious: page > 1,
        total: 0,
        totalNoticias: 0,
        totalPages: 0,
        currentPage: page,
        itemsPerPage
      }
    };
  }
}

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
        // author: null, // Campo no disponible en el tipo Noticia 
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
      // author: null, // Campo no disponible en el tipo Noticia 
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


// ===============================
// FUNCIÓN getTodosLasNoticias (NUEVA)
// ===============================
export async function getTodosLasNoticias() {
  console.log('🔍 Cargando TODAS las noticias para paginación estática...');
  
  const QUERY_ALL = gql`
    query GetAllNoticias($first: Int!, $after: String) {
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
          content
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
  const BATCH_SIZE = 100; // Tamaño de cada lote
  let pageCount = 0;
  
  try {
    while (hasNextPage) {
      pageCount++;
      console.log(`📄 Cargando lote ${pageCount} de noticias...`);
      
      const variables = { 
        first: BATCH_SIZE,
        ...(cursor && { after: cursor })
      };
      
      const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY_ALL, variables);
      const nodes = rawData?.noticias?.nodes || [];
      const pageInfo = rawData?.noticias?.pageInfo;
      
      if (nodes.length > 0) {
        allNoticias = allNoticias.concat(nodes);
        console.log(`   ✅ Lote ${pageCount}: ${nodes.length} noticias cargadas (total: ${allNoticias.length})`);
      }
      
      hasNextPage = pageInfo?.hasNextPage || false;
      cursor = pageInfo?.endCursor;
      
      // Límite de seguridad removido para cargar todas las noticias
      // if (pageCount > 100) {
      //   console.warn('⚠️ Alcanzado límite de seguridad de 100 páginas');
      //   break;
      // }
    }
    
    console.log(`✅ Total de noticias cargadas: ${allNoticias.length}`);
    
    // Procesar todas las noticias
    const noticiasProcesadas = allNoticias.map((n, index) => {
      const imgUrl = processImageURL(n.featuredImage?.node?.sourceUrl) || '/images/placeholder-news.jpg';
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
        categorias: n.categoriasNoticia,
        seo: n.seo?.title ? n.seo : {
          title: `${n.title || 'Noticia'} | VinylStation Noticias`,
          metaDesc: cleanExcerpt
        }
      };
    });
    
    return {
      noticias: noticiasProcesadas,
      total: noticiasProcesadas.length
    };
    
  } catch (error) {
    console.error('❌ Error cargando todas las noticias:', error.message);
    if (error.response?.errors) {
      console.error('GraphQL Errors:', JSON.stringify(error.response.errors, null, 2));
    }
    return {
      noticias: [],
      total: 0
    };
  }
}

// ===============================
// FUNCIÓN DE STATS PARA DEBUG
// ===============================
export function logCacheStats() {
  const stats = getCacheStats();
  console.log('📊 Cache Stats:', stats);
  return stats;
}

// Exportación por defecto con todas las funciones
export default {
  getSiteLogo,
  getSiteInfo,
  getProgramas,
  getProgramaBySlug,
  getPodcasts,
  getPodcastBySlug,
  getEquipo,
  getEquipoBySlug,
  getPageData, 
  getEmisora,
  getMenuNavegacion,
  getNoticias,
  getNoticiasPaginadas,
  getNoticiaBySlug,
  getCategoriasNoticias,
  getTodosLasNoticias,
  getVinilos, 
  getViniloBySlug,
  getVinilosPaginados,
  getVinilosPaginadosOptimizado: getVinilosPaginados,
  getArtistasUnicos,
  getTodosLosVinilos,
  logCacheStats,
};