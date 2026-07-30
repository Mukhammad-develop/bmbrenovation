/** @type {import('next').NextConfig} */
// STATIC_EXPORT=true (used by the deploy workflow) builds a plain-HTML static
// export into out/ for cPanel upload. headers() is incompatible with export
// mode, so it is skipped there (set equivalent rules via .htaccess on cPanel).
const isExport = !!process.env.STATIC_EXPORT;

const nextConfig = {
  ...(isExport ? { output: 'export' } : {}),
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
  ...(isExport
    ? {}
    : {
        async headers() {
    return [
      {
        // The host's nginx proxy cache honors Next's default
        // "s-maxage=31536000" on prerendered pages and caches HTML for a
        // year — new blog posts would never appear. Force revalidation on
        // all page routes (paths without a file extension, excluding
        // _next/images which keep their immutable caching below).
        source: '/:path((?!_next/|images/)[^.]*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        // Apply security & cache headers to all routes
        source: '/(.*)',
        headers: [
          // Fix: Ensure proper origin isolation with COOP
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          // Fix: Strong HSTS policy
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Fix: CSP effective against XSS (report-only so it won't break functionality)
          {
            key: 'Content-Security-Policy-Report-Only',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apps.abacus.ai https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com; frame-src 'none';",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        // Cache static images for 1 year (fix: "Use efficient cache lifetimes")
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache Next.js static assets for 1 year
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
        },
      }),
};

module.exports = nextConfig;
