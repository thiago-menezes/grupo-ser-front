import { strapiFetch } from '../../services/strapi';
import type {
  SearchBannerPromoQueryParams,
  StrapiSearchBannerPromoResponse,
} from './types';

export async function handleSearchBannerPromo(
  params: SearchBannerPromoQueryParams,
): Promise<StrapiSearchBannerPromoResponse> {
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

  return (
    data ?? {
      data: [],
      meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } },
    }
  );
}
