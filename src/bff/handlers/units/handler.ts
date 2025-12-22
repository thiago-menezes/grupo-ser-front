import { strapiFetch } from '../../services/strapi';
import type {
  StrapiUnitsResponse,
  StrapiUnitsQueryParams,
  UnitByIdQueryParams,
} from './types';

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

  if (!institutionCheck.data || institutionCheck.data.length === 0) {
    throw new Error(
      `Institution with slug "${params.institutionSlug}" not found.`,
    );
  }

  const units = await strapiFetch<StrapiUnitsResponse>('units', {
    filters: {
      instituicao: {
        slug: { $eq: params.institutionSlug },
      },
    },
    populate: ['instituicao', 'fotos'],
  });

  if (!units.data || units.data.length === 0) {
    throw new Error(
      `No units found for institution "${params.institutionSlug}".`,
    );
  }

  return units;
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

  if (!units.data || units.data.length === 0) {
    throw new Error(
      `Unit with ID ${params.unitId} not found for institution "${params.institutionSlug}".`,
    );
  }

  return units;
}
