import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';
import type { AreasOfInterestResponseDTO } from './types';

export function useAreasOfInterest(institutionSlug: string) {
  return useQuery({
    queryKey: ['home', 'areas-of-interest', institutionSlug],
    queryFn: () =>
      query<AreasOfInterestResponseDTO>('/areas-of-interest', {
        institutionSlug,
      }),
  });
}
