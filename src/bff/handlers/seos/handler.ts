import type { SeosResponseDTO } from 'types/api/seos';
import { strapiFetch } from '../../services/strapi';
import { transformSeo } from './transformer';
import type { SeoQueryParams, StrapiSeoResponse } from './types';

export async function handleSeo(
  params: SeoQueryParams,
): Promise<SeosResponseDTO> {
  const data = await strapiFetch<StrapiSeoResponse>(
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

  if (!data) {
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } },
    };
  }

  return {
    data: data.data.map(transformSeo),
    meta: data.meta,
  };
}
