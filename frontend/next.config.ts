import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [
      // Redirect non-www to www
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "bizpart24.com",
          },
        ],
        destination: "https://www.bizpart24.com/:path*",
        permanent: true,
      },
      // Redirect http://www to https://www
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.bizpart24.com",
          },
          {
            type: "header",
            key: "x-forwarded-proto",
            value: "http",
          },
        ],
        destination: "https://www.bizpart24.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
