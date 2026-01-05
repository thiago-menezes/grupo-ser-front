import { strapiFetch } from '../../services/strapi';
import { transformSearchBanner } from './transformer';
import type {
  SearchBannerPromoQueryParams,
  StrapiSearchBannerPromoResponse,
  SearchBannerPromoResponseDTO,
} from './types';

export async function handleSearchBannerPromo(
  params: SearchBannerPromoQueryParams,
): Promise<SearchBannerPromoResponseDTO> {
  const data = await strapiFetch<StrapiSearchBannerPromoResponse>(
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

  if (!data) {
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } },
    };
  }

  return {
    data: data.data.map(transformSearchBanner),
    meta: data.meta,
  };
}
