import type { StrapiSeo } from '@/features/seo/types';
import type { StrapiMeta } from '../courses/types-strapi';

export type SeoQueryParams = {
  institutionSlug: string;
  noCache?: boolean;
};

export type StrapiSeoResponse = {
  data: StrapiSeo[];
  meta: StrapiMeta;
};
