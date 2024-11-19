import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    domains: ['cf.geekdo-images.com'],
  },
  typescript: {
    // TODO: Ignoriert TypeScript-Fehler während des Builds
    ignoreBuildErrors: true,
  },
  eslint: {
    // TODO: Ignoriert ESLint-Warnungen während des Builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
