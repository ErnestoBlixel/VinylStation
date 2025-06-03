/* empty css                                    */
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, F as Fragment, d as addAttribute } from '../../chunks/astro/server_DfIlsqH_.mjs';
import 'kleur/colors';
import { g as getSiteInfo, c as getPageData, $ as $$MainLayout, i as getVinilos } from '../../chunks/MainLayout_CruwIgCf.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://vinylstation.com");
async function getStaticPaths({ paginate }) {
  try {
    console.log("\u{1F680} [DEBUG] Iniciando getStaticPaths...");
    console.log("\u{1F4C0} [DEBUG] Llamando a getVinilos...");
    const vinilosData = await getVinilos({ limit: 200 });
    const allVinilos = vinilosData?.vinilos || [];
    console.log(`\u{1F4C0} [DEBUG] Total vinilos cargados: ${allVinilos.length}`);
    console.log(`\u{1F4C0} [DEBUG] Primer vinilo:`, allVinilos[0] ? { title: allVinilos[0].title, slug: allVinilos[0].slug } : "No hay vinilos");
    if (allVinilos.length === 0) {
      console.warn("\u26A0\uFE0F [DEBUG] No se encontraron vinilos, creando datos mock...");
      const mockVinilos = Array.from({ length: 60 }, (_, i) => ({
        databaseId: `mock-${i + 1}`,
        title: `Vinilo Mock ${i + 1}`,
        slug: `vinilo-mock-${i + 1}`,
        date: (/* @__PURE__ */ new Date()).toISOString(),
        imagenPrincipalUrl: "/images/placeholder-vinyl.jpg",
        imagenPrincipal: { sourceUrl: "/images/placeholder-vinyl.jpg", altText: `Mock ${i + 1}` },
        excerpt: `Descripci\xF3n del vinilo mock ${i + 1}`,
        camposVinilo: {
          vsPrecio: `${10 + i}\u20AC`,
          vsArtista: `Artista Mock ${i + 1}`,
          vsAlbum: `\xC1lbum Mock ${i + 1}`
        },
        seo: {
          title: `Vinilo Mock ${i + 1} | VinylStation`,
          metaDesc: `Descripci\xF3n del vinilo mock ${i + 1}`
        }
      }));
      console.log(`\u{1F504} [DEBUG] Generando p\xE1ginas con ${mockVinilos.length} vinilos mock`);
      const pages2 = paginate(mockVinilos, { pageSize: 20 });
      console.log(`\u2705 [DEBUG] P\xE1ginas generadas: ${pages2.length}`);
      return pages2;
    }
    console.log("\u{1F504} [DEBUG] Generando p\xE1ginas con vinilos reales...");
    const pages = paginate(allVinilos, { pageSize: 20 });
    console.log(`\u2705 [DEBUG] P\xE1ginas generadas: ${pages.length}`);
    return pages;
  } catch (error) {
    console.error("\u274C [DEBUG] Error en getStaticPaths:", error.message);
    console.error("\u274C [DEBUG] Stack:", error.stack);
    const fallbackVinilos = Array.from({ length: 20 }, (_, i) => ({
      databaseId: `fallback-${i + 1}`,
      title: `Vinilo Fallback ${i + 1}`,
      slug: `vinilo-fallback-${i + 1}`,
      date: (/* @__PURE__ */ new Date()).toISOString(),
      imagenPrincipalUrl: "/images/placeholder-vinyl.jpg",
      imagenPrincipal: { sourceUrl: "/images/placeholder-vinyl.jpg", altText: `Fallback ${i + 1}` },
      excerpt: `Descripci\xF3n del vinilo fallback ${i + 1}`,
      camposVinilo: {
        vsPrecio: "15\u20AC",
        vsArtista: `Artista Fallback ${i + 1}`,
        vsAlbum: `\xC1lbum Fallback ${i + 1}`
      },
      seo: {
        title: `Vinilo Fallback ${i + 1} | VinylStation`,
        metaDesc: `Descripci\xF3n del vinilo fallback ${i + 1}`
      }
    }));
    console.log("\u{1F504} [DEBUG] Generando p\xE1ginas fallback...");
    const fallbackPages = paginate(fallbackVinilos, { pageSize: 20 });
    console.log(`\u2705 [DEBUG] P\xE1ginas fallback generadas: ${fallbackPages.length}`);
    return fallbackPages;
  }
}
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { page: pageParam } = Astro2.params ?? {};
  if (Array.isArray(pageParam) && pageParam.length === 1 && pageParam[0] === "1") {
    return Astro2.redirect("/vinilos");
  }
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
  const { page } = Astro2.props;
  const siteInfo = await getSiteInfo();
  const pageData = await getPageData("vinilos");
  const vinilos = page.data;
  const totalVinilosCount = page.total;
  const paginaActual = page.currentPage;
  const totalPaginas = page.lastPage;
  console.log("\u{1F4CA} P\xE1gina generada:", {
    currentPage: page.currentPage,
    total: page.total,
    vinilosInPage: vinilos.length,
    lastPage: page.lastPage
  });
  const heroTitle = pageData?.title || "Nuestra Colecci\xF3n de Vinilos";
  const heroDescription = pageData?.excerpt || "Descubre nuestra selecci\xF3n de vinilos exclusivos, \xE1lbumes raros y ediciones especiales";
  const pageTitle = pageData?.seo?.title || `${heroTitle} - VinylStation`;
  const pageDescription = pageData?.seo?.metaDesc || heroDescription;
  const totalArtistasUnicos = Math.floor(totalVinilosCount * 0.3);
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `${pageTitle} | ${siteInfo?.title || "VinylStation"}`, "description": pageDescription, "data-astro-cid-jj44g3je": true }, { "default": async ($$result2) => renderTemplate`${vinilos.length === 0 ? renderTemplate`${maybeRenderHead()}<div class="container" data-astro-cid-jj44g3je> <div class="error-container" data-astro-cid-jj44g3je> <div class="error-icon" data-astro-cid-jj44g3je>📀</div> <h1 class="error-title" data-astro-cid-jj44g3je>No hay vinilos disponibles</h1> <p class="error-message" data-astro-cid-jj44g3je>Los vinilos aparecerán aquí cuando sean publicados en WordPress.</p> <div class="error-actions" data-astro-cid-jj44g3je> <a href="/" class="btn secondary-btn" data-astro-cid-jj44g3je>← Volver al inicio</a> </div> </div> </div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-jj44g3je": true }, { "default": async ($$result3) => renderTemplate`  <div class="container" data-astro-cid-jj44g3je> <header class="page-header" data-astro-cid-jj44g3je> ${siteInfo.logo?.url && renderTemplate`<div class="site-icon-container" data-astro-cid-jj44g3je> <img${addAttribute(siteInfo.logo.url, "src")}${addAttribute(siteInfo.logo.altText || "Logo", "alt")} class="site-icon" data-astro-cid-jj44g3je> </div>`} <h1 data-astro-cid-jj44g3je>${heroTitle}</h1> <p class="page-description" data-astro-cid-jj44g3je>${heroDescription}</p> <div class="vinyl-stats" data-astro-cid-jj44g3je> <div class="stat-card" data-astro-cid-jj44g3je>  <span class="stat-number" data-astro-cid-jj44g3je>${totalVinilosCount}</span> <span class="stat-label" data-astro-cid-jj44g3je>Vinilos</span> </div> <div class="stat-card" data-astro-cid-jj44g3je>  <span class="stat-number" data-astro-cid-jj44g3je>${totalArtistasUnicos}</span> <span class="stat-label" data-astro-cid-jj44g3je>Artistas</span> </div> <div class="stat-card" data-astro-cid-jj44g3je> <span class="stat-number" data-astro-cid-jj44g3je>33⅓</span> <span class="stat-label" data-astro-cid-jj44g3je>RPM</span> </div> </div> <div class="hero-actions" data-astro-cid-jj44g3je> <a href="/programas" class="btn secondary-btn" data-astro-cid-jj44g3je>Ver Programas</a> <a href="#vinilos" class="btn primary-btn" data-astro-cid-jj44g3je>Ver Vinilos</a> </div> </header> </div>  <section id="vinilos" class="vinyl-section" data-astro-cid-jj44g3je> <div class="vinyl-container" data-astro-cid-jj44g3je> <h2 class="vinyl-title" data-astro-cid-jj44g3je>Todos los Vinilos</h2> <div class="vinyl-grid" data-astro-cid-jj44g3je> ${vinilos.map((vinilo) => {
    const imagen = vinilo.imagenPrincipalUrl || vinilo.imagenPrincipal?.sourceUrl || "/images/placeholder-vinyl.jpg";
    const rawDesc = vinilo.excerpt || `Vinilo "${vinilo.title}" - Disponible en VinylStation`;
    const descripcion = stripHtml(rawDesc);
    const artista = vinilo.camposVinilo?.vsArtista || "";
    const album = vinilo.camposVinilo?.vsAlbum || "";
    const precio = vinilo.camposVinilo?.vsPrecio || "";
    const fechaPublicacion = formatDate(vinilo.date);
    return renderTemplate`<article class="vinyl-card" data-astro-cid-jj44g3je> <div class="vinyl-image" data-astro-cid-jj44g3je> <img${addAttribute(imagen, "src")}${addAttribute(vinilo.imagenPrincipal?.altText || vinilo.title, "alt")} loading="lazy" onerror="this.src='/images/placeholder-vinyl.jpg'" data-astro-cid-jj44g3je> <div class="vinyl-overlay" data-astro-cid-jj44g3je> <a${addAttribute(`/vinilos/${vinilo.slug || vinilo.databaseId}`, "href")} class="vinyl-link" data-astro-cid-jj44g3je>
Ver Detalles
</a> </div> ${precio && renderTemplate`<div class="vinyl-price" data-astro-cid-jj44g3je> <span class="price-badge" data-astro-cid-jj44g3je>${precio}</span> </div>`} </div> <div class="vinyl-info" data-astro-cid-jj44g3je> <h3 class="vinyl-title-card" data-astro-cid-jj44g3je>${vinilo.title}</h3> ${artista && renderTemplate`<p class="vinyl-artist" data-astro-cid-jj44g3je>Por ${artista}</p>`} ${album && renderTemplate`<p class="vinyl-album" data-astro-cid-jj44g3je>Álbum: ${album}</p>`} <p class="vinyl-description" data-astro-cid-jj44g3je>${descripcion}</p> <div class="vinyl-meta" data-astro-cid-jj44g3je> <time class="vinyl-date" data-astro-cid-jj44g3je>${fechaPublicacion}</time> ${precio && renderTemplate`<span class="vinyl-price-meta" data-astro-cid-jj44g3je>${precio}</span>`} </div> </div> </article>`;
  })} </div>  ${totalPaginas > 1 && renderTemplate`<nav class="pagination-nav" aria-label="Paginación de vinilos" data-astro-cid-jj44g3je> ${page.url.prev && renderTemplate`<a${addAttribute(page.url.prev, "href")} class="pagination-link prev" data-astro-cid-jj44g3je>
« Anterior
</a>`} <span class="pagination-info" data-astro-cid-jj44g3je>
Página ${paginaActual} de ${totalPaginas} (${vinilos.length} vinilos por página, ${totalVinilosCount} total)
</span> ${page.url.next && renderTemplate`<a${addAttribute(page.url.next, "href")} class="pagination-link next" data-astro-cid-jj44g3je>
Siguiente »
</a>`} </nav>`} </div> </section> ` })}`}` })} `;
}, "C:/Users/nestu/Desktop/web vinylstation/astro_30-05/src/pages/vinilos/[...page].astro", void 0);

const $$file = "C:/Users/nestu/Desktop/web vinylstation/astro_30-05/src/pages/vinilos/[...page].astro";
const $$url = "/vinilos/[...page].html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
