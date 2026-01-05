import { strapiFetch } from '../../services/strapi';
import { transformCarouselItem } from './transformer';
import type {
  HomeCarouselQueryParams,
  StrapiHomeCarouselResponse,
  HomeCarouselResponseDTO,
} from './types';

export async function handleHomeCarousel(
  params: HomeCarouselQueryParams,
): Promise<HomeCarouselResponseDTO> {
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
    },
    params.noCache,
  );

  if (!data) {
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } },
    };
  }

  return {
    data: data.data.map(transformCarouselItem),
    meta: data.meta,
  };
}
