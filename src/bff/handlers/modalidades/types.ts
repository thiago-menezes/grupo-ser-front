import type { IconNames } from '@/components/icon/types';
import type { StrapiMeta } from '../courses/types-strapi';

export type ModalitiesQueryParams = {
  institutionSlug: string;
  noCache?: boolean;
};

export type StrapiModality = {
  id: number;
  documentId: string;
  nome: string;
  slug: string;
  descricao?: string | null;
  icone?: string | null;
  cta_label?: string | null;
  cta_link?: string | null;
  instituicao?: {
    id: number;
    slug: string;
  } | null;
};

export type ModalityDTO = {
  id: string; // Using slug as ID for compatibility with existing logic
  title: string;
  description: string;
  icon: IconNames;
  ctaLabel: string;
  ctaHref: string;
};

export type ModalitiesResponseDTO = {
  data: ModalityDTO[];
  meta: StrapiMeta;
};

export type StrapiModalitiesResponse = {
  data: StrapiModality[];
  meta: StrapiMeta;
};
