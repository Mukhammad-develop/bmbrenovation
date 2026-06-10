/** @type {import('next').NextConfig} */
const nextConfig = {
  // Comment out or remove 'export' if running as a persistent Node.js App on cPanel
  // output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

module.exports = nextConfig;
