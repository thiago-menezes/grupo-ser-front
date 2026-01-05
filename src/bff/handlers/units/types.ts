import type { Unit } from '../../transformers/strapi';
import type { StrapiMeta, StrapiMedia } from '../courses/types-strapi';

export type StrapiUnitsQueryParams = {
  institutionSlug: string;
};

export type ClientUnitsQueryParams = {
  institution: string;
  state: string;
  city: string;
};

export type ClientUnitsResponse = {
  data: Array<{
    id: number;
    name: string;
    state: string;
    city: string;
  }>;
  meta: {
    total: number;
    institution: string;
    state: string;
    city: string;
  };
};

export type UnitByIdQueryParams = {
  institutionSlug: string;
  unitId: number;
};

export type UnitResponseDTO = {
  data: Unit[];
  meta: StrapiMeta;
};

export type StrapiUnitItem = {
  id: number;
  documentId: string;
  id_da_unidade: number | null;
  nome: string | null;
  endereco: string | null;
  latitude: string | null;
  longitude: string | null;
  ids_dos_cursos?: unknown;
  fotos?: StrapiMedia[];
  instituicao?: {
    id: number;
    documentId: string;
    slug: string;
    nome: string | null;
  };
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

export type StrapiUnitsResponse = {
  data: StrapiUnitItem[];
  meta: StrapiMeta;
};
