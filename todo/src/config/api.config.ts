// src/config/api.config.ts
const rawBase =
  import.meta.env.VITE_API_DOMAIN ?? "http://localhost:3000";

// remove trailing slash, e.g. http://api.test/ -> http://api.test
const baseUrl = rawBase.replace(/\/+$/, "");

export const apiConfig = {
  baseUrl,
  endpoints: {
    todos: "/todos",
  },
  defaultTimeoutMs: 10000,
};

if (import.meta.env.PROD && !import.meta.env.VITE_API_DOMAIN) {
  console.warn(
    "[apiConfig] VITE_API_DOMAIN is not set in production."
  );
}

export function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  const url = new URL(path, baseUrl);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}
