import type { StrapiMeta, StrapiMedia } from '../courses/types-strapi';

export type EMecQueryParams = {
  institutionSlug: string;
  noCache?: boolean;
};

export type StrapiEMecItem = {
  id: number;
  documentId: string;
  link?: string | null;
  qrcode?: StrapiMedia | null;
  instituicao?: {
    id: number;
    slug: string;
  } | null;
};

export type EMecDTO = {
  id: number;
  documentId: string;
  link?: string | null;
  qrCode?: string | null;
};

export type EMecResponseDTO = {
  data: EMecDTO[];
  meta: StrapiMeta;
};

export type StrapiEMecResponse = {
  data: StrapiEMecItem[];
  meta: StrapiMeta;
};
