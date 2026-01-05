/**
 * Strapi field transformers
 * Maps Portuguese field names from Strapi to English DTOs
 */

export type StrapiInstitution = {
  id: number;
  documentId: string;
  slug: string;
  nome: string | null;
  codigo?: string | null;
  cidade_para_busca_padrao?: string | null;
  estadoPadrao?: string | null;
  ativo?: boolean | null;
  descricao?: string | null;
  site?: string | null;
  corPrimaria?: string | null;
  corSecundaria?: string | null;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

export type Institution = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  code?: string | null;
  defaultCity?: string | null;
  defaultState?: string | null;
  active?: boolean;
  description?: string | null;
  website?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
};

export function transformInstitution(strapi: StrapiInstitution): Institution {
  // Parse cidade_para_busca_padrao if it contains both city and state (e.g., "Manaus - AM")
  let defaultCity = strapi.cidade_para_busca_padrao || null;
  let defaultState = strapi.estadoPadrao || null;

  if (defaultCity && defaultCity.includes(' - ')) {
    const parts = defaultCity.split(' - ');
    if (parts.length === 2) {
      defaultCity = parts[0].trim();
      defaultState = parts[1].trim();
    }
  }

  return {
    id: strapi.id,
    documentId: strapi.documentId,
    name: strapi.nome || '',
    slug: strapi.slug,
    code: strapi.codigo || null,
    defaultCity,
    defaultState,
    active: strapi.ativo ?? true,
    description: strapi.descricao || null,
    website: strapi.site || null,
    primaryColor: strapi.corPrimaria || null,
    secondaryColor: strapi.corSecundaria || null,
  };
}

export type StrapiUnit = {
  id: number;
  documentId: string;
  id_da_unidade: number | null;
  nome: string | null;
  endereco: string | null;
  latitude: string | null;
  longitude: string | null;
  ids_dos_cursos?: unknown;
  fotos?: unknown[];
  instituicao?: StrapiInstitution;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

export type Unit = {
  id: number;
  documentId: string;
  unitId: number | null;
  name: string;
  address: string;
  latitude: string | null;
  longitude: string | null;
  courseIds?: unknown;
  photos?: unknown[];
  institution?: Institution;
};

export function transformUnit(strapi: StrapiUnit): Unit {
  return {
    id: strapi.id,
    documentId: strapi.documentId,
    unitId: strapi.id_da_unidade,
    name: strapi.nome || '',
    address: strapi.endereco || '',
    latitude: strapi.latitude,
    longitude: strapi.longitude,
    courseIds: strapi.ids_dos_cursos,
    photos: strapi.fotos || [],
    institution: strapi.instituicao
      ? transformInstitution(strapi.instituicao)
      : undefined,
  };
}
