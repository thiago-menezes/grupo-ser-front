'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { query } from '@/libs';
import type { ClientUnitsResponse, StrapiUnitsResponse } from './types';

/**
 * Query specific unit by ID with photos
 */
export const useQueryUnitById = (
  unitId: number | undefined,
  enabled = true,
) => {
  const params = useParams<{ institution?: string }>();
  const slug = params.institution;

  return useQuery({
    queryKey: ['strapi', 'unit', slug, unitId],
    queryFn: () =>
      query<StrapiUnitsResponse>('/units', {
        institutionSlug: slug,
        unitId: unitId?.toString(),
      }),
    enabled: enabled && !!slug && !!unitId,
  });
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
