import type { SeoDTO } from 'types/api/seos';
import type { StrapiSeo } from '@/features/seo/types';

export function transformSeo(strapi: StrapiSeo): SeoDTO {
  // StrapiSeo is already mostly in English due to metadata/jsonld structure
  return strapi;
}
