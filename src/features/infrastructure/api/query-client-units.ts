import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';

/**
 * Client Units Response (from BFF)
 */
export type ClientUnit = {
  id: number;
  name: string;
  state: string;
  city: string;
};

export type ClientUnitsResponse = {
  data: ClientUnit[];
  meta: {
    total: number;
    institution: string;
    state: string;
    city: string;
  };
};

export const useQueryClientUnits = (
  institution: string | undefined,
  state: string | undefined,
  city: string | undefined,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['client-api', 'units', institution, state, city],
    queryFn: () =>
      query<ClientUnitsResponse>('/units/client', {
        institution,
        state,
        city,
      }),
    enabled: enabled && !!institution && !!state && !!city,
  });
};
