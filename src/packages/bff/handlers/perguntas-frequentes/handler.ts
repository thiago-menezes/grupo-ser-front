import type { StrapiClient } from '../../services/strapi';
import type {
  PerguntasFrequentesQueryParams,
  StrapiPerguntasFrequentesResponse,
} from './types';

/**
 * Handle perguntas frequentes data request
 */
export async function handlePerguntasFrequentes(
  strapiClient: StrapiClient,
  params: PerguntasFrequentesQueryParams,
): Promise<StrapiPerguntasFrequentesResponse> {
  const data = await strapiClient.fetch<StrapiPerguntasFrequentesResponse>(
    'perguntas-frequentes',
    {
      // Note: Institution filtering removed as the field is not accessible via API
      // All FAQs are returned regardless of institution
    },
    params.noCache,
  );

  return data;
}
