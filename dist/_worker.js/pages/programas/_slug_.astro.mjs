globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                           */
import { e as createAstro, c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute, u as unescapeHTML } from '../../chunks/astro/server_DfYyg2vJ.mjs';
import { $ as $$MainLayout } from '../../chunks/MainLayout_BO0IMRcn.mjs';
import { g as getSiteInfo, f as getProgramaBySlug, h as getProgramas } from '../../chunks/wordpress_iKskd3ty.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://vinylstation.com");
async function getStaticPaths() {
  const { programas } = await getProgramas({ limit: 100 });
  return programas.map((p) => ({ params: { slug: p.slug }, props: { programa: p } }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const { programa } = Astro2.props;
  const siteInfo = await getSiteInfo();
  const data = programa || await getProgramaBySlug(slug);
  if (!data) {
    return Astro2.redirect("/404");
  }
  const imagenPrograma = data.imagenPrincipalUrl || data.imagenPrincipal?.sourceUrl || data.featuredImage?.node?.sourceUrl || "/images/placeholder-radio.jpg";
  const altImagen = data.imagenPrincipal?.altText || data.featuredImage?.node?.altText || data.title;
  const pageTitle = data.seo?.title || `${data.title} - VinylStation`;
  const pageDescription = data.seo?.metaDesc || data.camposPrograma?.vsDescripcion || `Escucha "${data.title}", programa en VinylStation Radio.`;
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": `${pageTitle} | ${siteInfo.title}`, "description": pageDescription, "data-astro-cid-k56v27mx": true }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="main-content" data-astro-cid-k56v27mx> <!-- Breadcrumbs --> <nav class="breadcrumbs" data-astro-cid-k56v27mx> <div class="container" data-astro-cid-k56v27mx> <a href="/" data-astro-cid-k56v27mx>Inicio</a> <span class="separator" data-astro-cid-k56v27mx>›</span> <a href="/programas" data-astro-cid-k56v27mx>Programas</a> <span class="separator" data-astro-cid-k56v27mx>›</span> <span class="current" data-astro-cid-k56v27mx>${data.title}</span> </div> </nav> <section class="programa-details" data-astro-cid-k56v27mx> <div class="container" data-astro-cid-k56v27mx> <div class="programa-layout" data-astro-cid-k56v27mx> <div class="programa-image-section" data-astro-cid-k56v27mx> <div class="main-image" data-astro-cid-k56v27mx> <img${addAttribute(imagenPrograma, "src")}${addAttribute(altImagen, "alt")} loading="lazy" onerror="this.onerror=null;this.src='/images/placeholder-radio.jpg';" data-astro-cid-k56v27mx> <div class="programa-badge" data-astro-cid-k56v27mx>PROGRAMA</div> </div> </div> <div class="programa-info-section" data-astro-cid-k56v27mx> <header class="programa-header" data-astro-cid-k56v27mx> <h1 data-astro-cid-k56v27mx>${data.title}</h1> </header> ${data.camposPrograma?.vsDescripcion && renderTemplate`<div class="programa-description" data-astro-cid-k56v27mx> <h4 data-astro-cid-k56v27mx>Sobre el programa</h4> <div class="content" data-astro-cid-k56v27mx>${unescapeHTML(data.camposPrograma.vsDescripcion)}</div> </div>`} <div class="programa-meta" data-astro-cid-k56v27mx> <h4 data-astro-cid-k56v27mx>Equipo / Locutor</h4> <div class="meta-grid" data-astro-cid-k56v27mx> ${data.camposPrograma?.vsEquipo?.nodes?.length ? data.camposPrograma.vsEquipo.nodes.map((m) => renderTemplate`<div class="meta-item"${addAttribute(m.id, "key")} data-astro-cid-k56v27mx> <strong data-astro-cid-k56v27mx>${m.title}</strong> </div>`) : renderTemplate`<div class="meta-item" data-astro-cid-k56v27mx>Aún no tenemos equipo o locutor asignado.</div>`} </div> </div> <div class="programa-actions" data-astro-cid-k56v27mx> <a href="/programas" class="btn primary-btn" data-astro-cid-k56v27mx>
← Volver a todos los programas
</a> </div> </div> </div> </div> </section> <section class="programa-listas" data-astro-cid-k56v27mx> <div class="container" data-astro-cid-k56v27mx> <h2 class="programs-title" data-astro-cid-k56v27mx>Listas de Canciones</h2> ${data.camposPrograma?.vsListasDeCanciones?.length ? renderTemplate`<ul class="song-list" data-astro-cid-k56v27mx> ${data.camposPrograma.vsListasDeCanciones.map((lista) => renderTemplate`<li${addAttribute(lista, "key")} data-astro-cid-k56v27mx>${lista}</li>`)} </ul>` : renderTemplate`<p class="no-programs" data-astro-cid-k56v27mx>Aún no tenemos lista de canciones.</p>`} </div> </section> </div> ` })} `;
}, "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/programas/[slug].astro", void 0);

const $$file = "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/programas/[slug].astro";
const $$url = "/programas/[slug].html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
