import { strapiFetch } from '../../services/strapi';
import type {
  AreasInteresseQueryParams,
  StrapiAreasInteresseResponse,
} from './types';

export async function handleAreasInteresse(
  params: AreasInteresseQueryParams,
): Promise<StrapiAreasInteresseResponse> {
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

  return data;
}
