import type { StrapiClient } from '../../services/strapi';
import type {
  SearchBannerPromoQueryParams,
  StrapiSearchBannerPromoResponse,
} from './types';

/**
 * Handle search banner promotional data request
 */
export async function handleSearchBannerPromo(
  strapiClient: StrapiClient,
  params: SearchBannerPromoQueryParams,
): Promise<StrapiSearchBannerPromoResponse> {
  const data = await strapiClient.fetch<StrapiSearchBannerPromoResponse>(
    'search-banner-promos',
    {
      filters: {
        instituicao: {
          slug: { $eq: params.institutionSlug },
        },
      },
      populate: {
        imagem: true,
        instituicao: true,
      },
    },
    params.noCache,
  );

  return data;
}
