import { strapiFetch } from '../../services/strapi';
import { transformBanner } from './transformer';
import type {
  HomePromoBannerQueryParams,
  StrapiHomePromoBannerResponse,
  HomePromoBannerResponseDTO,
} from './types';

export async function handleHomePromoBanner(
  params: HomePromoBannerQueryParams,
): Promise<HomePromoBannerResponseDTO> {
  const data = await strapiFetch<StrapiHomePromoBannerResponse>(
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

  if (!data) {
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } },
    };
  }

  return {
    data: data.data.map(transformBanner),
    meta: data.meta,
  };
}
