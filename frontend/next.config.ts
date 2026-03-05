import type { NextConfig } from "next";

const FASTAPI_URL = process.env.FASTAPI_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    // All backend routes are transparently proxied from Next.js → FastAPI.
    // The browser only ever talks to the Next.js origin (no CORS needed).
    // In production, Nginx handles this routing instead.
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
