import type { StrapiClient } from '../../services/strapi';
import type {
  HomePromoBannerQueryParams,
  StrapiHomePromoBannerResponse,
} from './types';

/**
 * Handle home promotional banners data request
 */
export async function handleHomePromoBanner(
  strapiClient: StrapiClient,
  params: HomePromoBannerQueryParams,
): Promise<StrapiHomePromoBannerResponse> {
  const data = await strapiClient.fetch<StrapiHomePromoBannerResponse>(
    'home-promo-banners',
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
