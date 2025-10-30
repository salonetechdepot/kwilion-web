/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  serverExternalPackages: [
    "sequelize",
    "pg",
    "pg-hstore",
    "sequelize-typescript",
  ],

  webpack: (config, { isServer }) => {
    // Avoid noisy dynamic require warning from Sequelize
    config.module.parser = config.module.parser || {};
    config.module.parser.javascript = {
      ...config.module.parser.javascript,
      dynamicImportMode: "eager",
    };
    return config;
  },
};

export default nextConfig;
