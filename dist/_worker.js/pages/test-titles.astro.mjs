globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DfYyg2vJ.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_BO0IMRcn.mjs';
/* empty css                                       */
export { renderers } from '../renderers.mjs';

const $$TestTitles = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Test T\xEDtulos", "description": "P\xE1gina de prueba para t\xEDtulos", "data-astro-cid-yuvsuxy7": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container" data-astro-cid-yuvsuxy7> <div class="content" data-astro-cid-yuvsuxy7> <h1 data-astro-cid-yuvsuxy7>Título H1 - Debería ser dorado en noche, azul oscuro en día</h1> <h2 data-astro-cid-yuvsuxy7>Título H2 - Debería ser dorado en noche, azul oscuro en día</h2> <h3 data-astro-cid-yuvsuxy7>Título H3 - Debería ser dorado en noche, azul oscuro en día</h3> <p data-astro-cid-yuvsuxy7>Este es un párrafo normal que debería ser blanco en modo noche y negro en modo día.</p> <div class="test-box" data-astro-cid-yuvsuxy7> <h4 data-astro-cid-yuvsuxy7>Título H4 dentro de una caja</h4> <p data-astro-cid-yuvsuxy7>Más texto para verificar que los colores están funcionando correctamente.</p> </div> <strong data-astro-cid-yuvsuxy7>Texto en negrita que debería heredar el color del párrafo</strong> </div> </div> ` })} `;
}, "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/test-titles.astro", void 0);

const $$file = "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/test-titles.astro";
const $$url = "/test-titles.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TestTitles,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
