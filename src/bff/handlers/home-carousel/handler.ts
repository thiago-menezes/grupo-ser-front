import { strapiFetch } from '../../services/strapi';
import type {
  HomeCarouselQueryParams,
  StrapiHomeCarouselResponse,
} from './types';

export async function handleHomeCarousel(
  params: HomeCarouselQueryParams,
): Promise<StrapiHomeCarouselResponse> {
  const data = await strapiFetch<StrapiHomeCarouselResponse>(
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
