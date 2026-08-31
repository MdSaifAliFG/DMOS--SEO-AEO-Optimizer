import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const rawBackendUrl =
      process.env.BACKEND_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://127.0.0.1:8000/api/v1";

    // Clean base URL without trailing /api/v1 to avoid duplicate path segments
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
