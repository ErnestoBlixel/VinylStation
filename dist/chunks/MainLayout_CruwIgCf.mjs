import { a as createComponent, m as maybeRenderHead, d as addAttribute, e as renderSlot, b as renderTemplate, c as createAstro, f as renderHead, r as renderComponent } from './astro/server_DfIlsqH_.mjs';
import 'kleur/colors';
import 'clsx';
import { gql, request } from 'graphql-request';
/* empty css                         */

const WORDPRESS_GRAPHQL_URL = "https://cms.vinylstation.es/graphql";
console.log("🔗 WordPress API URL:", WORDPRESS_GRAPHQL_URL);
function processImageURL(url) {
  if (!url) return "/images/placeholder-radio.jpg";
  if (/^https?:\/\//.test(url)) return url;
  const wpBase = "https://cms.vinylstation.es/wp-json".replace("/wp-json", "") ;
  return url.startsWith("/") ? `${wpBase}${url}` : url;
}
async function getSiteLogo() {
  console.log("🎯 Obteniendo logo del sitio...");
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
        altText: customLogo.node.altText || "VinylStation",
        source: "customLogo"
      };
    }
  } catch {
    console.warn("⚠️ customLogo no disponible, usando fallback");
  }
  return {
    url: "/images/logos/vinyl-station-logo.svg",
    // Asegúrate que esta ruta es correcta
    altText: "VinylStation",
    source: "fallback"
  };
}
async function getSiteInfo() {
  console.log("🔄 Obteniendo información del sitio desde WordPress...");
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
      console.warn("⚠️ No se obtuvo el título desde generalSettings, usando fallback.");
      const logoFallback = await getSiteLogo();
      return {
        title: "VinylStation",
        description: "Tu emisora de vinilo 24/7",
        url: "https://vinylstation.com",
        timezone: "Europe/Madrid",
        language: "es-ES",
        logo: logoFallback
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
        source: logo.source
      }
    };
  } catch (error) {
    console.error("❌ Error en getSiteInfo:", error.message);
    const logoFallback = await getSiteLogo();
    return {
      // Devuelve un objeto de fallback completo
      title: "VinylStation (Error)",
      description: "Error al cargar la información del sitio.",
      url: "https://vinylstation.com",
      timezone: "Europe/Madrid",
      language: "es-ES",
      logo: logoFallback
    };
  }
}
async function getProgramas({ limit = 10 } = {}) {
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
      console.warn("⚠️ getProgramas: respuesta inesperada o sin nodos", programas);
      return { programas: [], pageInfo: null };
    }
    const enviados = nodes.map((p) => {
      const imgUrl = p.imagenPrincipalUrl || processImageURL(p.imagenPrincipal?.sourceUrl) || processImageURL(p.featuredImage?.node?.sourceUrl) || "/images/placeholder-radio.jpg";
      const alt = p.imagenPrincipal?.altText || p.featuredImage?.node?.altText || p.seo?.title || p.title;
      let cleanExcerpt = "";
      if (p.content) {
        cleanExcerpt = p.content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        cleanExcerpt = cleanExcerpt.substring(0, 160) + (cleanExcerpt.length > 160 ? "..." : "");
      } else {
        cleanExcerpt = p.seo?.metaDesc || `Programa "${p.title}" - Música en vinilo`;
      }
      return {
        ...p,
        imagenPrincipalUrl: imgUrl,
        imagenPrincipal: { sourceUrl: imgUrl, altText: alt },
        excerpt: cleanExcerpt,
        camposPrograma: {
          vsDescripcion: p.camposPrograma?.vsDescripcion || cleanExcerpt
        },
        seo: p.seo?.title ? p.seo : {
          title: `${p.title} | VinylStation Programas`,
          metaDesc: cleanExcerpt
        }
      };
    });
    return {
      programas: enviados,
      pageInfo: programas.pageInfo
    };
  } catch (error) {
    console.error("❌ Error en getProgramas:", error.message);
    if (error.response?.errors) {
      console.error("GraphQL Errors (getProgramas):", JSON.stringify(error.response.errors, null, 2));
    }
    return { programas: [], pageInfo: null };
  }
}
async function getPageData(slug) {
  console.log(`📄 Obteniendo página (corregido v2): ${slug || "home"}`);
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
  if (!slug || slug === "home" || slug === "inicio") {
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
    let cleanExcerpt = "";
    if (page.content) {
      cleanExcerpt = page.content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      cleanExcerpt = cleanExcerpt.substring(0, 250) + (cleanExcerpt.length > 250 ? "..." : "");
    } else {
      cleanExcerpt = page.seo?.metaDesc || `Contenido de la página ${page.title || "desconocida"}.`;
    }
    return {
      ...page,
      excerpt: cleanExcerpt,
      featuredImage: page.featuredImage?.node ? {
        url: processImageURL(page.featuredImage.node.sourceUrl),
        altText: page.featuredImage.node.altText || page.title
      } : null,
      seo: page.seo?.title ? page.seo : {
        title: `${page.title || "Página"} | VinylStation`,
        metaDesc: cleanExcerpt.substring(0, 160) || "Tu emisora de vinilo 24/7"
      }
    };
  } catch (error) {
    console.error(`❌ Error en getPageData(${slug || JSON.stringify(vars)}):`, error.message);
    if (error.response?.errors) {
      console.error("GraphQL Errors (getPageData):", JSON.stringify(error.response.errors, null, 2));
    }
    const pageTitleFallback = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "VinylStation";
    return {
      id: "fallback-page",
      title: pageTitleFallback,
      content: `<p>Error al cargar el contenido de la página. Por favor, inténtalo de nuevo más tarde.</p>`,
      excerpt: "Error al cargar el contenido. Revisa la consola del servidor para más detalles.",
      slug: slug || "error",
      date: (/* @__PURE__ */ new Date()).toISOString(),
      featuredImage: null,
      seo: {
        title: `${pageTitleFallback} | VinylStation`,
        metaDesc: "Error al cargar la descripción de la página."
      }
    };
  }
}
async function getVinilos({ limit = 200, page = null, itemsPerPage = 20 } = {}) {
  if (page !== null) {
    return getVinilosPaginados({ page, itemsPerPage });
  }
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
    const variables = { first: Math.min(limit, 200) };
    const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY, variables);
    const nodes = rawData?.vinilos?.nodes || [];
    const pageInfo = rawData?.vinilos?.pageInfo;
    if (!Array.isArray(nodes)) {
      console.warn("⚠️ getVinilos: nodes inválidos");
      return { vinilos: [], pageInfo: { hasNextPage: false, total: 0 } };
    }
    console.log(`📀 Obtenidos ${nodes.length} vinilos de la API`);
    const vinilosProcesados = nodes.map((v, index) => {
      const imgUrl = v.imagenPrincipalUrl || processImageURL(v.imagenPrincipal?.sourceUrl) || "/images/placeholder-vinyl.jpg";
      const alt = v.imagenPrincipal?.altText || v.title || `Vinilo ${v.databaseId || index}`;
      const generatedExcerpt = `Artista: ${v.camposVinilo?.vsArtista || "N/A"}. Álbum: ${v.camposVinilo?.vsAlbum || "N/A"}. Precio: ${v.camposVinilo?.vsPrecio || "Consultar"}.`;
      return {
        ...v,
        imagenPrincipalUrl: imgUrl,
        imagenPrincipal: { sourceUrl: imgUrl, altText: alt },
        excerpt: generatedExcerpt,
        camposVinilo: {
          vsPrecio: v.camposVinilo?.vsPrecio || "",
          vsArtista: v.camposVinilo?.vsArtista || "",
          vsAlbum: v.camposVinilo?.vsAlbum || ""
        },
        seo: {
          title: `${v.title || "Vinilo"} | VinylStation`,
          metaDesc: generatedExcerpt.substring(0, 160)
        }
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
    console.error("❌ Error en getVinilos:", error.message);
    if (error.response?.errors) {
      console.error("GraphQL Errors (getVinilos):", JSON.stringify(error.response.errors, null, 2));
    }
    return {
      vinilos: [],
      pageInfo: { hasNextPage: false, total: 0 }
    };
  }
}
async function getVinilosPaginados({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`📀 Obteniendo página ${page} con ${itemsPerPage} vinilos (optimizado)...`);
  if (page <= 3) {
    return getVinilosPaginadosOptimizado({ page, itemsPerPage });
  }
  return getVinilosPaginadosConCursor({ page, itemsPerPage });
}
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
    const totalNeeded = page * itemsPerPage;
    const variables = { first: Math.min(totalNeeded, 100) };
    console.log(`📄 Pidiendo ${variables.first} elementos para página ${page}`);
    const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY, variables);
    const allNodes = rawData?.vinilos?.nodes || [];
    const pageInfo = rawData?.vinilos?.pageInfo;
    if (!Array.isArray(allNodes)) {
      console.warn("⚠️ Nodes inválidos");
      return { vinilos: [], pageInfo: { hasNext: false, hasPrevious: false, total: 4218, currentPage: page } };
    }
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const pageNodes = allNodes.slice(startIndex, endIndex);
    console.log(`✅ Página ${page}: extraídos ${pageNodes.length} vinilos (${startIndex} a ${endIndex - 1})`);
    if (pageNodes.length === 0) {
      console.log("⚠️ No hay vinilos para esta página");
      return { vinilos: [], pageInfo: { hasNext: false, hasPrevious: page > 1, total: 4218, currentPage: page } };
    }
    const vinilosProcesados = pageNodes.map((v, index) => {
      const imgUrl = v.imagenPrincipalUrl || processImageURL(v.imagenPrincipal?.sourceUrl) || "/images/placeholder-vinyl.jpg";
      const alt = v.imagenPrincipal?.altText || v.title || `Vinilo ${v.databaseId || index}`;
      const generatedExcerpt = `Artista: ${v.camposVinilo?.vsArtista || "N/A"}. Álbum: ${v.camposVinilo?.vsAlbum || "N/A"}. Precio: ${v.camposVinilo?.vsPrecio || "Consultar"}.`;
      return {
        ...v,
        imagenPrincipalUrl: imgUrl,
        imagenPrincipal: { sourceUrl: imgUrl, altText: alt },
        excerpt: generatedExcerpt,
        camposVinilo: {
          vsPrecio: v.camposVinilo?.vsPrecio || "",
          vsArtista: v.camposVinilo?.vsArtista || "",
          vsAlbum: v.camposVinilo?.vsAlbum || ""
        },
        seo: {
          title: `${v.title || "Vinilo"} | VinylStation`,
          metaDesc: generatedExcerpt.substring(0, 160)
        }
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
    console.error("❌ Error simple:", error.message);
    return {
      vinilos: [],
      pageInfo: { hasNext: false, hasPrevious: page > 1, total: 4218, currentPage: page }
    };
  }
}
async function getVinilosPaginadosConCursor({ page = 1, itemsPerPage = 20 } = {}) {
  console.log(`📀 Usando cursor para página ${page}...`);
  return getVinilosPaginadosConCursorFallback({ page, itemsPerPage });
}
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
    const itemsToLoad = page * itemsPerPage;
    const variables = { first: itemsToLoad };
    console.log(`📄 Fallback: cargando ${itemsToLoad} items para simular página ${page}`);
    const rawData = await request(WORDPRESS_GRAPHQL_URL, QUERY, variables);
    const allNodes = rawData?.vinilos?.nodes || [];
    const pageInfo = rawData?.vinilos?.pageInfo;
    if (!Array.isArray(allNodes)) {
      console.warn("⚠️ fallback: nodes inválidos");
      return { vinilos: [], pageInfo: { hasNext: false, hasPrevious: false, total: 0, currentPage: page } };
    }
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageNodes = allNodes.slice(startIndex, endIndex);
    console.log(`✅ Fallback página ${page}: ${pageNodes.length} vinilos (de ${startIndex} a ${endIndex - 1})`);
    const vinilosProcesados = pageNodes.map((v, index) => {
      const imgUrl = v.imagenPrincipalUrl || processImageURL(v.imagenPrincipal?.sourceUrl) || "/images/placeholder-vinyl.jpg";
      const alt = v.imagenPrincipal?.altText || v.title || `Vinilo ${v.databaseId || index}`;
      const generatedExcerpt = `Artista: ${v.camposVinilo?.vsArtista || "N/A"}. Álbum: ${v.camposVinilo?.vsAlbum || "N/A"}. Precio: ${v.camposVinilo?.vsPrecio || "Consultar"}.`;
      return {
        ...v,
        imagenPrincipalUrl: imgUrl,
        imagenPrincipal: { sourceUrl: imgUrl, altText: alt },
        excerpt: generatedExcerpt,
        camposVinilo: {
          vsPrecio: v.camposVinilo?.vsPrecio || "",
          vsArtista: v.camposVinilo?.vsArtista || "",
          vsAlbum: v.camposVinilo?.vsAlbum || ""
        },
        seo: {
          title: `${v.title || "Vinilo"} | VinylStation`,
          metaDesc: generatedExcerpt.substring(0, 160)
        }
      };
    });
    const hasNext = pageInfo?.hasNextPage || allNodes.length === itemsToLoad;
    const hasPrevious = page > 1;
    const totalEstimado = hasNext ? 4218 : allNodes.length;
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
    console.error("❌ Error en fallback:", error.message);
    return {
      vinilos: [],
      pageInfo: { hasNext: false, hasPrevious: false, total: 0, currentPage: page }
    };
  }
}
async function getViniloBySlug(slug) {
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
    const imgUrl = vinilo.imagenPrincipalUrl || processImageURL(vinilo.imagenPrincipal?.sourceUrl) || "/images/placeholder-vinyl.jpg";
    const alt = vinilo.imagenPrincipal?.altText || vinilo.seo?.title || vinilo.title;
    let cleanExcerpt = "";
    if (vinilo.content) {
      cleanExcerpt = vinilo.content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      cleanExcerpt = cleanExcerpt.substring(0, 250) + (cleanExcerpt.length > 250 ? "..." : "");
    } else {
      cleanExcerpt = vinilo.seo?.metaDesc || `Detalles sobre el vinilo ${vinilo.title || "desconocido"}.`;
    }
    return {
      ...vinilo,
      imagenPrincipalUrl: imgUrl,
      imagenPrincipal: { sourceUrl: imgUrl, altText: alt },
      excerpt: cleanExcerpt,
      camposVinilo: {
        vsPrecio: vinilo.camposVinilo?.vsPrecio || "",
        vsArtista: vinilo.camposVinilo?.vsArtista || "",
        vsAlbum: vinilo.camposVinilo?.vsAlbum || ""
      },
      seo: vinilo.seo?.title ? vinilo.seo : {
        title: `${vinilo.title || "Vinilo"} | VinylStation`,
        metaDesc: cleanExcerpt.substring(0, 160) || `Descubre "${vinilo.title || "este vinilo"}" en VinylStation`
      }
    };
  } catch (error) {
    console.error(`❌ Error en getViniloBySlug(${slug}):`, error.message);
    if (error.response?.errors) {
      console.error("GraphQL Errors (getViniloBySlug):", JSON.stringify(error.response.errors, null, 2));
    }
    return null;
  }
}
async function getProgramaBySlug(slug) {
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
    const imgUrl = programa.imagenPrincipalUrl || processImageURL(programa.imagenPrincipal?.sourceUrl) || processImageURL(programa.featuredImage?.node?.sourceUrl) || "/images/placeholder-radio.jpg";
    const alt = programa.imagenPrincipal?.altText || programa.featuredImage?.node?.altText || programa.seo?.title || programa.title;
    let cleanExcerpt = "";
    if (programa.content) {
      cleanExcerpt = programa.content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      cleanExcerpt = cleanExcerpt.substring(0, 160) + (cleanExcerpt.length > 160 ? "..." : "");
    } else {
      cleanExcerpt = programa.seo?.metaDesc || `Programa "${programa.title}" - Música en vinilo`;
    }
    return {
      ...programa,
      imagenPrincipalUrl: imgUrl,
      imagenPrincipal: { sourceUrl: imgUrl, altText: alt },
      excerpt: cleanExcerpt,
      camposPrograma: {
        vsDescripcion: programa.camposPrograma?.vsDescripcion || cleanExcerpt
      },
      seo: programa.seo?.title ? programa.seo : {
        title: `${programa.title || "Programa"} | VinylStation`,
        metaDesc: cleanExcerpt || `Escucha "${programa.title || "este programa"}", programa de vinilo`
      }
    };
  } catch (error) {
    console.error(`❌ Error en getProgramaBySlug(${slug}):`, error.message);
    if (error.response?.errors) {
      console.error("GraphQL Errors (getProgramaBySlug):", JSON.stringify(error.response.errors, null, 2));
    }
    return null;
  }
}
async function getEmisora() {
  console.log("🎵 Obteniendo información de la emisora (local)");
  return {
    id: "vinylstation",
    title: "VinylStation Radio",
    camposEmisora: {
      vsMp3StreamUrl: "https://stream.zeno.fm/4g7qxnxrloluv",
      vsNombre: "VinylStation Radio",
      vsDescripcion: "Tu emisora de radio especializada en música vinilo"
    }
  };
}
async function getMenuNavegacion(menuSlug = "primary") {
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
      return { items: getMenuFallback(), name: menuSlug, source: "fallback" };
    }
    const sortedItems = [...menu.menuItems.nodes].sort((a, b) => (a.order || 0) - (b.order || 0));
    const items = sortedItems.map((item) => ({
      id: item.id,
      label: item.label,
      url: item.path || processMenuUrl(item.url),
      target: item.target || "_self",
      title: item.title || item.label,
      cssClasses: item.cssClasses || []
    }));
    return { items, name: menu.name || menuSlug, source: "wordpress" };
  } catch (error) {
    console.error(`❌ Error obteniendo menú "${menuSlug}":`, error.message);
    if (error.response?.errors) {
      console.error("GraphQL Errors (getMenuNavegacion):", JSON.stringify(error.response.errors, null, 2));
    }
    return { items: getMenuFallback(), name: menuSlug, source: "fallback-error" };
  }
}
function processMenuUrl(url) {
  if (!url || url === "#") return "/";
  try {
    const parsedUrl = new URL(url);
    const siteUrl = new URL("https://vinylstation.com");
    const wpUrl = new URL(WORDPRESS_GRAPHQL_URL);
    if (parsedUrl.protocol.startsWith("http")) {
      if (parsedUrl.hostname !== siteUrl.hostname && parsedUrl.hostname !== wpUrl.hostname) {
        return url;
      }
      return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
    }
  } catch (e) {
  }
  if (url.startsWith("/")) return url;
  return `/${url}`;
}
function getMenuFallback() {
  console.log("⚠️ Usando menú de fallback.");
  return [
    { id: "fb-1", label: "Inicio", url: "/", target: "_self", title: "Ir a Inicio" },
    { id: "fb-2", label: "Vinilos", url: "/vinilos", target: "_self", title: "Ver Vinilos" },
    { id: "fb-3", label: "Programas", url: "/programas", target: "_self", title: "Ver Programas" }
  ];
}
async function getNoticias({ limit = 2e4 } = {}) {
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
        console.warn("⚠️ Límite de páginas (250) alcanzado en getNoticias.");
        break;
      }
    }
    const noticiasProcessed = allNoticias.map((n) => {
      const imgUrl = processImageURL(n.featuredImage?.node?.sourceUrl) || "/images/placeholder-news.jpg";
      const alt = n.featuredImage?.node?.altText || n.seo?.title || n.title;
      let cleanExcerpt = "";
      if (n.content) {
        cleanExcerpt = n.content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        cleanExcerpt = cleanExcerpt.substring(0, 160) + (cleanExcerpt.length > 160 ? "..." : "");
      } else {
        cleanExcerpt = n.seo?.metaDesc || `Lee la noticia "${n.title || "desconocida"}".`;
      }
      return {
        ...n,
        imagenDestacadaUrl: imgUrl,
        featuredImage: { node: { sourceUrl: imgUrl, altText: alt } },
        excerpt: cleanExcerpt,
        categories: n.categoriasNoticia?.nodes || [],
        author: null,
        seo: n.seo?.title ? n.seo : {
          title: `${n.title || "Noticia"} | VinylStation Noticias`,
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
    console.error("❌ Error en getNoticias:", error.message);
    if (error.response?.errors) {
      console.error("GraphQL Errors (getNoticias):", JSON.stringify(error.response.errors, null, 2));
    }
    return { noticias: [], pageInfo: { hasNextPage: false, endCursor: null, total: 0 } };
  }
}
async function getNoticiaBySlug(slug) {
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
    const imgUrl = processImageURL(noticia.featuredImage?.node?.sourceUrl) || "/images/placeholder-news.jpg";
    const alt = noticia.featuredImage?.node?.altText || noticia.seo?.title || noticia.title;
    let cleanExcerpt = "";
    if (noticia.content) {
      cleanExcerpt = noticia.content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      cleanExcerpt = cleanExcerpt.substring(0, 160) + (cleanExcerpt.length > 160 ? "..." : "");
    } else {
      cleanExcerpt = noticia.seo?.metaDesc || `Lee la noticia "${noticia.title || "desconocida"}".`;
    }
    return {
      ...noticia,
      imagenDestacadaUrl: imgUrl,
      featuredImage: { node: { sourceUrl: imgUrl, altText: alt } },
      excerpt: cleanExcerpt,
      categories: noticia.categoriasNoticia?.nodes || [],
      author: null,
      seo: noticia.seo?.title ? noticia.seo : {
        title: `${noticia.title || "Noticia"} | VinylStation Noticias`,
        metaDesc: cleanExcerpt
      }
    };
  } catch (error) {
    console.error(`❌ Error en getNoticiaBySlug(${slug}):`, error.message);
    if (error.response?.errors) {
      console.error("GraphQL Errors (getNoticiaBySlug):", JSON.stringify(error.response.errors, null, 2));
    }
    return null;
  }
}
async function getCategoriasNoticias() {
  console.log("🏷️ Obteniendo categorías de noticias...");
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
    console.error("❌ Error en getCategoriasNoticias:", error.message);
    if (error.response?.errors) {
      console.error("GraphQL Errors (getCategoriasNoticias):", JSON.stringify(error.response.errors, null, 2));
    }
    return { categorias: [] };
  }
}

const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const siteInfo = await getSiteInfo();
  let menuItems = [];
  try {
    const menuData = await getMenuNavegacion("Menu");
    menuItems = menuData.items || [];
    console.log("\u2705 Men\xFA cargado din\xE1micamente:", menuItems.length, "elementos");
  } catch (error) {
    console.error("\u274C Error cargando men\xFA din\xE1mico:", error.message);
    menuItems = [
      { id: "1", label: "Inicio", url: "/", target: "_self" },
      { id: "2", label: "Vinilos", url: "/vinilos", target: "_self" },
      { id: "3", label: "Programas", url: "/programas", target: "_self" },
      { id: "4", label: "Noticias", url: "/noticias", target: "_self" }
    ];
  }
  return renderTemplate`${maybeRenderHead()}<header class="header" data-astro-cid-3ef6ksr2> <div class="header-content" data-astro-cid-3ef6ksr2> <div class="logo" data-astro-cid-3ef6ksr2> <a href="/" data-astro-cid-3ef6ksr2> <img${addAttribute(siteInfo.logo.url, "src")}${addAttribute(siteInfo.logo.altText, "alt")} class="logo-img" data-astro-cid-3ef6ksr2>
VinylStation
</a> </div> <nav class="main-nav" data-astro-cid-3ef6ksr2> <ul data-astro-cid-3ef6ksr2> ${menuItems.map((item) => renderTemplate`<li${addAttribute(item.id, "key")} data-astro-cid-3ef6ksr2> <a${addAttribute(item.path || item.url, "href")}${addAttribute(item.target || "_self", "target")}${addAttribute(item.title || item.label, "title")}${addAttribute(Array.isArray(item.cssClasses) ? item.cssClasses.join(" ") : item.cssClasses || "", "class")} data-astro-cid-3ef6ksr2> ${item.label} </a> </li>`)} </ul> </nav> <div class="radio-container" data-astro-cid-3ef6ksr2> ${renderSlot($$result, $$slots["default"])} </div> </div> </header> `;
}, "C:/Users/nestu/Desktop/web vinylstation/astro_30-05/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer data-astro-cid-sz7xmlte> <div class="footer-content" data-astro-cid-sz7xmlte> <div class="footer-logo" data-astro-cid-sz7xmlte> <h2 data-astro-cid-sz7xmlte>VinylStation</h2> <p data-astro-cid-sz7xmlte>Tu plataforma para amantes del vinilo</p> </div> <div class="footer-links" data-astro-cid-sz7xmlte> <h3 data-astro-cid-sz7xmlte>Enlaces Rápidos</h3> <ul data-astro-cid-sz7xmlte> <li data-astro-cid-sz7xmlte><a href="/" data-astro-cid-sz7xmlte>Inicio</a></li> <li data-astro-cid-sz7xmlte><a href="/coleccion" data-astro-cid-sz7xmlte>Mi Colección</a></li> <li data-astro-cid-sz7xmlte><a href="/explorar" data-astro-cid-sz7xmlte>Explorar</a></li> <li data-astro-cid-sz7xmlte><a href="/sobre-nosotros" data-astro-cid-sz7xmlte>Sobre Nosotros</a></li> </ul> </div> <div class="footer-social" data-astro-cid-sz7xmlte> <h3 data-astro-cid-sz7xmlte>Síguenos</h3> <div class="social-icons" data-astro-cid-sz7xmlte> <a href="#" aria-label="Facebook" data-astro-cid-sz7xmlte>FB</a> <a href="#" aria-label="Twitter" data-astro-cid-sz7xmlte>TW</a> <a href="#" aria-label="Instagram" data-astro-cid-sz7xmlte>IG</a> </div> </div> </div> <div class="footer-bottom" data-astro-cid-sz7xmlte> <p data-astro-cid-sz7xmlte>&copy; ${currentYear} VinylStation. Todos los derechos reservados.</p> </div> </footer> `;
}, "C:/Users/nestu/Desktop/web vinylstation/astro_30-05/src/components/Footer.astro", void 0);

const $$RadioPlayer = createComponent(async ($$result, $$props, $$slots) => {
  const emisora = await getEmisora();
  const STREAM_URL = emisora?.camposEmisora?.vsMp3StreamUrl || "https://stream.zeno.fm/4g7qxnxrloluv";
  return renderTemplate`${maybeRenderHead()}<div class="radio-player-minimal" data-astro-cid-peecseug> <audio id="radio-audio" preload="none"${addAttribute(STREAM_URL, "data-stream-url")} data-astro-cid-peecseug></audio> <div class="player-controls" data-astro-cid-peecseug> <button id="play-pause" class="play-button" aria-label="Reproducir/Pausar" data-astro-cid-peecseug> <svg id="play-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-peecseug> <polygon points="5,3 19,12 5,21" data-astro-cid-peecseug></polygon> </svg> <svg id="pause-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;" data-astro-cid-peecseug> <rect x="6" y="4" width="4" height="16" data-astro-cid-peecseug></rect> <rect x="14" y="4" width="4" height="16" data-astro-cid-peecseug></rect> </svg> </button> <div class="status-info" data-astro-cid-peecseug> <span id="status-text" data-astro-cid-peecseug>Radio en vivo</span> <div id="loading-indicator" class="loading-dot" style="display: none;" data-astro-cid-peecseug></div> </div> <div class="volume-control" data-astro-cid-peecseug> <button id="volume-toggle" class="volume-button" aria-label="Silenciar/Activar sonido" data-astro-cid-peecseug> <svg id="volume-on" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-peecseug> <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" data-astro-cid-peecseug></polygon> <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" data-astro-cid-peecseug></path> </svg> <svg id="volume-off" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;" data-astro-cid-peecseug> <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" data-astro-cid-peecseug></polygon> <line x1="23" y1="9" x2="17" y2="15" data-astro-cid-peecseug></line> <line x1="17" y1="9" x2="23" y2="15" data-astro-cid-peecseug></line> </svg> </button> <input type="range" id="volume-slider" class="volume-slider" min="0" max="1" step="0.1" value="0.7" data-astro-cid-peecseug> </div> </div> </div>  `;
}, "C:/Users/nestu/Desktop/web vinylstation/astro_30-05/src/components/RadioPlayer.astro", void 0);

const $$Astro = createAstro("https://vinylstation.com");
const $$MainLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MainLayout;
  const { title, description } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><meta name="description"${addAttribute(description, "content")}><meta name="theme-color" content="#0a0a0a"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:type" content="website"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="stylesheet" href="/styles/global.css"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">${renderHead()}</head> <body>  ${renderComponent($$result, "Header", $$Header, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "RadioPlayer", $$RadioPlayer, {})} ` })}  <main> ${renderSlot($$result, $$slots["default"])}  </main>  ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
}, "C:/Users/nestu/Desktop/web vinylstation/astro_30-05/src/layouts/MainLayout.astro", void 0);

export { $$MainLayout as $, getNoticiaBySlug as a, getNoticias as b, getPageData as c, getCategoriasNoticias as d, getProgramaBySlug as e, getProgramas as f, getSiteInfo as g, getViniloBySlug as h, getVinilos as i };
