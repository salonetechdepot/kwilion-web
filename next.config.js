/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep Lightning CSS off if it’s been flaky on Render
  experimental: {
    optimizeCss: false,
  },

  // ⬇️ NEW (moved from experimental.serverComponentsExternalPackages)
  serverExternalPackages: ["sequelize", "pg", "pg-hstore"],

  // Allow opening the dev site from your LAN IP (update as needed)
  // ✅ hostnames only (no protocol/port)
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.12.139", // your LAN IP
  ],

  serverExternalPackages: ["sequelize", "pg", "pg-hstore"],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  poweredByHeader: false,

  // CI-friendly; don’t block deploys on lint/type errors
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Disable Next/Image optimization on platforms without sharp
  images: { unoptimized: true },

  poweredByHeader: false,
};

export default nextConfig;
