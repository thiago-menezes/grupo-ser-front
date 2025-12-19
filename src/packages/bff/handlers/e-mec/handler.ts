import type { StrapiClient } from '../../services/strapi';
import type { EMecQueryParams, StrapiEMecResponse } from './types';

/**
 * Handle e-MEC data request
 */
export async function handleEMec(
  strapiClient: StrapiClient,
  params: EMecQueryParams,
): Promise<StrapiEMecResponse> {
  const data = await strapiClient.fetch<StrapiEMecResponse>(
    'e-mecs',
    {
      filters: {
        instituicao: {
          slug: { $eq: params.institutionSlug },
        },
      },
      populate: {
        qrcode: true,
        instituicao: true,
      },
    },
    params.noCache,
  );

  return data;
}
