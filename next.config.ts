import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone mode for Docker deployment
  output: 'standalone',

  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  transpilePackages: ['reshaped'],
  experimental: {
    optimizePackageImports: ['reshaped'],
  },
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Development: Local Strapi
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // Production: CDN for media assets
      {
        protocol: 'https',
        hostname: 'assets.gruposer.com.br',
        pathname: '/uploads/**',
      },
      // Strapi Cloud (temporary, can be removed after migration)
      {
        protocol: 'https',
        hostname: 'cozy-joy-a6787fb158.media.strapiapp.com',
      },
      // Placeholder images
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.it',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
