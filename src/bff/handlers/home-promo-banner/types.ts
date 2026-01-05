import type { StrapiMeta, StrapiMedia } from '../courses/types-strapi';

export type HomePromoBannerQueryParams = {
  institutionSlug: string;
  noCache?: boolean;
};

export type StrapiHomePromoBannerItem = {
  id: number;
  documentId: string;
  link?: string | null;
  imagem?: StrapiMedia | null;
  instituicao?: {
    id: number;
    slug: string;
  } | null;
};

export type BannerDTO = {
  id: number;
  documentId: string;
  link?: string | null;
  image?: string | null;
};

export type HomePromoBannerResponseDTO = {
  data: BannerDTO[];
  meta: StrapiMeta;
};

export type StrapiHomePromoBannerResponse = {
  data: StrapiHomePromoBannerItem[];
  meta: StrapiMeta;
};
