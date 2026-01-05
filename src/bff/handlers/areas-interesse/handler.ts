import { strapiFetch } from '../../services/strapi';
import { transformAreaInteresse } from './transformer';
import type {
  AreasInteresseQueryParams,
  StrapiAreasInteresseResponse,
  AreasInteresseResponseDTO,
} from './types';

export async function handleAreasInteresse(
  params: AreasInteresseQueryParams,
): Promise<AreasInteresseResponseDTO> {
  const data = await strapiFetch<StrapiAreasInteresseResponse>(
    'areas-de-interesses',
    {
      filters: {
        instituicao: {
          slug: { $eq: params.institutionSlug },
        },
      },
      populate: {
        capa: true,
        instituicao: true,
      },
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
    data: data.data.map(transformAreaInteresse),
    meta: data.meta,
  };
}
