globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, F as Fragment, d as addAttribute } from '../chunks/astro/server_DfYyg2vJ.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_BO0IMRcn.mjs';
import { g as getSiteInfo, a as getPageData, h as getProgramas } from '../chunks/wordpress_iKskd3ty.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const stripHtml = (html) => html?.replace?.(/<[^>]*>/g, "").trim() || "";
  let hasError = false;
  let errorMessage = "";
  let siteInfo = null;
  let pageData = null;
  let programasData = null;
  try {
    siteInfo = await getSiteInfo();
    pageData = await getPageData("programas");
    programasData = await getProgramas({ limit: 50 });
    if (!siteInfo || !siteInfo.title) {
      throw new Error("No se pudo obtener el t\xEDtulo del sitio desde WordPress");
    }
  } catch (error) {
    hasError = true;
    errorMessage = `Error conectando con WordPress: ${error.message}`;
  }
  const programas = hasError ? [] : programasData?.programas || [];
  const heroTitle = hasError ? null : pageData?.title || "Nuestra Programaci\xF3n";
  const heroDescription = hasError ? null : pageData?.excerpt || "Programas especializados dedicados a la mejor m\xFAsica en vinilo";
  const pageTitle = hasError ? "Error - Programas" : pageData?.seo?.title || `${heroTitle} - VinylStation`;
  const pageDescription = hasError ? "Error cargando contenido" : pageData?.seo?.metaDesc || heroDescription;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": pageTitle, "description": pageDescription, "data-astro-cid-zxjzbdpw": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="main-content" data-astro-cid-zxjzbdpw> ${hasError ? renderTemplate`<div class="container hero-container" data-astro-cid-zxjzbdpw> <div class="error-container" data-astro-cid-zxjzbdpw> <div class="error-icon" data-astro-cid-zxjzbdpw>📻</div> <h1 class="error-title" data-astro-cid-zxjzbdpw>Error Cargando Programas</h1> <p class="error-message" data-astro-cid-zxjzbdpw>${errorMessage}</p> <div class="error-details" data-astro-cid-zxjzbdpw> <h3 data-astro-cid-zxjzbdpw>Posibles soluciones:</h3> <ul data-astro-cid-zxjzbdpw> <li data-astro-cid-zxjzbdpw>Verificar conexión a: https://cms.vinylstation.es/graphql</li> <li data-astro-cid-zxjzbdpw>Comprobar que WordPress esté funcionando</li> <li data-astro-cid-zxjzbdpw>Revisar configuración de GraphQL y ACF</li> <li data-astro-cid-zxjzbdpw>Verificar que los programas tengan campos configurados</li> </ul> </div> <div class="error-actions" data-astro-cid-zxjzbdpw> <button onclick="window.location.reload()" class="btn primary-btn" data-astro-cid-zxjzbdpw>
🔄 Reintentar
</button> <a href="/" class="btn secondary-btn" data-astro-cid-zxjzbdpw>← Volver al inicio</a> </div> </div> </div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-zxjzbdpw": true }, { "default": async ($$result3) => renderTemplate`<div class="container hero-container" data-astro-cid-zxjzbdpw> <header class="page-header" data-astro-cid-zxjzbdpw> <div class="site-icon-container" data-astro-cid-zxjzbdpw> <img src="/images/logos/logo vinylstation.png" alt="VinylStation Logo" class="site-icon" data-astro-cid-zxjzbdpw> </div> <h1 data-astro-cid-zxjzbdpw>${heroTitle}</h1> <p class="page-description" data-astro-cid-zxjzbdpw>${heroDescription}</p> <div class="program-stats" data-astro-cid-zxjzbdpw> <div class="stat-card" data-astro-cid-zxjzbdpw> <span class="stat-number" data-astro-cid-zxjzbdpw>${programas.length}</span> <span class="stat-label" data-astro-cid-zxjzbdpw>Programas</span> </div> <div class="stat-card" data-astro-cid-zxjzbdpw> <span class="stat-number" data-astro-cid-zxjzbdpw>24h</span> <span class="stat-label" data-astro-cid-zxjzbdpw>Al Aire</span> </div> <div class="stat-card" data-astro-cid-zxjzbdpw> <span class="stat-number" data-astro-cid-zxjzbdpw>7</span> <span class="stat-label" data-astro-cid-zxjzbdpw>Días</span> </div> <div class="stat-card" data-astro-cid-zxjzbdpw> <span class="stat-number" data-astro-cid-zxjzbdpw>∞</span> <span class="stat-label" data-astro-cid-zxjzbdpw>Música</span> </div> </div> <div class="hero-actions" data-astro-cid-zxjzbdpw> <a href="/vinilos" class="btn secondary-btn" data-astro-cid-zxjzbdpw>Explorar Vinilos</a> <a href="#programas" class="btn primary-btn" data-astro-cid-zxjzbdpw>Ver Programas</a> </div> </header> </div> <section id="programas" class="programs-section" data-astro-cid-zxjzbdpw> <div class="container" data-astro-cid-zxjzbdpw> <div class="section-header" data-astro-cid-zxjzbdpw> <h2 data-astro-cid-zxjzbdpw>Todos los Programas</h2> <p data-astro-cid-zxjzbdpw>
Descubre nuestra programación especializada. Cada programa es una experiencia única dedicada a explorar diferentes géneros, épocas y estilos de la música en vinilo.
</p> </div> ${programas.length > 0 ? renderTemplate`<div class="programs-grid" data-astro-cid-zxjzbdpw> ${programas.map((programa, index) => {
    const imagen = programa.imagenPrincipalUrl || programa.imagenPrincipal?.sourceUrl || "/images/placeholder-radio.jpg";
    const rawDesc = programa.camposPrograma?.vsDescripcion || programa.excerpt || `Programa "${programa.title}" - M\xFAsica especializada en vinilo`;
    stripHtml(rawDesc);
    return renderTemplate`<div class="program-card"${addAttribute(`animation-delay: ${0.1 + index * 0.05}s`, "style")} data-astro-cid-zxjzbdpw> <div class="program-image" data-astro-cid-zxjzbdpw> <img${addAttribute(imagen, "src")}${addAttribute(programa.imagenPrincipal?.altText || programa.title, "alt")} loading="lazy" onerror="this.src='/images/placeholder-radio.jpg'" data-astro-cid-zxjzbdpw> <div class="program-overlay" data-astro-cid-zxjzbdpw> <a${addAttribute(`/programas/${programa.slug || programa.id}`, "href")} class="program-link" data-astro-cid-zxjzbdpw>
Ver Programa
</a> </div> </div> <div class="program-info" data-astro-cid-zxjzbdpw> <h3 class="program-title-card" data-astro-cid-zxjzbdpw>${programa.title}</h3> </div> </div>`;
  })} </div>` : renderTemplate`<div class="no-programs" data-astro-cid-zxjzbdpw> <div class="no-programs-icon" data-astro-cid-zxjzbdpw>🎵</div> <h3 data-astro-cid-zxjzbdpw>No hay programas disponibles</h3> <p data-astro-cid-zxjzbdpw>Los programas aparecerán aquí cuando sean configurados en WordPress.</p> </div>`} </div> </section> ` })}`} </div> ` })} `;
}, "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/programas/index.astro", void 0);

const $$file = "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/programas/index.astro";
const $$url = "/programas.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
