globalThis.process ??= {}; globalThis.process.env ??= {};
import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BEQUGgG6.mjs';
import { manifest } from './manifest_AQIuox_s.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/gravity-form.astro.mjs');
const _page2 = () => import('./pages/aviso-legal.astro.mjs');
const _page3 = () => import('./pages/contacto.astro.mjs');
const _page4 = () => import('./pages/noticias/_slug_.astro.mjs');
const _page5 = () => import('./pages/noticias.astro.mjs');
const _page6 = () => import('./pages/politica-cookies-privacidad.astro.mjs');
const _page7 = () => import('./pages/politica-devoluciones.astro.mjs');
const _page8 = () => import('./pages/politicas-legales.astro.mjs');
const _page9 = () => import('./pages/programas/_slug_.astro.mjs');
const _page10 = () => import('./pages/programas.astro.mjs');
const _page11 = () => import('./pages/readme-gravity-forms.astro.mjs');
const _page12 = () => import('./pages/readme-legal.astro.mjs');
const _page13 = () => import('./pages/resumen-actualizaciones.astro.mjs');
const _page14 = () => import('./pages/test-header.astro.mjs');
const _page15 = () => import('./pages/test-noticias.astro.mjs');
const _page16 = () => import('./pages/test-titles.astro.mjs');
const _page17 = () => import('./pages/vinilos/_slug_.astro.mjs');
const _page18 = () => import('./pages/vinilos.astro.mjs');
const _page19 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/api/gravity-form.ts", _page1],
    ["src/pages/aviso-legal.astro", _page2],
    ["src/pages/contacto.astro", _page3],
    ["src/pages/noticias/[slug].astro", _page4],
    ["src/pages/noticias/index.astro", _page5],
    ["src/pages/politica-cookies-privacidad.astro", _page6],
    ["src/pages/politica-devoluciones.astro", _page7],
    ["src/pages/politicas-legales.astro", _page8],
    ["src/pages/programas/[slug].astro", _page9],
    ["src/pages/programas/index.astro", _page10],
    ["src/pages/README-gravity-forms.md", _page11],
    ["src/pages/README-LEGAL.md", _page12],
    ["src/pages/RESUMEN-ACTUALIZACIONES.md", _page13],
    ["src/pages/test-header.astro", _page14],
    ["src/pages/test-noticias.astro", _page15],
    ["src/pages/test-titles.astro", _page16],
    ["src/pages/vinilos/[slug].astro", _page17],
    ["src/pages/vinilos/index.astro", _page18],
    ["src/pages/index.astro", _page19]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
