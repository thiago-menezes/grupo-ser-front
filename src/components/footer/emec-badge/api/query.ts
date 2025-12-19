import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';
import type { EMecResponseDTO } from './types';

export const useEMec = (institutionSlug: string) => {
  return useQuery<EMecResponseDTO>({
    queryKey: ['footer', 'e-mec', institutionSlug],
    queryFn: () => query<EMecResponseDTO>('/e-mec', { institutionSlug }),
  });
};
