import { strapiFetch } from '../../services/strapi';
import type {
  PerguntasFrequentesQueryParams,
  StrapiPerguntasFrequentesResponse,
} from './types';

export async function handlePerguntasFrequentes(
  params: PerguntasFrequentesQueryParams,
): Promise<StrapiPerguntasFrequentesResponse> {
  const data = await strapiFetch<StrapiPerguntasFrequentesResponse>(
    'perguntas-frequentes',
    {},
    params.noCache,
  );

  return data;
}
