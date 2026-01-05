import { strapiFetch } from '../../services/strapi';
import { transformFaq } from './transformer';
import type {
  PerguntasFrequentesQueryParams,
  StrapiPerguntasFrequentesResponse,
  PerguntasFrequentesResponseDTO,
} from './types';

export async function handlePerguntasFrequentes(
  params: PerguntasFrequentesQueryParams,
): Promise<PerguntasFrequentesResponseDTO> {
  const data = await strapiFetch<StrapiPerguntasFrequentesResponse>(
    'perguntas-frequentes',
    {
      filters: {
        instituicao: {
          slug: { $eq: params.institutionSlug },
        },
      },
      populate: 'instituicao',
      sort: ['pergunta:ASC'],
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
    data: data.data.map(transformFaq),
    meta: data.meta,
  };
}
