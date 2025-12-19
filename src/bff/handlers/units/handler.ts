import type { StrapiClient } from '../../services/strapi';
import type {
  StrapiUnitsResponse,
  UnitsQueryParams,
  UnitByIdQueryParams,
} from './types';

/**
 * Handle units request
 */
export async function handleUnits(
  strapiClient: StrapiClient,
  params: UnitsQueryParams,
): Promise<StrapiUnitsResponse> {
  // First, verify the institution exists
  const institutionCheck = await strapiClient.fetch<{
    data: Array<{ id: number; slug: string; nome: string }>;
  }>('institutions', {
    filters: {
      slug: { $eq: params.institutionSlug },
    },
  });

  if (!institutionCheck.data || institutionCheck.data.length === 0) {
    throw new Error(
      `Institution with slug "${params.institutionSlug}" not found. Available institutions can be checked at: http://localhost:1337/admin/content-manager/collectionType/api::institution/institution`,
    );
  }

  // Fetch units with institution filter (using Portuguese field names)
  const units = await strapiClient.fetch<StrapiUnitsResponse>('units', {
    filters: {
      instituicao: {
        slug: { $eq: params.institutionSlug },
      },
    },
    populate: ['instituicao', 'fotos'],
  });

  if (!units.data || units.data.length === 0) {
    throw new Error(
      `No units found for institution "${params.institutionSlug}". Units can be managed at: http://localhost:1337/admin/content-manager/collectionType/api::unit/unit`,
    );
  }

  return units;
}

/**
 * Handle unit request by ID - fetch specific unit with photos
 * Uses id_unidade field to match with client API ID
 */
export async function handleUnitById(
  strapiClient: StrapiClient,
  params: UnitByIdQueryParams,
): Promise<StrapiUnitsResponse> {
  // Fetch specific unit by id_unidade (matches client API ID) and institution
  const units = await strapiClient.fetch<StrapiUnitsResponse>('units', {
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
