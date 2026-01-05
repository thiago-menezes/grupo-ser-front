import { strapiFetch } from '../../services/strapi';
import type {
  StrapiUnitsResponse,
  StrapiUnitsQueryParams,
  UnitByIdQueryParams,
} from './types';

const emptyUnitsResponse: StrapiUnitsResponse = {
  data: [],
  meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } },
};

export async function handleUnits(
  params: StrapiUnitsQueryParams,
): Promise<StrapiUnitsResponse> {
  const institutionCheck = await strapiFetch<{
    data: Array<{ id: number; slug: string; nome: string }>;
  }>('institutions', {
    filters: {
      slug: { $eq: params.institutionSlug },
    },
  });

  if (!institutionCheck?.data || institutionCheck.data.length === 0) {
    return emptyUnitsResponse;
  }

  const units = await strapiFetch<StrapiUnitsResponse>('units', {
    filters: {
      instituicao: {
        slug: { $eq: params.institutionSlug },
      },
    },
    populate: ['instituicao', 'fotos'],
  });

  return units ?? emptyUnitsResponse;
}

export async function handleUnitById(
  params: UnitByIdQueryParams,
): Promise<StrapiUnitsResponse> {
  const units = await strapiFetch<StrapiUnitsResponse>('units', {
    filters: {
      id_unidade: { $eq: params.unitId },
      instituicao: {
        slug: { $eq: params.institutionSlug },
      },
    },
    populate: ['instituicao', 'fotos'],
  });

  return units ?? emptyUnitsResponse;
}
