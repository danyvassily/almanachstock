import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/almanachstock' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/almanachstock' : '',
};

export default nextConfig;
