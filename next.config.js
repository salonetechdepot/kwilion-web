/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable Lightning CSS (avoids lightningcss native binary on Render)
    optimizeCss: false,
  },
  serverExternalPackages: ["sequelize", "pg", "pg-hstore"],

  // Optional: hush dev warning for LAN access
  allowedDevOrigins: ["http://192.168.12.139:3000"],

  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  poweredByHeader: false,
  devIndicators: false,
};

export default nextConfig;
