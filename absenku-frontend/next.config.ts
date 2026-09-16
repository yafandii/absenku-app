import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["192.168.68.102", "172.20.0.228"],
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "http://localhost:4000/:path*",
      },
      {
        source: "/api/proxy/:path*",
        destination: "http://192.168.68.102:4000/:path*",
      },
      {
        source: "/api/proxy/:path*",
        destination: "http://172.20.0.228:4000/:path*",
      },
    ];
  },
};

export default nextConfig;
