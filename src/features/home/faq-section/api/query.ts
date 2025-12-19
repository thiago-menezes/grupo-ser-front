import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';
import type { FaqsResponseDTO } from './types';

const PERGUNTAS_FREQUENTES_QUERY_KEY = ['home', 'perguntas-frequentes'];

export function usePerguntasFrequentes(institutionSlug: string) {
  return useQuery({
    queryKey: [...PERGUNTAS_FREQUENTES_QUERY_KEY, institutionSlug],
    queryFn: () => query<FaqsResponseDTO>('/faqs', { institutionSlug }),
  });
}
