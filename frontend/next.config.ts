import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Disable webpack build worker to save RAM during compilation on low-memory VPS
  experimental: {
    webpackBuildWorker: false,
  },
};

export default nextConfig;
