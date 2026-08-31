import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async rewrites() {
    const rawBackendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL;

    if (!rawBackendUrl || !rawBackendUrl.startsWith("http")) {
      return [];
    }

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
