import type { NextConfig } from "next";

// Dev:    FASTAPI_URL is not set → defaults to 127.0.0.1:8000
// Docker: FASTAPI_URL=http://backend:8000 (set in docker-compose.yml via env_file or env)
const FASTAPI_URL = process.env.FASTAPI_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  // Required for Docker production build — generates a self-contained server.js
  // in .next/standalone/ that can run without node_modules.
  // Has no effect in `npm run dev` mode.
  output: "standalone",

  async rewrites() {
    // All backend routes are transparently proxied from Next.js → FastAPI.
    // The browser only ever talks to the Next.js origin (no CORS needed).
    // In production (Docker/Nginx), Nginx handles this routing instead.
    return [
      {
        source: "/ml/:path*",
        destination: `${FASTAPI_URL}/ml/:path*`,
      },
      {
        source: "/rag/:path*",
        destination: `${FASTAPI_URL}/rag/:path*`,
      },
      {
        source: "/llm/:path*",
        destination: `${FASTAPI_URL}/llm/:path*`,
      },
      {
        source: "/agent/:path*",
        destination: `${FASTAPI_URL}/agent/:path*`,
      },
      {
        source: "/data/:path*",
        destination: `${FASTAPI_URL}/data/:path*`,
      },
      {
        source: "/kaggle/:path*",
        destination: `${FASTAPI_URL}/kaggle/:path*`,
      },
    ];
  },
};

export default nextConfig;
