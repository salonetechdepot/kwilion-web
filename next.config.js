/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Skip Lightning CSS optimizations (safe unblock)
    optimizeCss: false,

    // Keep DB libs server-side, quiets Sequelize warnings in RSC
    serverComponentsExternalPackages: ["sequelize", "pg", "pg-hstore"],
  },

  // You had these already — keeping them as-is
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
