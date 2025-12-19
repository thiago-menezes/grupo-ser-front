import { createStrapiClient } from '@/packages/bff/services/strapi';
import type { StrapiSeoResponse } from './types';

function getStrapiUrl(): string {
  const url = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!url) {
    throw new Error('STRAPI_URL is not configured');
  }
  return url;
}

export async function getSeoFromStrapi(
  institutionSlug: string,
): Promise<StrapiSeoResponse['data'][0] | null> {
  try {
    const strapiUrl = getStrapiUrl();
    const strapiToken = process.env.STRAPI_TOKEN;
    const strapiClient = createStrapiClient(strapiUrl, strapiToken);

    const strapiResponse = await strapiClient.fetch<StrapiSeoResponse>('seos', {
      filters: {
        instituicao: {
          slug: { $eq: institutionSlug },
        },
      },
      populate: 'instituicao',
    });

    if (!strapiResponse.data || strapiResponse.data.length === 0) {
      return null;
    }

    return strapiResponse.data[0];
  } catch (error) {
    console.error('SEO fetch error:', error);
    return null;
  }
}
