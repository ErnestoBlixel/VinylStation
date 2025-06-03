globalThis.process ??= {}; globalThis.process.env ??= {};
export { renderers } from '../../renderers.mjs';

const GET = async () => {
  try {
    console.log("Proxy: Iniciando petición a Gravity Forms...");
    const res = await fetch("https://cms.vinylstation.es/wp-json/gf/v2/forms/1", {
      headers: {
        Authorization: `Basic ${btoa("vinyl:6VGN RLSc Bh5p w8Ra Ui0L mJdQ")}`,
        "Content-Type": "application/json"
      }
    });
    console.log("Proxy: Status:", res.status);
    console.log("Proxy: Headers:", [...res.headers.entries()]);
    const data = await res.text();
    console.log("Proxy: Data received:", data);
    return new Response(data, {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({
      error: "Failed to fetch form",
      details: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
const POST = async ({ request }) => {
  try {
    const payload = await request.json();
    const res = await fetch("https://cms.vinylstation.es/wp-json/gf/v2/forms/1/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa("vinyl:6VGN RLSc Bh5p w8Ra Ui0L mJdQ")}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to submit form" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
