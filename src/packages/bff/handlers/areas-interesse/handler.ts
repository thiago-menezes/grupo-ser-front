import type { StrapiClient } from '../../services/strapi';
import type {
  AreasInteresseQueryParams,
  StrapiAreasInteresseResponse,
} from './types';

/**
 * Handle areas de interesse data request
 */
export async function handleAreasInteresse(
  strapiClient: StrapiClient,
  params: AreasInteresseQueryParams,
): Promise<StrapiAreasInteresseResponse> {
  const data = await strapiClient.fetch<StrapiAreasInteresseResponse>(
    'areas-de-interesses',
    {
      filters: {
        instituicao: {
          slug: { $eq: params.institutionSlug },
        },
      },
      populate: {
        capa: true,
        instituicao: true,
      },
      sort: ['nome:ASC'],
    },
    params.noCache,
  );

  return data;
}
