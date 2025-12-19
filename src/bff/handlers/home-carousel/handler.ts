import type { StrapiClient } from '../../services/strapi';
import type {
  HomeCarouselQueryParams,
  StrapiHomeCarouselResponse,
} from './types';

/**
 * Handle home carousel data request
 */
export async function handleHomeCarousel(
  strapiClient: StrapiClient,
  params: HomeCarouselQueryParams,
): Promise<StrapiHomeCarouselResponse> {
  const data = await strapiClient.fetch<StrapiHomeCarouselResponse>(
    'home-carousels',
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
      sort: ['nome:ASC'],
    },
    params.noCache,
  );

  return data;
}
