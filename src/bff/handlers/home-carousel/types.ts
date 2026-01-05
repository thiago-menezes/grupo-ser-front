import type { StrapiMeta, StrapiMedia } from '../courses/types-strapi';

export type HomeCarouselQueryParams = {
  institutionSlug: string;
  noCache?: boolean;
};

export type StrapiHomeCarouselItem = {
  id: number;
  documentId: string;
  nome: string;
  link?: string | null;
  imagem?: StrapiMedia | null;
  instituicao?: {
    id: number;
    slug: string;
  } | null;
};

export type CarouselItemDTO = {
  id: number;
  documentId: string;
  name: string;
  link?: string | null;
  image?: string | null;
};

export type HomeCarouselResponseDTO = {
  data: CarouselItemDTO[];
  meta: StrapiMeta;
};

export type StrapiHomeCarouselResponse = {
  data: StrapiHomeCarouselItem[];
  meta: StrapiMeta;
};
