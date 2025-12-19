import type { SeosResponseDTO } from 'types/api/seos';
import type { StrapiClient } from '../../services/strapi';
import type { SeoQueryParams } from './types';

/**
 * Handle SEO data request
 */
export async function handleSeo(
  strapiClient: StrapiClient,
  params: SeoQueryParams,
): Promise<SeosResponseDTO> {
  const data = await strapiClient.fetch<SeosResponseDTO>(
    'seos',
    {
      filters: {
        instituicao: {
          slug: { $eq: params.institutionSlug },
        },
      },
      populate: 'instituicao',
    },
    params.noCache,
  );

  return data;
}
