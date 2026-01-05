import { strapiFetch } from '../../services/strapi';
import type {
  HomePromoBannerQueryParams,
  StrapiHomePromoBannerResponse,
} from './types';

export async function handleHomePromoBanner(
  params: HomePromoBannerQueryParams,
): Promise<StrapiHomePromoBannerResponse> {
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

  return (
    data ?? {
      data: [],
      meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } },
    }
  );
}
