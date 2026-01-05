import { useQuery } from '@tanstack/react-query';
import type { ModalitiesResponseDTO } from '@/bff/handlers/modalidades/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useModalities(institutionSlug?: string) {
  const { data, error, isLoading } = useQuery<ModalitiesResponseDTO>({
    queryKey: ['modalities', institutionSlug],
    queryFn: () =>
      fetcher(`/api/modalities?institutionSlug=${institutionSlug}`),
    enabled: !!institutionSlug,
  });

  return {
    data,
    isLoading,
    isError: error,
  };
}
