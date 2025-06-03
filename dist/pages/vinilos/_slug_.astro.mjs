/* empty css                                    */
import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute, u as unescapeHTML } from '../../chunks/astro/server_DfIlsqH_.mjs';
import 'kleur/colors';
import { g as getSiteInfo, h as getViniloBySlug, $ as $$MainLayout, i as getVinilos } from '../../chunks/MainLayout_CruwIgCf.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://vinylstation.com");
async function getStaticPaths() {
  const { vinilos } = await getVinilos({ limit: 2e4 });
  console.log(`\u{1F3B5} Generando rutas est\xE1ticas para ${vinilos.length} vinilos`);
  return vinilos.map((v) => ({ params: { slug: v.slug }, props: { vinilo: v } }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const { vinilo } = Astro2.props;
  const siteInfo = await getSiteInfo();
  const data = vinilo || await getViniloBySlug(slug);
  if (!data) {
    return Astro2.redirect("/404");
  }
  const imagenVinilo = data.imagenPrincipalUrl || data.imagenPrincipal?.sourceUrl || data.featuredImage?.node?.sourceUrl || "/images/placeholder-vinyl.jpg";
  const altImagen = data.imagenPrincipal?.altText || data.featuredImage?.node?.altText || data.title;
  const pageTitle = data.seo?.title || `${data.title} - VinylStation`;
  const pageDescription = data.seo?.metaDesc || data.excerpt || `Descubre "${data.title}" en VinylStation.`;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `${pageTitle} | ${siteInfo.title}`, "description": pageDescription, "data-astro-cid-3sdnxbus": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="vinilo-page" data-astro-cid-3sdnxbus> <nav class="breadcrumbs" data-astro-cid-3sdnxbus> <div class="container" data-astro-cid-3sdnxbus> <a href="/" data-astro-cid-3sdnxbus>Inicio</a> <span class="separator" data-astro-cid-3sdnxbus>›</span> <a href="/vinilos" data-astro-cid-3sdnxbus>Vinilos</a> <span class="separator" data-astro-cid-3sdnxbus>›</span> <span class="current" data-astro-cid-3sdnxbus>${data.title}</span> </div> </nav> <section class="vinilo-details" data-astro-cid-3sdnxbus> <div class="container" data-astro-cid-3sdnxbus> <div class="vinilo-layout" data-astro-cid-3sdnxbus> <div class="vinilo-image-section" data-astro-cid-3sdnxbus> <div class="main-image" data-astro-cid-3sdnxbus> <img${addAttribute(imagenVinilo, "src")}${addAttribute(altImagen, "alt")} loading="lazy" onerror="this.onerror=null;this.src='/images/placeholder-vinyl.jpg';" data-astro-cid-3sdnxbus> <div class="vinilo-badge" data-astro-cid-3sdnxbus>VINILO</div> </div> </div> <div class="vinilo-info-section" data-astro-cid-3sdnxbus> <header class="vinilo-header" data-astro-cid-3sdnxbus> <h1 data-astro-cid-3sdnxbus>${data.title}</h1> </header> ${data.excerpt && renderTemplate`<div class="vinilo-description" data-astro-cid-3sdnxbus> <h4 data-astro-cid-3sdnxbus>Descripción</h4> <div class="content" data-astro-cid-3sdnxbus>${unescapeHTML(data.excerpt)}</div> </div>`} <div class="vinilo-meta" data-astro-cid-3sdnxbus> <h4 data-astro-cid-3sdnxbus>Información del Vinilo</h4> <div class="meta-grid" data-astro-cid-3sdnxbus> ${data.camposVinilo?.vsArtista && renderTemplate`<div class="meta-item" data-astro-cid-3sdnxbus> <strong data-astro-cid-3sdnxbus>Artista:</strong> <span data-astro-cid-3sdnxbus>${data.camposVinilo.vsArtista}</span> </div>`} ${data.camposVinilo?.vsAlbum && renderTemplate`<div class="meta-item" data-astro-cid-3sdnxbus> <strong data-astro-cid-3sdnxbus>Álbum:</strong> <span data-astro-cid-3sdnxbus>${data.camposVinilo.vsAlbum}</span> </div>`} ${data.camposVinilo?.vsPrecio && renderTemplate`<div class="meta-item" data-astro-cid-3sdnxbus> <strong data-astro-cid-3sdnxbus>Precio:</strong> <span data-astro-cid-3sdnxbus>${data.camposVinilo.vsPrecio}</span> </div>`} ${data.date && renderTemplate`<div class="meta-item" data-astro-cid-3sdnxbus> <strong data-astro-cid-3sdnxbus>Fecha de publicación:</strong> <span data-astro-cid-3sdnxbus>${new Date(data.date).toLocaleDateString("es-ES")}</span> </div>`} </div> </div> <div class="vinilo-actions" data-astro-cid-3sdnxbus> <a href="/vinilos" class="btn-back-vinilos" data-astro-cid-3sdnxbus>
← Volver a todos los vinilos
</a> </div> </div> </div> </div> </section> ${data.content && renderTemplate`<section class="vinilo-content" data-astro-cid-3sdnxbus> <div class="container" data-astro-cid-3sdnxbus> <h2 class="content-title" data-astro-cid-3sdnxbus>Contenido Completo</h2> <div class="content-body" data-astro-cid-3sdnxbus>${unescapeHTML(data.content)}</div> </div> </section>`} </div> ` })} `;
}, "C:/Users/nestu/Desktop/web vinylstation/astro_30-05/src/pages/vinilos/[slug].astro", void 0);

const $$file = "C:/Users/nestu/Desktop/web vinylstation/astro_30-05/src/pages/vinilos/[slug].astro";
const $$url = "/vinilos/[slug].html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
