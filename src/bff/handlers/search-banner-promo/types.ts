import type { StrapiMeta, StrapiMedia } from '../courses/types-strapi';

export type SearchBannerPromoQueryParams = {
  institutionSlug: string;
  noCache?: boolean;
};

export type StrapiSearchBannerPromoItem = {
  id: number;
  documentId: string;
  link?: string | null;
  imagem?: StrapiMedia | null;
  instituicao?: {
    id: number;
    slug: string;
  } | null;
};

export type SearchBannerDTO = {
  id: number;
  documentId: string;
  link?: string | null;
  image?: string | null;
};

export type SearchBannerPromoResponseDTO = {
  data: SearchBannerDTO[];
  meta: StrapiMeta;
};

export type StrapiSearchBannerPromoResponse = {
  data: StrapiSearchBannerPromoItem[];
  meta: StrapiMeta;
};
