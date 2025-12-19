'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, useEffect } from 'react';
import { AutocompleteResponse } from 'types/api/autocomplete';
import { query } from '@/libs';

export type CityOption = {
  label: string;
  value: string;
  city: string;
  state: string;
};

const DEBOUNCE_DELAY = 300;

/**
 * Hook for searching cities with autocomplete
 * Includes debounce to avoid excessive API calls
 */
export function useCitiesAutocomplete(searchQuery: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['cities-autocomplete', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.trim().length < 2) {
        return { type: 'cities' as const, results: [] };
      }

      const response = await query<AutocompleteResponse>(
        '/courses/autocomplete',
        {
          type: 'cities',
          q: debouncedQuery.trim(),
        },
      );

      return response;
    },
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });

  const cities: CityOption[] = useMemo(() => {
    if (!data || data.type !== 'cities') {
      return [];
    }

    return data.results
      .map((result) => {
        if ('city' in result && 'state' in result) {
          return {
            label: result.label,
            value: result.value,
            city: result.city,
            state: result.state,
          };
        }
        return null;
      })
      .filter((city): city is CityOption => city !== null);
  }, [data]);

  return {
    cities,
    isLoading,
    error,
  };
}
