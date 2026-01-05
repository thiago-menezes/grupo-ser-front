import { strapiFetch } from '../../services/strapi';
import { transformModality } from './transformer';
import type {
  ModalitiesQueryParams,
  StrapiModalitiesResponse,
  ModalitiesResponseDTO,
} from './types';

export async function handleModalities(
  params: ModalitiesQueryParams,
): Promise<ModalitiesResponseDTO> {
  const data = await strapiFetch<StrapiModalitiesResponse>(
    'modalidades',
    {
      filters: {
        instituicao: {
          slug: { $eq: params.institutionSlug },
        },
      },
      populate: 'instituicao',
      sort: ['nome:ASC'],
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
    data: data.data.map(transformModality),
    meta: data.meta,
  };
}
