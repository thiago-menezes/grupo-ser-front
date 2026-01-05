import { strapiFetch } from '../../services/strapi';
import { transformUnit } from '../../transformers/strapi';
import type {
  StrapiUnitsResponse,
  StrapiUnitsQueryParams,
  UnitByIdQueryParams,
  UnitResponseDTO,
} from './types';

const emptyUnitsResponse: UnitResponseDTO = {
  data: [],
  meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } },
};

export async function handleUnits(
  params: StrapiUnitsQueryParams,
): Promise<UnitResponseDTO> {
  const units = await strapiFetch<StrapiUnitsResponse>('units', {
    filters: {
      instituicao: {
        slug: { $eq: params.institutionSlug },
      },
    },
    populate: ['instituicao', 'fotos'],
  });

  if (!units) return emptyUnitsResponse;

  return {
    data: units.data.map(transformUnit),
    meta: units.meta,
  };
}

export async function handleUnitById(
  params: UnitByIdQueryParams,
): Promise<UnitResponseDTO> {
  const units = await strapiFetch<StrapiUnitsResponse>('units', {
    filters: {
      id_da_unidade: { $eq: params.unitId },
      instituicao: {
        slug: { $eq: params.institutionSlug },
      },
    },
    populate: ['instituicao', 'fotos'],
  });

  if (!units) return emptyUnitsResponse;

  return {
    data: units.data.map(transformUnit),
    meta: units.meta,
  };
}
