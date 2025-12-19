export interface UnitsQueryParams {
  institutionSlug: string;
}

// Client API types
export interface ClientUnitsQueryParams {
  institution: string;
  state: string;
  city: string;
}

export interface ClientUnitsResponse {
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
}

// Strapi units query by ID
export interface UnitByIdQueryParams {
  institutionSlug: string;
  unitId: number;
}

// Strapi response with Portuguese field names
export type StrapiUnitsResponse = {
  data: Array<{
    id: number;
    documentId: string;
    id_unidade: number | null;
    nome: string | null;
    endereco: string | null;
    latitude: number;
    longitude: number;
    fotos?: Array<{
      id: number;
      documentId: string;
      url: string;
      name?: string;
      alternativeText?: string | null;
      caption?: string | null;
      width?: number;
      height?: number;
      formats?: unknown;
      hash?: string;
      ext?: string;
      mime?: string;
      size?: number;
    }>;
    instituicao?: {
      id: number;
      documentId: string;
      slug: string;
      nome: string | null;
    };
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string | null;
  }>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};
