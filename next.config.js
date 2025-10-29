/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable lightningcss to fix font issues
  experimental: {
    optimizeCss: false,
  },
  // Your existing config
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
};

module.exports = nextConfig;
