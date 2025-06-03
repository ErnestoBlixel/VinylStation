globalThis.process ??= {}; globalThis.process.env ??= {};
import { aa as NOOP_MIDDLEWARE_HEADER } from './astro/server_DfYyg2vJ.mjs';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

export { NOOP_MIDDLEWARE_FN as N };
