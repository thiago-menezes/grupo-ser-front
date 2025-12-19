import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

/**
 * Dynamic robots.txt generation based on domain
 * Generates robots.txt with proper sitemap reference for each domain
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get('host') || 'unama.com.br';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // Block API routes
          '/_next/', // Block Next.js internals
          '/admin/', // Block admin area (if any)
          '/*.json$', // Block JSON files
          '/*?*preview=', // Block preview URLs
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/', // Block OpenAI crawlers
      },
      {
        userAgent: 'CCBot',
        disallow: '/', // Block Common Crawl
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
