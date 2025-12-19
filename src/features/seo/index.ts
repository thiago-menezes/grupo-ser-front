import type { Metadata } from 'next';
import { getSeoFromStrapi } from './api';
import type { StrapiSeo } from './types';

function extractMetadata(seoData: StrapiSeo): Metadata | undefined {
  // Strapi may return either:
  // - { metadata: MetadataLike }
  // - { metadata: { metadata: MetadataLike } } (nested)
  const nested = (seoData as unknown as { metadata?: { metadata?: Metadata } })
    ?.metadata?.metadata;
  return nested ?? (seoData.metadata as unknown as Metadata) ?? undefined;
}

function extractJsonLd(seoData: StrapiSeo): StrapiSeo['jsonld'] | undefined {
  return seoData.jsonld ?? undefined;
}

export async function generateJsonLd(
  institutionSlug: string,
): Promise<StrapiSeo['jsonld'] | undefined> {
  if (!institutionSlug) return undefined;

  try {
    const seoData = await getSeoFromStrapi(institutionSlug);
    return seoData ? extractJsonLd(seoData) : undefined;
  } catch {
    // Return undefined if CMS is unavailable during build
    return undefined;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ institution: string }>;
}): Promise<Metadata> {
  const { institution } = await params;

  const icons = {
    icon: `/favicons/${institution}.ico`,
  };

  // Default metadata as fallback
  const defaultMetadata: Metadata = {
    title: 'Grupo SER - Portal Institucional',
    description: 'Portal multi-institucional do Grupo SER Educacional',
    icons,
  };

  try {
    const seoData = await getSeoFromStrapi(institution);
    if (!seoData) {
      return defaultMetadata;
    }

    const metadata = extractMetadata(seoData);
    if (!metadata) return defaultMetadata;

    return {
      ...metadata,
      icons,
    };
  } catch (error) {
    console.error('SEO: Error fetching metadata, using default:', error);
    return defaultMetadata;
  }
}
