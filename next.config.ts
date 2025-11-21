import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Раскомментируйте и установите basePath, если ваш репозиторий не является username.github.io
  // basePath: '/название-вашего-репозитория',
  // assetPrefix: '/название-вашего-репозитория/',
};

export default nextConfig;
