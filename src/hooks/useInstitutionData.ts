'use client';

import { useEffect, useState } from 'react';
import { useCurrentInstitution } from './useInstitution';

export type InstitutionData = {
  id: number;
  name: string;
  slug: string;
  code: string;
  defaultCity?: string | null;
  defaultState?: string | null;
  active: boolean;
};

export function useInstitutionData() {
  const { institutionSlug } = useCurrentInstitution();
  const [institution, setInstitution] = useState<InstitutionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInstitution = async () => {
      if (!institutionSlug) {
        setInstitution(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `/api/institutions?slug=${institutionSlug}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch institution: ${response.status}`);
        }

        const data = await response.json();
        setInstitution(data.institution || null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setInstitution(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstitution();
  }, [institutionSlug]);

  return {
    institution,
    isLoading,
    error,
    defaultCity: institution?.defaultCity || null,
    defaultState: institution?.defaultState || null,
  };
}
