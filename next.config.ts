import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a static export suitable for GitHub Pages
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;
