import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  serverExternalPackages: ["msw"],
  typescript: {
    ignoreBuildErrors: true,
  },
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "cdn.dummyjson.com",
      },
      {
        hostname: "picsum.photos",
      },
      {
        hostname: "nyc3.digitaloceanspaces.com",
      },
      {
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "loremflickr.com",
      },
      {
        hostname: "lon1.digitaloceanspaces.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
