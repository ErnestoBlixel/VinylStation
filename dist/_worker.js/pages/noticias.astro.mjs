globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, F as Fragment, d as addAttribute } from '../chunks/astro/server_DfYyg2vJ.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_BO0IMRcn.mjs';
import { g as getSiteInfo, a as getPageData, d as getNoticiasPaginadas, e as getCategoriasNoticias } from '../chunks/wordpress_iKskd3ty.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://vinylstation.com");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const stripHtml = (html) => html?.replace?.(/<[^>]*>/g, "").trim() || "";
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  const itemsPerPage = 12;
  const url = new URL(Astro2.request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("p") || "1", 10));
  const categoria = url.searchParams.get("categoria") || "all";
  let hasError = false;
  let errorMessage = "";
  let siteInfo = null;
  let pageData = null;
  let noticiasData = null;
  let categoriasData = null;
  try {
    siteInfo = await getSiteInfo();
    pageData = await getPageData("noticias");
    console.log("\u{1F50D} Intentando obtener noticias...");
    noticiasData = await getNoticiasPaginadas({
      page,
      itemsPerPage,
      categoria: categoria !== "all" ? categoria : null
    });
    console.log("\u{1F4CA} Datos de noticias recibidos:", {
      noticias: noticiasData?.noticias?.length || 0,
      total: noticiasData?.pageInfo?.total || 0,
      hasError: !noticiasData || !noticiasData.noticias
    });
    categoriasData = await getCategoriasNoticias();
    if (!siteInfo || !siteInfo.title) {
      throw new Error("No se pudo obtener el t\xEDtulo del sitio desde WordPress");
    }
  } catch (error) {
    hasError = true;
    errorMessage = `Error conectando con WordPress: ${error.message}`;
    console.error("\u274C Error en p\xE1gina de noticias:", error);
  }
  const noticias = hasError ? [] : noticiasData?.noticias || [];
  const categorias = hasError ? [] : categoriasData?.categorias || [];
  const pageInfo = noticiasData?.pageInfo || {};
  const totalPages = pageInfo.totalPages || 1;
  const totalNoticias = pageInfo.totalNoticias || pageInfo.total || noticias.length;
  console.log("\u{1F4DD} Estado final de noticias:", {
    hasError,
    noticiasLength: noticias.length,
    totalNoticias,
    categoriasLength: categorias.length,
    primerNoticia: noticias[0]?.title || "No hay noticias"
  });
  const heroTitle = hasError ? null : pageData?.title || "\xDAltimas Noticias";
  const heroDescription = hasError ? null : pageData?.excerpt || "Mantente al d\xEDa con las \xFAltimas noticias de m\xFAsica, vinilo y cultura musical";
  const pageTitle = hasError ? "Error - Noticias" : pageData?.seo?.title || `${heroTitle} - VinylStation`;
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
  const buildUrl = (pageNum, cat = categoria) => {
    const params = new URLSearchParams();
    if (pageNum > 1) params.set("p", pageNum);
    if (cat !== "all") params.set("categoria", cat);
    const queryString = params.toString();
    return queryString ? `/noticias?${queryString}` : "/noticias";
  };
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": pageTitle, "description": pageDescription, "data-astro-cid-memwiw23": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="main-content" data-astro-cid-memwiw23> ${hasError ? renderTemplate`<div class="container hero-container" data-astro-cid-memwiw23> <div class="error-container" data-astro-cid-memwiw23> <div class="error-icon" data-astro-cid-memwiw23>📰</div> <h1 class="error-title" data-astro-cid-memwiw23>Error Cargando Noticias</h1> <p class="error-message" data-astro-cid-memwiw23>${errorMessage}</p> <div class="error-details" data-astro-cid-memwiw23> <h3 data-astro-cid-memwiw23>Posibles soluciones:</h3> <ul data-astro-cid-memwiw23> <li data-astro-cid-memwiw23>Verificar conexión a: https://cms.vinylstation.es/graphql</li> <li data-astro-cid-memwiw23>Comprobar que WordPress esté funcionando</li> <li data-astro-cid-memwiw23>Revisar configuración de GraphQL y ACF</li> <li data-astro-cid-memwiw23>Verificar que las noticias tengan campos configurados</li> </ul> </div> <div class="error-actions" data-astro-cid-memwiw23> <button onclick="window.location.reload()" class="btn primary-btn" data-astro-cid-memwiw23>
🔄 Reintentar
</button> <a href="/" class="btn secondary-btn" data-astro-cid-memwiw23>← Volver al inicio</a> </div> </div> </div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-memwiw23": true }, { "default": async ($$result3) => renderTemplate`<div class="container hero-container" data-astro-cid-memwiw23> <header class="page-header" data-astro-cid-memwiw23> ${renderTemplate`<div class="site-icon-container" data-astro-cid-memwiw23> <img src="/images/logos/logo vinylstation.png" alt="VinylStation Logo" class="site-icon" data-astro-cid-memwiw23> </div>`} <h1 data-astro-cid-memwiw23>${heroTitle}</h1> <p class="page-description" data-astro-cid-memwiw23>${heroDescription}</p> <div class="news-stats" data-astro-cid-memwiw23> <div class="stat-card" data-astro-cid-memwiw23> <span class="stat-number" data-astro-cid-memwiw23>${totalNoticias}</span> <span class="stat-label" data-astro-cid-memwiw23>Noticias</span> </div> <div class="stat-card" data-astro-cid-memwiw23> <span class="stat-number" data-astro-cid-memwiw23>${categorias.length}</span> <span class="stat-label" data-astro-cid-memwiw23>Categorías</span> </div> <div class="stat-card" data-astro-cid-memwiw23> <span class="stat-number" data-astro-cid-memwiw23>24h</span> <span class="stat-label" data-astro-cid-memwiw23>Actualizadas</span> </div> </div> <div class="hero-actions" data-astro-cid-memwiw23> <a href="/programas" class="btn secondary-btn" data-astro-cid-memwiw23>Ver Programas</a> <a href="#noticias" class="btn primary-btn" data-astro-cid-memwiw23>Leer Noticias</a> </div> </header> </div> <section id="noticias" class="news-section" data-astro-cid-memwiw23> <div class="container" data-astro-cid-memwiw23> <div class="section-header" data-astro-cid-memwiw23> <h2 data-astro-cid-memwiw23> ${categoria === "all" ? "Todas las Noticias" : `Noticias de ${categorias.find((c) => c.slug === categoria)?.name || categoria}`} </h2> <p data-astro-cid-memwiw23>Noticias locales de la Comunidad de Madrid y Toledo, y de actualidad, deportes, salud, música...</p>  ${categorias.length > 0 && renderTemplate`<div class="categories-grid" data-astro-cid-memwiw23> <a href="/noticias"${addAttribute(`category-filter ${categoria === "all" ? "active" : ""}`, "class")} data-astro-cid-memwiw23>
Todas las Noticias
<span class="category-count" data-astro-cid-memwiw23>${totalNoticias}</span> </a> ${categorias.map((cat) => renderTemplate`<a${addAttribute(buildUrl(1, cat.slug), "href")}${addAttribute(`category-filter ${categoria === cat.slug ? "active" : ""}`, "class")} data-astro-cid-memwiw23> ${cat.name} <span class="category-count" data-astro-cid-memwiw23>${cat.count || 0}</span> </a>`)} </div>`} </div> ${noticias.length > 0 ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "data-astro-cid-memwiw23": true }, { "default": async ($$result4) => renderTemplate` <div class="news-grid" data-astro-cid-memwiw23> ${noticias.map((noticia) => {
    const imagen = noticia.imagenDestacadaUrl || noticia.featuredImage?.node?.sourceUrl || "/images/placeholder-news.jpg";
    const rawDesc = noticia.excerpt || `Noticia "${noticia.title}" - \xDAltimas noticias de VinylStation`;
    const descripcion = stripHtml(rawDesc);
    const categoriasNoticia = noticia.categorias?.nodes || [];
    const fechaPublicacion = formatDate(noticia.date);
    return renderTemplate`<article class="news-card" data-astro-cid-memwiw23> <div class="news-image" data-astro-cid-memwiw23> <img${addAttribute(imagen, "src")}${addAttribute(noticia.featuredImage?.node?.altText || noticia.title, "alt")} loading="lazy" onerror="this.src='/images/placeholder-news.jpg'" data-astro-cid-memwiw23> <div class="news-overlay" data-astro-cid-memwiw23> <a${addAttribute(`/noticias/${noticia.slug || noticia.id}`, "href")} class="news-link" data-astro-cid-memwiw23>
Leer Noticia
</a> </div> ${categoriasNoticia.length > 0 && renderTemplate`<div class="news-categories" data-astro-cid-memwiw23> ${categoriasNoticia.slice(0, 2).map((cat) => renderTemplate`<span class="category-badge"${addAttribute(cat.id, "key")} data-astro-cid-memwiw23>${cat.name}</span>`)} </div>`} </div> <div class="news-info" data-astro-cid-memwiw23> <h3 class="news-title-card" data-astro-cid-memwiw23>${noticia.title}</h3> <p class="news-description" data-astro-cid-memwiw23>${descripcion}</p> <div class="news-meta" data-astro-cid-memwiw23> <time class="news-date" data-astro-cid-memwiw23>${fechaPublicacion}</time>  </div> </div> </article>`;
  })} </div> <nav class="pagination" data-astro-cid-memwiw23> <ul data-astro-cid-memwiw23> <li data-astro-cid-memwiw23> ${page > 1 ? renderTemplate`<a${addAttribute(buildUrl(page - 1), "href")} class="pagination-link" data-astro-cid-memwiw23>Anterior</a>` : renderTemplate`<span class="pagination-link disabled" data-astro-cid-memwiw23>Anterior</span>`} </li> ${paginasVisibles.map((p) => renderTemplate`<li data-astro-cid-memwiw23> ${p === page ? renderTemplate`<span class="pagination-link current" data-astro-cid-memwiw23>${p}</span>` : renderTemplate`<a${addAttribute(buildUrl(p), "href")} class="pagination-link" data-astro-cid-memwiw23>${p}</a>`} </li>`)} <li data-astro-cid-memwiw23> ${page < totalPages ? renderTemplate`<a${addAttribute(buildUrl(page + 1), "href")} class="pagination-link" data-astro-cid-memwiw23>Siguiente</a>` : renderTemplate`<span class="pagination-link disabled" data-astro-cid-memwiw23>Siguiente</span>`} </li> </ul> </nav> ` })}` : renderTemplate`<div class="no-news" data-astro-cid-memwiw23> <div class="no-news-icon" data-astro-cid-memwiw23>📰</div> <h3 data-astro-cid-memwiw23>No hay noticias disponibles</h3> <p data-astro-cid-memwiw23>Las noticias aparecerán aquí cuando sean publicadas en WordPress.</p> </div>`} </div> </section> ` })}`} </div> ` })} `;
}, "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/noticias/index.astro", void 0);

const $$file = "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/noticias/index.astro";
const $$url = "/noticias.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
