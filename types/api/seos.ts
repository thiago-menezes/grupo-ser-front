import type { StrapiMeta } from '@/bff/handlers/courses/types-strapi';
import type { StrapiSeo } from '@/features/seo/types';

export type SeoDTO = StrapiSeo; // For now, StrapiSeo is already mostly English

export type SeosResponseDTO = {
  data: SeoDTO[];
  meta: StrapiMeta;
};

export type SeosErrorDTO = {
  error: string;
  message?: string;
};
