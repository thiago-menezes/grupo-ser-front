import { strapiFetch } from '../../services/strapi';
import { transformEMec } from './transformer';
import type {
  EMecQueryParams,
  StrapiEMecResponse,
  EMecResponseDTO,
} from './types';

export async function handleEMec(
  params: EMecQueryParams,
): Promise<EMecResponseDTO> {
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

  if (!data) {
    return {
      data: [],
      meta: { pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } },
    };
  }

  return {
    data: data.data.map(transformEMec),
    meta: data.meta,
  };
}
