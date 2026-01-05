import type {
  StrapiMeta,
  StrapiMedia,
  StrapiBlock,
} from '../courses/types-strapi';

export type AreasInteresseQueryParams = {
  institutionSlug: string;
  noCache?: boolean;
};

export type StrapiAreaInteresse = {
  id: number;
  documentId: string;
  nome: string;
  subareas: StrapiBlock[]; // Strapi blocks
  capa?: StrapiMedia | null;
  instituicao?: {
    id: number;
    slug: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type AreaInteresseDTO = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  image?: string | null;
  courses: {
    id: string;
    name: string;
    slug: string;
  }[];
};

export type AreasInteresseResponseDTO = {
  data: AreaInteresseDTO[];
  meta: StrapiMeta;
};

export type StrapiAreasInteresseResponse = {
  data: StrapiAreaInteresse[];
  meta: StrapiMeta;
};
