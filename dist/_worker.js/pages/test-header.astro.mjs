globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DfYyg2vJ.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_BO0IMRcn.mjs';
/* empty css                                       */
export { renderers } from '../renderers.mjs';

const $$TestHeader = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Test Header", "description": "P\xE1gina de prueba para el header actualizado", "data-astro-cid-fng6hwch": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="container" data-astro-cid-fng6hwch> <div class="content" data-astro-cid-fng6hwch> <h1 data-astro-cid-fng6hwch>Prueba del Header Actualizado</h1> <div class="test-info" data-astro-cid-fng6hwch> <h2 data-astro-cid-fng6hwch>✨ Cambios implementados en el Header:</h2> <div class="feature-box" data-astro-cid-fng6hwch> <h3 data-astro-cid-fng6hwch>🎨 Colores dinámicos</h3> <p data-astro-cid-fng6hwch><strong data-astro-cid-fng6hwch>Título "VinylStation":</strong> Dorado en noche, azul oscuro en día</p> <p data-astro-cid-fng6hwch><strong data-astro-cid-fng6hwch>Menú de navegación:</strong> Blanco en noche, negro en día</p> <p data-astro-cid-fng6hwch><strong data-astro-cid-fng6hwch>Hover del menú:</strong> Dorado en noche, azul oscuro en día</p> </div> <div class="feature-box" data-astro-cid-fng6hwch> <h3 data-astro-cid-fng6hwch>📏 Logo más grande</h3> <p data-astro-cid-fng6hwch><strong data-astro-cid-fng6hwch>Tamaño anterior:</strong> 32x32px</p> <p data-astro-cid-fng6hwch><strong data-astro-cid-fng6hwch>Tamaño nuevo:</strong> 60x60px</p> </div> <div class="feature-box" data-astro-cid-fng6hwch> <h3 data-astro-cid-fng6hwch>✨ Efectos del logo</h3> <p data-astro-cid-fng6hwch><strong data-astro-cid-fng6hwch>Animación:</strong> Resplandor suave continuo (igual que el hero)</p> <p data-astro-cid-fng6hwch><strong data-astro-cid-fng6hwch>Hover:</strong> Escala al 105%</p> <p data-astro-cid-fng6hwch><strong data-astro-cid-fng6hwch>Sombra:</strong> Drop-shadow que se adapta al tema</p> </div> </div> <div class="instructions" data-astro-cid-fng6hwch> <h3 data-astro-cid-fng6hwch>🧪 Para probar:</h3> <ol data-astro-cid-fng6hwch> <li data-astro-cid-fng6hwch>Observa el logo del header - debería ser más grande y con animación</li> <li data-astro-cid-fng6hwch>Verifica que el título "VinylStation" cambie de color con el tema</li> <li data-astro-cid-fng6hwch>Haz hover sobre los elementos del menú</li> <li data-astro-cid-fng6hwch>Cambia entre modo noche y día usando el botón flotante</li> <li data-astro-cid-fng6hwch>Observa las transiciones suaves</li> </ol> </div> </div> </div> ` })} `;
}, "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/test-header.astro", void 0);

const $$file = "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/test-header.astro";
const $$url = "/test-header.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TestHeader,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
