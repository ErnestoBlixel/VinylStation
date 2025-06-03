globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { e as createAstro, c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead, F as Fragment, d as addAttribute } from '../chunks/astro/server_DfYyg2vJ.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_BO0IMRcn.mjs';
import { g as getSiteInfo, a as getPageData, k as getTodosLosVinilos, l as getVinilosPaginados } from '../chunks/wordpress_iKskd3ty.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://vinylstation.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const itemsPerPage = 32;
  const url = new URL(Astro2.request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("p") || "1", 10));
  const searchQuery = url.searchParams.get("search") || "";
  let hasError = false;
  let errorMessage = "";
  let siteInfo = null;
  let pageData = null;
  let vinilosData = null;
  try {
    siteInfo = await getSiteInfo();
    pageData = await getPageData("vinilos");
    if (searchQuery && searchQuery.trim() !== "") {
      console.log(`\u{1F50D} Realizando b\xFAsqueda global para: "${searchQuery}"`);
      const todosLosVinilosData = await getTodosLosVinilos();
      console.log(`\u2705 Total de vinilos cargados para b\xFAsqueda: ${todosLosVinilosData.total}`);
      vinilosData = {
        vinilos: todosLosVinilosData.vinilos,
        pageInfo: {
          total: todosLosVinilosData.total,
          totalVinilos: todosLosVinilosData.total,
          totalPages: Math.ceil(todosLosVinilosData.total / itemsPerPage),
          currentPage: page,
          hasNext: false,
          hasPrevious: false
        }
      };
    } else {
      vinilosData = await getVinilosPaginados({ page, itemsPerPage });
    }
    if (!siteInfo || !siteInfo.title) throw new Error("No se pudo obtener el t\xEDtulo del sitio desde WordPress");
  } catch (error) {
    hasError = true;
    errorMessage = `Error conectando con WordPress: ${error.message}`;
  }
  let vinilos = hasError ? [] : vinilosData?.vinilos || [];
  let totalVinilosOriginales = vinilos.length;
  let pageInfo = vinilosData?.pageInfo || {};
  let totalPages = pageInfo.totalPages || 1;
  if (searchQuery && searchQuery.trim() !== "") {
    const searchTerm = searchQuery.toLowerCase().trim();
    vinilos = vinilos.filter((vinilo) => {
      const title = (vinilo.title || "").toLowerCase();
      const artist = (vinilo.camposVinilo?.vsArtista || "").toLowerCase();
      const album = (vinilo.camposVinilo?.vsAlbum || "").toLowerCase();
      return title.includes(searchTerm) || artist.includes(searchTerm) || album.includes(searchTerm);
    });
    console.log(`\u{1F50D} B\xFAsqueda '${searchQuery}': ${vinilos.length} vinilos encontrados de ${totalVinilosOriginales} totales`);
    const totalResultados = vinilos.length;
    const totalPagesSearch = Math.ceil(totalResultados / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    vinilos = vinilos.slice(startIndex, endIndex);
    pageInfo = {
      totalPages: totalPagesSearch,
      currentPage: page,
      total: totalResultados,
      totalVinilos: totalResultados,
      hasNext: page < totalPagesSearch,
      hasPrevious: page > 1
    };
    totalPages = totalPagesSearch;
  }
  const TOTAL_VINILOS_GLOBAL = 4218;
  const totalVinilosGlobal = searchQuery ? totalVinilosOriginales : pageInfo.totalVinilos || pageInfo.total || TOTAL_VINILOS_GLOBAL;
  const totalVinilos = searchQuery ? vinilos.length : totalVinilosGlobal;
  const heroTitle = hasError ? null : pageData?.title || "Vinilos recomendados por VinylStation Radio";
  const heroDescription = hasError ? null : pageData?.excerpt || "Descubre nuestra selecci\xF3n cuidada de vinilos cl\xE1sicos, ediciones limitadas y novedades.";
  const pageTitle = hasError ? "Error - Vinilos" : pageData?.seo?.title || `${heroTitle} - VinylStation`;
  const pageDescription = hasError ? "Error cargando contenido" : pageData?.seo?.metaDesc || heroDescription;
  let paginasVisibles = [];
  if (totalPages <= 3) {
    paginasVisibles = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    if (page === 1) {
      paginasVisibles = [1, 2, 3];
    } else if (page === totalPages) {
      paginasVisibles = [totalPages - 2, totalPages - 1, totalPages];
    } else {
      paginasVisibles = [page - 1, page, page + 1];
    }
    paginasVisibles = paginasVisibles.filter((p) => p >= 1 && p <= totalPages);
  }
  const buildSearchUrl = (pageNum, search = searchQuery) => {
    const params = new URLSearchParams();
    if (pageNum > 1) params.set("p", pageNum);
    if (search && search.trim() !== "") params.set("search", search);
    const queryString = params.toString();
    return queryString ? `/vinilos?${queryString}` : "/vinilos";
  };
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": pageTitle, "description": pageDescription, "data-astro-cid-zhjfx4fz": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="main-content" data-astro-cid-zhjfx4fz> ${hasError ? renderTemplate`<div class="container hero-container" data-astro-cid-zhjfx4fz> <div class="error-container" data-astro-cid-zhjfx4fz> <div class="error-icon" data-astro-cid-zhjfx4fz>📀</div> <h1 class="error-title" data-astro-cid-zhjfx4fz>Error Cargando Vinilos</h1> <p class="error-message" data-astro-cid-zhjfx4fz>${errorMessage}</p> <div class="error-details" data-astro-cid-zhjfx4fz> <h3 data-astro-cid-zhjfx4fz>Posibles soluciones:</h3> <ul data-astro-cid-zhjfx4fz> <li data-astro-cid-zhjfx4fz>Verifica conexión a: https://cms.vinylstation.es/graphql</li> <li data-astro-cid-zhjfx4fz>Comprueba que WordPress esté funcionando</li> <li data-astro-cid-zhjfx4fz>Revisa configuración de GraphQL y ACF</li> <li data-astro-cid-zhjfx4fz>Asegúrate de que los vinilos tengan campos configurados</li> </ul> </div> <div class="error-actions" data-astro-cid-zhjfx4fz> <button onclick="window.location.reload()" class="btn primary-btn" data-astro-cid-zhjfx4fz>
🔄 Reintentar
</button> <a href="/" class="btn secondary-btn" data-astro-cid-zhjfx4fz>← Volver al inicio</a> </div> </div> </div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-zhjfx4fz": true }, { "default": async ($$result3) => renderTemplate`<div class="container hero-container" data-astro-cid-zhjfx4fz> <header class="page-header" data-astro-cid-zhjfx4fz> ${renderTemplate`<div class="site-icon-container" data-astro-cid-zhjfx4fz> <img src="/images/logos/logo vinylstation.png" alt="VinylStation Logo" class="site-icon" data-astro-cid-zhjfx4fz> </div>`} <h1 data-astro-cid-zhjfx4fz>${heroTitle}</h1> <p class="page-description" data-astro-cid-zhjfx4fz>${heroDescription}</p> <div class="vinyl-stats" data-astro-cid-zhjfx4fz> <div class="stat-card" data-astro-cid-zhjfx4fz> <span class="stat-number" data-astro-cid-zhjfx4fz>${searchQuery ? totalVinilosOriginales : totalVinilosGlobal}</span> <span class="stat-label" data-astro-cid-zhjfx4fz>${searchQuery ? "Total Vinilos" : "Vinilos"}</span> </div> ${searchQuery && renderTemplate`<div class="stat-card highlight" data-astro-cid-zhjfx4fz> <span class="stat-number" data-astro-cid-zhjfx4fz>${totalVinilos}</span> <span class="stat-label" data-astro-cid-zhjfx4fz>Encontrados</span> </div>`} <div class="stat-card" data-astro-cid-zhjfx4fz> <span class="stat-number" data-astro-cid-zhjfx4fz>33⅓</span> <span class="stat-label" data-astro-cid-zhjfx4fz>RPM</span> </div> <div class="stat-card" data-astro-cid-zhjfx4fz> <span class="stat-number" data-astro-cid-zhjfx4fz>24h</span> <span class="stat-label" data-astro-cid-zhjfx4fz>Música</span> </div> </div> <div class="hero-actions" data-astro-cid-zhjfx4fz> <a href="/programas" class="btn secondary-btn" data-astro-cid-zhjfx4fz>Explorar Programas</a> <a href="#vinilos" class="btn primary-btn" data-astro-cid-zhjfx4fz>Ver Vinilos</a> </div> </header> </div> <section id="vinilos" class="vinyl-section" data-astro-cid-zhjfx4fz> <div class="container" data-astro-cid-zhjfx4fz> <div class="section-header" data-astro-cid-zhjfx4fz> <div class="section-title-row" data-astro-cid-zhjfx4fz> <h2 data-astro-cid-zhjfx4fz>Todos los Vinilos</h2> <form class="search-form" method="GET" action="/vinilos" id="searchForm" data-astro-cid-zhjfx4fz> <input type="hidden" name="p" value="1" data-astro-cid-zhjfx4fz> <div class="search-input-group" data-astro-cid-zhjfx4fz> <input type="text" name="search" class="search-input" placeholder="Buscar vinilos, artistas, álbumes..."${addAttribute(searchQuery, "value")} data-astro-cid-zhjfx4fz> <button type="submit" class="search-button" data-astro-cid-zhjfx4fz> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-astro-cid-zhjfx4fz> <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" data-astro-cid-zhjfx4fz></path> </svg> </button> ${searchQuery && renderTemplate`<a href="/vinilos" class="clear-search" title="Limpiar búsqueda" data-astro-cid-zhjfx4fz> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-astro-cid-zhjfx4fz> <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-zhjfx4fz></path> </svg> </a>`} </div> </form> </div> <p data-astro-cid-zhjfx4fz> ${searchQuery ? vinilos.length > 0 ? `Se encontraron ${vinilos.length} vinilos que coinciden con "${searchQuery}" de un total de ${totalVinilosOriginales} vinilos` : `No se encontraron vinilos que coincidan con "${searchQuery}". Se busc\xF3 entre ${totalVinilosOriginales} vinilos.` : "Explora nuestra colecci\xF3n completa de vinilos, desde cl\xE1sicos atemporales hasta las \xFAltimas novedades en formato anal\xF3gico."} </p> </div> ${vinilos.length > 0 ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "data-astro-cid-zhjfx4fz": true }, { "default": async ($$result4) => renderTemplate` <div class="vinyl-grid" data-astro-cid-zhjfx4fz> ${vinilos.map((vinilo) => {
    const imagen = vinilo.imagenPrincipalUrl || vinilo.imagenPrincipal?.sourceUrl || "/images/placeholder-vinyl.jpg";
    return renderTemplate`<div class="vinyl-card" data-astro-cid-zhjfx4fz> <div class="vinyl-image" data-astro-cid-zhjfx4fz> <img${addAttribute(imagen, "src")}${addAttribute(vinilo.imagenPrincipal?.altText || vinilo.title, "alt")} loading="lazy" onerror="this.src='/images/placeholder-vinyl.jpg'" data-astro-cid-zhjfx4fz> <div class="vinyl-overlay" data-astro-cid-zhjfx4fz> <a${addAttribute(`/vinilos/${vinilo.slug || vinilo.databaseId}`, "href")} class="vinyl-link" data-astro-cid-zhjfx4fz>
Ver Detalles
</a> </div> </div> <div class="vinyl-info" data-astro-cid-zhjfx4fz> <h3 class="vinyl-title-card" data-astro-cid-zhjfx4fz>${vinilo.title}</h3> </div> </div>`;
  })} </div> <nav class="pagination" data-astro-cid-zhjfx4fz> <ul data-astro-cid-zhjfx4fz> <li data-astro-cid-zhjfx4fz> ${page > 1 ? renderTemplate`<a${addAttribute(buildSearchUrl(page - 1), "href")} class="pagination-link" data-astro-cid-zhjfx4fz>Anterior</a>` : renderTemplate`<span class="pagination-link disabled" data-astro-cid-zhjfx4fz>Anterior</span>`} </li> ${paginasVisibles.map((p) => renderTemplate`<li data-astro-cid-zhjfx4fz> ${p === page ? renderTemplate`<span class="pagination-link current" data-astro-cid-zhjfx4fz>${p}</span>` : renderTemplate`<a${addAttribute(buildSearchUrl(p), "href")} class="pagination-link" data-astro-cid-zhjfx4fz>${p}</a>`} </li>`)} <li data-astro-cid-zhjfx4fz> ${page < totalPages ? renderTemplate`<a${addAttribute(buildSearchUrl(page + 1), "href")} class="pagination-link" data-astro-cid-zhjfx4fz>Siguiente</a>` : renderTemplate`<span class="pagination-link disabled" data-astro-cid-zhjfx4fz>Siguiente</span>`} </li> </ul> </nav> ` })}` : renderTemplate`<div class="no-vinyl" data-astro-cid-zhjfx4fz> <div class="no-vinyl-icon" data-astro-cid-zhjfx4fz>📀</div> <h3 data-astro-cid-zhjfx4fz>No hay vinilos disponibles</h3> <p data-astro-cid-zhjfx4fz>Los vinilos aparecerán aquí cuando sean publicados en WordPress.</p> </div>`} </div> </section> ` })}`} </div> ` })}  ${renderScript($$result, "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/vinilos/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/vinilos/index.astro", void 0);

const $$file = "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/vinilos/index.astro";
const $$url = "/vinilos.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
