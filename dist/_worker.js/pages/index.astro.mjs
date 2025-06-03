globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { c as createComponent, r as renderComponent, b as renderScript, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_DfYyg2vJ.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_BO0IMRcn.mjs';
import { g as getSiteInfo, a as getPageData, h as getProgramas, d as getNoticiasPaginadas } from '../chunks/wordpress_iKskd3ty.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
  };
  let hasError = false;
  let errorMessage = "";
  let siteInfo = null;
  let pageData = null;
  let programasData = null;
  let noticiasData = null;
  try {
    siteInfo = await getSiteInfo();
    pageData = await getPageData("home");
    programasData = await getProgramas({ limit: 50 });
    noticiasData = await getNoticiasPaginadas({ page: 1, itemsPerPage: 12 });
    if (!siteInfo || !siteInfo.title) throw new Error("No se pudo obtener el t\xEDtulo del sitio desde WordPress");
    if (!siteInfo.description) throw new Error("No se pudo obtener la descripci\xF3n del sitio desde WordPress");
  } catch (error) {
    hasError = true;
    errorMessage = `Error conectando con WordPress: ${error.message}`;
  }
  const programas = hasError ? [] : programasData?.programas || [];
  const noticias = hasError ? [] : noticiasData?.noticias || [];
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  const heroTitle = hasError ? null : siteInfo?.title || pageData?.title;
  const heroDescription = hasError ? null : siteInfo?.description || pageData?.excerpt;
  hasError ? null : siteInfo?.logo?.url || pageData?.featuredImage?.url || "";
  hasError ? "" : siteInfo?.logo?.altText || pageData?.featuredImage?.altText || "Logo";
  const pageTitle = hasError ? "Error - VinylStation" : pageData?.seo?.title || `${siteInfo?.title}`;
  const pageDescription = hasError ? "Error cargando contenido" : pageData?.seo?.metaDesc || siteInfo?.description;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": pageTitle, "description": pageDescription, "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="main-content" data-astro-cid-j7pv25f6> <div class="container hero-container" data-astro-cid-j7pv25f6> ${hasError ? (
    // Vista de ERROR
    renderTemplate`<div class="error-container" data-astro-cid-j7pv25f6> <div class="error-icon" data-astro-cid-j7pv25f6>⚠️</div> <h1 class="error-title" data-astro-cid-j7pv25f6>Error de Conexión</h1> <p class="error-message" data-astro-cid-j7pv25f6>${errorMessage}</p> <div class="error-details" data-astro-cid-j7pv25f6> <h3 data-astro-cid-j7pv25f6>Detalles técnicos:</h3> <ul data-astro-cid-j7pv25f6> <li data-astro-cid-j7pv25f6>Verificar conexión a: https://cms.vinylstation.es/graphql</li> <li data-astro-cid-j7pv25f6>Comprobar que WordPress esté funcionando</li> <li data-astro-cid-j7pv25f6>Revisar configuración de GraphQL</li> </ul> </div> <div class="error-actions" data-astro-cid-j7pv25f6> <button onclick="window.location.reload()" class="btn primary-btn" data-astro-cid-j7pv25f6>
🔄 Reintentar
</button> </div> </div>`
  ) : (
    // Vista NORMAL con datos reales
    renderTemplate`<header class="page-header" data-astro-cid-j7pv25f6> ${renderTemplate`<div class="site-icon-container" data-astro-cid-j7pv25f6> <img src="/images/logos/logo vinylstation.png" alt="VinylStation Logo" class="site-icon" data-astro-cid-j7pv25f6> </div>`} <h1 data-astro-cid-j7pv25f6>${heroTitle}</h1> <p class="page-description" data-astro-cid-j7pv25f6>${heroDescription}</p> <div class="radio-player-widget" data-astro-cid-j7pv25f6> <div class="radio-player-minimal" data-astro-cid-j7pv25f6> <audio id="radio-audio-index" preload="none" data-stream-url="https://stream.zeno.fm/4g7qxnxrloluv" data-astro-cid-j7pv25f6></audio> <div class="player-controls" data-astro-cid-j7pv25f6> <button id="play-pause-index" class="play-button" aria-label="Reproducir/Pausar" data-astro-cid-j7pv25f6> <svg id="play-icon-index" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-j7pv25f6> <polygon points="5,3 19,12 5,21" data-astro-cid-j7pv25f6></polygon> </svg> <svg id="pause-icon-index" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;" data-astro-cid-j7pv25f6> <rect x="6" y="4" width="4" height="16" data-astro-cid-j7pv25f6></rect> <rect x="14" y="4" width="4" height="16" data-astro-cid-j7pv25f6></rect> </svg> </button> <div class="status-info" data-astro-cid-j7pv25f6> <span id="status-text-index" data-astro-cid-j7pv25f6>Radio en vivo</span> <div id="loading-indicator-index" class="loading-dot" style="display: none;" data-astro-cid-j7pv25f6></div> </div> <div class="volume-control" data-astro-cid-j7pv25f6> <button id="volume-toggle-index" class="volume-button" aria-label="Silenciar/Activar sonido" data-astro-cid-j7pv25f6> <svg id="volume-on-index" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-j7pv25f6> <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" data-astro-cid-j7pv25f6></polygon> <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" data-astro-cid-j7pv25f6></path> </svg> <svg id="volume-off-index" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;" data-astro-cid-j7pv25f6> <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" data-astro-cid-j7pv25f6></polygon> <line x1="23" y1="9" x2="17" y2="15" data-astro-cid-j7pv25f6></line> <line x1="17" y1="9" x2="23" y2="15" data-astro-cid-j7pv25f6></line> </svg> </button> <input type="range" id="volume-slider-index" class="volume-slider" min="0" max="1" step="0.1" value="0.7" data-astro-cid-j7pv25f6> </div> </div> </div> </div> </header>`
  )} </div> <!-- Sección de Programas integrada sin líneas de corte --> <section class="programs-section" data-astro-cid-j7pv25f6> <div class="container" data-astro-cid-j7pv25f6> <div class="section-header" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>Nuestros Programas de Radio</h2> <p data-astro-cid-j7pv25f6>Sumérgete en la magia del vinilo con nuestra programación especializada. Cada programa es una experiencia única que celebra la cultura musical en formato analógico.</p> </div> <!-- Grid de Programas - 2 filas x 6 columnas --> <div class="programs-grid" data-astro-cid-j7pv25f6> ${programas.length > 0 ? programas.slice(0, 12).map((programa) => {
    const imagen = programa.imagenPrincipalUrl || programa.imagenPrincipal?.sourceUrl || "/images/placeholder-radio.jpg";
    return renderTemplate`<div class="program-card-grid" data-astro-cid-j7pv25f6> <div class="program-image-grid" data-astro-cid-j7pv25f6> <img${addAttribute(imagen, "src")}${addAttribute(programa.imagenPrincipal?.altText || programa.title, "alt")} onerror="this.src='/images/placeholder-radio.jpg'" data-astro-cid-j7pv25f6> <div class="program-overlay-grid" data-astro-cid-j7pv25f6> <button class="play-btn-grid" data-astro-cid-j7pv25f6>▶️</button> </div> </div> <div class="program-title-grid" data-astro-cid-j7pv25f6> <h3 data-astro-cid-j7pv25f6>${programa.title}</h3> </div> </div>`;
  }) : renderTemplate`<div class="no-programs" data-astro-cid-j7pv25f6> <div class="no-programs-icon" data-astro-cid-j7pv25f6>📻</div> <h3 data-astro-cid-j7pv25f6>No hay programas disponibles</h3> <p data-astro-cid-j7pv25f6>Los programas aparecerán aquí cuando sean publicados en WordPress.</p> </div>`} </div> <div class="section-footer" data-astro-cid-j7pv25f6> <a href="/programas" class="btn primary-btn" data-astro-cid-j7pv25f6>Ver Todos los Programas</a> </div> </div> </section> <!-- Sección de Noticias --> <section class="news-section" data-astro-cid-j7pv25f6> <div class="container" data-astro-cid-j7pv25f6> <div class="section-header" data-astro-cid-j7pv25f6> <h2 data-astro-cid-j7pv25f6>Últimas Noticias</h2> <p data-astro-cid-j7pv25f6>Mantente al día con las últimas novedades del mundo del vinilo, lanzamientos exclusivos y todo lo que acontece en la escena musical analógica.</p> </div> <!-- Slider de Noticias --> <div class="news-slider" data-astro-cid-j7pv25f6> <div class="slider-viewport" data-astro-cid-j7pv25f6> <div class="slider-container" id="newsSlider" data-astro-cid-j7pv25f6> ${noticias.length > 0 ? noticias.map((noticia) => {
    const imagen = noticia.imagenDestacadaUrl || noticia.featuredImage?.node?.sourceUrl || "/images/placeholder-news.jpg";
    const rawDesc = noticia.excerpt || `Noticia "${noticia.title}" - \xDAltimas noticias de VinylStation`;
    const descripcion = stripHtml(rawDesc);
    const categoriasNoticia = noticia.categorias?.nodes || [];
    const fechaPublicacion = formatDate(noticia.date);
    const categoria = categoriasNoticia.length > 0 ? categoriasNoticia[0].name : "M\xFAsica";
    return renderTemplate`<article class="news-card-slider" data-astro-cid-j7pv25f6> <div class="news-image-slider" data-astro-cid-j7pv25f6> <img${addAttribute(imagen, "src")}${addAttribute(noticia.featuredImage?.node?.altText || noticia.title, "alt")} loading="lazy" onerror="this.src='/images/placeholder-news.jpg'" data-astro-cid-j7pv25f6> <div class="news-overlay-slider" data-astro-cid-j7pv25f6> <div class="news-category" data-astro-cid-j7pv25f6>${categoria}</div> </div> </div> <div class="news-content-slider" data-astro-cid-j7pv25f6> <div class="news-meta" data-astro-cid-j7pv25f6> <span class="news-date" data-astro-cid-j7pv25f6>${fechaPublicacion}</span> <span class="news-author" data-astro-cid-j7pv25f6>VinylStation</span> </div> <h3 data-astro-cid-j7pv25f6>${noticia.title}</h3> <p class="news-excerpt" data-astro-cid-j7pv25f6>${descripcion}</p> <a${addAttribute(`/noticias/${noticia.slug || noticia.id}`, "href")} class="news-link" data-astro-cid-j7pv25f6>Leer más</a> </div> </article>`;
  }) : renderTemplate`<div class="no-news-slider" data-astro-cid-j7pv25f6> <div class="no-news-icon" data-astro-cid-j7pv25f6>📰</div> <h3 data-astro-cid-j7pv25f6>No hay noticias disponibles</h3> <p data-astro-cid-j7pv25f6>Las noticias aparecerán aquí cuando sean publicadas en WordPress.</p> </div>`} </div> </div> <!-- Controles del slider de noticias --> <div class="slider-controls news-controls" data-astro-cid-j7pv25f6> <button class="slider-btn prev-btn" id="newsPrevBtn" data-astro-cid-j7pv25f6>‹</button> <div class="slider-dots" id="newsSliderDots" data-astro-cid-j7pv25f6></div> <button class="slider-btn next-btn" id="newsNextBtn" data-astro-cid-j7pv25f6>›</button> </div> </div> <div class="section-footer" data-astro-cid-j7pv25f6> <a href="/noticias" class="btn primary-btn" data-astro-cid-j7pv25f6>Ver Todas las Noticias</a> </div> </div> </section> </div> ` })} <!-- Script para el grid de programas, slider de noticias y reproductor de radio --> ${renderScript($$result, "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/index.astro?astro&type=script&index=0&lang.ts")} `;
}, "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/index.astro", void 0);

const $$file = "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
