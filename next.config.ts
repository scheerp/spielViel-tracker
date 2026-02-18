import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

module.exports = {
  images: {
    domains: ['cf.geekdo-images.com'],
    unoptimized: true,
  },
};

export default nextConfig;
