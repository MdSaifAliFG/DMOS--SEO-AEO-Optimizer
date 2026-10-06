import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async redirects() {
    return [
      {
        source: "/seo",
        destination: "/seo/dashboard",
        permanent: false,
      },
      {
        source: "/aeo",
        destination: "/aeo/dashboard",
        permanent: false,
      },
      {
        source: "/geo",
        destination: "/geo/dashboard",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    const rawBackendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8000/api/v1";

    const targetBase = rawBackendUrl.replace(/\/api\/v1\/?$/, "");

    return [
      {
        source: "/api/v1/:path*",
        destination: `${targetBase}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
