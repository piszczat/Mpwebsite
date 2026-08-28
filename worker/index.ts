/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB?: D1Database;
  CONTACT_WEBHOOK_URL?: string;
  CONTACT_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  CLOUDFLARE_WEB_ANALYTICS_TOKEN?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
  website?: unknown;
  startedAt?: unknown;
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

const isContactConfigured = (env: Env) =>
  Boolean(
    env.CONTACT_WEBHOOK_URL ||
      (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL && env.CONTACT_FROM_EMAIL),
  );

const normalise = (value: unknown, limit: number) =>
  typeof value === "string" ? value.trim().slice(0, limit) : "";

async function handleContact(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }

  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    return jsonResponse({ error: "origin_not_allowed" }, 403);
  }

  const contentLength = Number(request.headers.get("Content-Length") || "0");
  if (contentLength > 12_000) {
    return jsonResponse({ error: "payload_too_large" }, 413);
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400);
  }

  // Honeypot submissions receive a neutral success response.
  if (normalise(payload.website, 200)) {
    return jsonResponse({ ok: true });
  }

  const name = normalise(payload.name, 80);
  const email = normalise(payload.email, 160);
  const company = normalise(payload.company, 120);
  const message = normalise(payload.message, 4000);
  const startedAt = typeof payload.startedAt === "number" ? payload.startedAt : 0;
  const elapsed = Date.now() - startedAt;

  if (
    name.length < 2 ||
    message.length < 20 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    elapsed < 1200 ||
    elapsed > 3_600_000
  ) {
    return jsonResponse({ error: "validation_failed" }, 400);
  }

  if (!isContactConfigured(env)) {
    return jsonResponse({ error: "delivery_not_configured" }, 503);
  }

  const submittedAt = new Date().toISOString();

  if (env.CONTACT_WEBHOOK_URL) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "MarcinP-Portfolio-Contact/1.0",
    };
    if (env.CONTACT_WEBHOOK_SECRET) {
      headers.Authorization = "Bearer " + env.CONTACT_WEBHOOK_SECRET;
    }
    const response = await fetch(env.CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        source: "marcinp.com",
        submittedAt,
        name,
        email,
        company,
        message,
      }),
    });
    if (!response.ok) {
      return jsonResponse({ error: "delivery_failed" }, 502);
    }
    return jsonResponse({ ok: true });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + env.RESEND_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: "Portfolio contact from " + name,
      text:
        "Name: " + name + "\n" +
        "Email: " + email + "\n" +
        "Company/team: " + (company || "—") + "\n" +
        "Submitted: " + submittedAt + "\n\n" +
        message,
    }),
  });

  if (!response.ok) {
    return jsonResponse({ error: "delivery_failed" }, 502);
  }
  return jsonResponse({ ok: true });
}

function analyticsLoader(env: Env): Response {
  const token = env.CLOUDFLARE_WEB_ANALYTICS_TOKEN;
  if (!token) {
    return new Response("/* Cloudflare Web Analytics is awaiting its site token. */", {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  const beaconConfig = JSON.stringify(JSON.stringify({ token, spa: true }));
  const script =
    "(function(){" +
    "var s=document.createElement('script');" +
    "s.defer=true;" +
    "s.src='https://static.cloudflareinsights.com/beacon.min.js';" +
    "s.setAttribute('data-cf-beacon'," + beaconConfig + ");" +
    "document.head.appendChild(s);" +
    "})();";

  return new Response(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact/status") {
      return jsonResponse({ configured: isContactConfigured(env) });
    }

    if (url.pathname === "/api/contact") {
      return handleContact(request, env);
    }

    if (url.pathname === "/analytics-loader.js") {
      return analyticsLoader(env);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
