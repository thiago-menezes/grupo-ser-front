import { strapiFetch } from '../../services/strapi';
import type { EMecQueryParams, StrapiEMecResponse } from './types';

export async function handleEMec(
  params: EMecQueryParams,
): Promise<StrapiEMecResponse> {
  const data = await strapiFetch<StrapiEMecResponse>(
    'e-mecs',
    {
      filters: {
        instituicao: {
          slug: { $eq: params.institutionSlug },
        },
      },
      populate: {
        qrcode: true,
        instituicao: true,
      },
    },
    params.noCache,
  );

  return data;
}
