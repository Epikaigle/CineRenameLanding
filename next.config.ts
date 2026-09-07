import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
      },
      {
        protocol: 'https',
        hostname: 'player.vimeo.com',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },
  async redirects() {
    const docSlugs = '(auto-mode|changelog|checksums|cli|duplicates|export|faq|getting-started|history|installation|media-servers|pro|providers|studio|subtitles|templates|troubleshooting|watch-folders)';
    return [
      {
        source: '/en',
        destination: '/',
        permanent: true,
      },
      {
        source: '/en/:path*',
        destination: '/:path*',
        permanent: true,
      },
      // Docs download redirects to landing download page
      {
        source: '/docs/:locale(fr|es|zh)/download',
        destination: '/:locale/download',
        permanent: true,
      },
      {
        source: '/docs/download',
        destination: '/download',
        permanent: true,
      },
      // Legacy landing URLs to documentation paths (with locale)
      {
        source: `/:locale(fr|es|zh)/:slug${docSlugs}`,
        destination: '/docs/:locale/:slug',
        permanent: true,
      },
      // Legacy landing URLs to documentation paths (default English)
      {
        source: `/:slug${docSlugs}`,
        destination: '/docs/:slug',
        permanent: true,
      },
      // Specific legacy redirects
      {
        source: '/duplicates',
        destination: '/docs/duplicates',
        permanent: true,
      },
      {
        source: '/pro',
        destination: '/docs/pro',
        permanent: true,
      },
      {
        source: '/fr/faq',
        destination: '/docs/fr/faq',
        permanent: true,
      },
      {
        source: '/fr/watch-folders',
        destination: '/docs/fr/watch-folders',
        permanent: true,
      },
      {
        source: '/es/duplicates',
        destination: '/docs/es/duplicates',
        permanent: true,
      },
      {
        source: '/es/templates',
        destination: '/docs/es/templates',
        permanent: true,
      },
      {
        source: '/es/changelog',
        destination: '/docs/es/changelog',
        permanent: true,
      },
      {
        source: '/fr/history',
        destination: '/docs/fr/history',
        permanent: true,
      },
      {
        source: '/zh/templates',
        destination: '/docs/zh/templates',
        permanent: true,
      },
      {
        source: '/es/subtitles',
        destination: '/docs/es/subtitles',
        permanent: true,
      },
      {
        source: '/zh/media-servers',
        destination: '/docs/zh/media-servers',
        permanent: true,
      },
      // HTML extensions cleanup
      {
        source: '/docs/index.html',
        destination: '/docs/',
        permanent: true,
      },
      {
        source: '/docs/:path*/index.html',
        destination: '/docs/:path*/',
        permanent: true,
      },
      {
        source: '/docs/:path*.html',
        destination: '/docs/:path*',
        permanent: true,
      },
      {
        source: `/:locale(fr|es|zh)/:slug${docSlugs}.html`,
        destination: '/docs/:locale/:slug',
        permanent: true,
      },
      {
        source: `/:slug${docSlugs}.html`,
        destination: '/docs/:slug',
        permanent: true,
      },
      {
        source: '/:path*.html',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
};

if (process.argv.includes("dev")) {
  initOpenNextCloudflareForDev();
}

export default withNextIntl(nextConfig);
