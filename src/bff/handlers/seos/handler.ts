import type { SeosResponseDTO } from 'types/api/seos';
import { strapiFetch } from '../../services/strapi';
import type { SeoQueryParams } from './types';

export async function handleSeo(
  params: SeoQueryParams,
): Promise<SeosResponseDTO> {
  const data = await strapiFetch<SeosResponseDTO>(
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

  return data;
}
