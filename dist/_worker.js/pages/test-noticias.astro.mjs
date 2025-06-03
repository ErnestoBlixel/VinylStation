globalThis.process ??= {}; globalThis.process.env ??= {};
/* empty css                                        */
import { c as createComponent, f as renderHead, a as renderTemplate } from '../chunks/astro/server_DfYyg2vJ.mjs';
import { d as getNoticiasPaginadas } from '../chunks/wordpress_iKskd3ty.mjs';
export { renderers } from '../renderers.mjs';

const $$TestNoticias = createComponent(async ($$result, $$props, $$slots) => {
  let testData = null;
  let error = null;
  try {
    console.log("\u{1F50D} Test: Obteniendo noticias...");
    testData = await getNoticiasPaginadas({ page: 1, itemsPerPage: 10 });
    console.log("\u2705 Test: Noticias obtenidas:", testData);
  } catch (e) {
    error = e;
    console.error("\u274C Test: Error:", e);
  }
  const noticias = testData?.noticias || [];
  return renderTemplate`<html> <head><title>Test Noticias</title>${renderHead()}</head> <body style="font-family: Arial; padding: 20px; background: #1a1a1a; color: white;"> <h1>Test de Noticias</h1> ${error ? renderTemplate`<div style="background: red; padding: 20px; border-radius: 10px;"> <h2>Error:</h2> <pre>${error.message}</pre> </div>` : renderTemplate`<div> <h2>Noticias encontradas: ${noticias.length}</h2> ${noticias.length > 0 ? renderTemplate`<ul> ${noticias.map((noticia) => renderTemplate`<li style="margin: 10px 0;"> <strong>${noticia.title}</strong> <br>
Slug: ${noticia.slug} <br>
Fecha: ${noticia.date} </li>`)} </ul>` : renderTemplate`<p>No se encontraron noticias</p>`} <h3>Datos completos:</h3> <pre style="background: #333; padding: 20px; border-radius: 5px; overflow: auto;">          ${JSON.stringify(testData, null, 2)}
        </pre> </div>`} </body></html>`;
}, "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/test-noticias.astro", void 0);

const $$file = "C:/Users/nestu/Desktop/web vinylstation/astro_0306/src/pages/test-noticias.astro";
const $$url = "/test-noticias.html";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TestNoticias,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
