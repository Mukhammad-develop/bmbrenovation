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
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
