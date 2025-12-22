'use client';

import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { CitiesAutocompleteResponse } from '@/bff/handlers/cities/autocomplete';
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
        return { results: [] };
      }

      const response = await query<CitiesAutocompleteResponse>(
        '/cities/autocomplete',
        {
          q: debouncedQuery.trim(),
        },
      );

      return response;
    },
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });

  const cities: CityOption[] = data?.results ?? [];

  return {
    cities,
    isLoading,
    error,
  };
}
