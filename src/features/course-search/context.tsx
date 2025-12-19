'use client';

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  startTransition,
} from 'react';
import { useCityContext } from '@/contexts/city';
import { useQueryParams } from '@/hooks';
import { DEFAULT_FILTERS } from './filters-content/constants';
import type {
  ActiveFilter,
  CourseFiltersContextValues,
  CourseFiltersFormValues,
  CourseLevel,
} from './types';

/**
 * Format city and state into URL format: city:name-state:code
 */
function formatCityForUrl(city: string, state: string): string {
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const stateCode = state.toLowerCase();
  return `${citySlug}-${stateCode}`;
}

const CourseFiltersContext = createContext<CourseFiltersContextValues>(
  {} as CourseFiltersContextValues,
);

const MODALITY_LABELS: Record<string, string> = {
  presencial: 'Presencial',
  semipresencial: 'Semipresencial',
  ead: 'EAD',
};

const SHIFT_LABELS: Record<string, string> = {
  morning: 'Manhã',
  afternoon: 'Tarde',
  night: 'Noite',
  fulltime: 'Integral',
  virtual: 'Virtual',
};

const DURATION_LABELS: Record<string, string> = {
  '1-2': '1 a 2 anos',
  '2-3': '2 a 3 anos',
  '3-4': '3 a 4 anos',
  '4-plus': 'Mais que 4 anos',
};

const COURSE_LEVEL_LABELS: Record<string, string> = {
  graduation: 'Graduação',
  postgraduate: 'Pós-graduação',
};

function buildActiveFilters(filters: CourseFiltersFormValues): ActiveFilter[] {
  const activeFilters: ActiveFilter[] = [];

  if (filters.courseName) {
    activeFilters.push({
      id: 'courseName',
      label: filters.courseName,
    });
  }

  // NOTE: City filter is not shown as an active filter badge
  // because it's always visible in the autocomplete input

  if (
    filters.courseLevel &&
    filters.courseLevel !== DEFAULT_FILTERS.courseLevel
  ) {
    activeFilters.push({
      id: 'courseLevel',
      label: COURSE_LEVEL_LABELS[filters.courseLevel] || filters.courseLevel,
    });
  }

  filters.modalities.forEach((modality) => {
    activeFilters.push({
      id: `modality-${modality}`,
      label: MODALITY_LABELS[modality] || modality,
    });
  });

  filters.shifts.forEach((shift) => {
    activeFilters.push({
      id: `shift-${shift}`,
      label: SHIFT_LABELS[shift] || shift,
    });
  });

  filters.durations.forEach((duration) => {
    activeFilters.push({
      id: `duration-${duration}`,
      label: DURATION_LABELS[duration] || duration,
    });
  });

  if (
    filters.priceRange.min !== DEFAULT_FILTERS.priceRange.min ||
    filters.priceRange.max !== DEFAULT_FILTERS.priceRange.max
  ) {
    activeFilters.push({
      id: 'priceRange',
      label: `R$ ${filters.priceRange.min} - R$ ${filters.priceRange.max}`,
    });
  }

  if (filters.radius !== DEFAULT_FILTERS.radius) {
    activeFilters.push({
      id: 'radius',
      label: `${filters.radius} km`,
    });
  }

  return activeFilters;
}

function parseFiltersFromSearchParams(
  searchParams: URLSearchParams,
): Partial<CourseFiltersFormValues> {
  const filters: Partial<CourseFiltersFormValues> = {};

  const courseLevel = searchParams.get('courseLevel');
  if (courseLevel === 'graduation' || courseLevel === 'postgraduate') {
    filters.courseLevel = courseLevel as CourseLevel;
  }

  const city = searchParams.get('city');
  if (city) {
    filters.city = city;
  }

  const courseName = searchParams.get('course');
  if (courseName) {
    filters.courseName = courseName;
  }

  const modalities = searchParams.getAll('modalities');
  if (modalities.length > 0) {
    filters.modalities = modalities
      .map((m) => (m === 'semi' ? 'semipresencial' : m))
      .filter(
        (m): m is CourseFiltersFormValues['modalities'][number] =>
          m === 'presencial' || m === 'semipresencial' || m === 'ead',
      );
  }

  return filters;
}

export function CourseFiltersProvider({ children }: PropsWithChildren) {
  const { searchParams, setParam, setParams } = useQueryParams();
  const { city: contextCity, state: contextState } = useCityContext();

  // Initialize filters from URL params on mount, fallback to context/localStorage
  const [appliedFilters, setAppliedFilters] = useState<CourseFiltersFormValues>(
    () => {
      const urlFilters = parseFiltersFromSearchParams(
        new URLSearchParams(searchParams.toString()),
      );

      // If no city in URL but have context city, use context
      if (!urlFilters.city && contextCity && contextState) {
        urlFilters.city = formatCityForUrl(contextCity, contextState);
      }

      return {
        ...DEFAULT_FILTERS,
        ...urlFilters,
      };
    },
  );

  // Update filters when URL params change
  useEffect(() => {
    const urlFilters = parseFiltersFromSearchParams(
      new URLSearchParams(searchParams.toString()),
    );
    startTransition(() => {
      setAppliedFilters((prev) => {
        // Only update if there are actual changes to avoid unnecessary re-renders
        const hasChanges =
          (urlFilters.courseLevel &&
            urlFilters.courseLevel !== prev.courseLevel) ||
          (urlFilters.city !== undefined && urlFilters.city !== prev.city) ||
          (urlFilters.courseName !== undefined &&
            urlFilters.courseName !== prev.courseName) ||
          (urlFilters.modalities !== undefined &&
            JSON.stringify(urlFilters.modalities) !==
              JSON.stringify(prev.modalities));

        if (!hasChanges) {
          return prev;
        }

        return {
          ...prev,
          ...urlFilters,
        };
      });
    });
  }, [searchParams]);

  // Sync CityContext changes to URL (only on course search page)
  useEffect(() => {
    if (!contextCity || !contextState) return;

    const formattedCity = formatCityForUrl(contextCity, contextState);
    const currentCityInUrl = searchParams.get('city');

    // Only update if different to avoid unnecessary history entries
    if (currentCityInUrl !== formattedCity) {
      setParam('city', formattedCity);
    }
  }, [contextCity, contextState, searchParams, setParam]);

  const activeFilters = useMemo(
    () => buildActiveFilters(appliedFilters),
    [appliedFilters],
  );

  const activeFiltersCount = activeFilters.length;

  const applyFilters = useCallback(
    (filters: CourseFiltersFormValues) => {
      setAppliedFilters(filters);

      setParams(
        {
          city: filters.city || null,
          courseLevel:
            filters.courseLevel !== DEFAULT_FILTERS.courseLevel
              ? filters.courseLevel
              : null,
          course: filters.courseName.trim() ? filters.courseName.trim() : null,
          modalities: filters.modalities.length > 0 ? filters.modalities : null,
          shifts: filters.shifts.length > 0 ? filters.shifts : null,
          durations: filters.durations.length > 0 ? filters.durations : null,
          radius:
            filters.radius !== DEFAULT_FILTERS.radius
              ? String(filters.radius)
              : null,
          minPrice:
            filters.priceRange.min !== DEFAULT_FILTERS.priceRange.min
              ? String(filters.priceRange.min)
              : null,
          maxPrice:
            filters.priceRange.max !== DEFAULT_FILTERS.priceRange.max
              ? String(filters.priceRange.max)
              : null,
          page: null,
        },
        { scroll: false },
      );
    },
    [setParams],
  );

  const resetFilters = useCallback(() => {
    setAppliedFilters(DEFAULT_FILTERS);
  }, []);

  const handleRemoveFilter = useCallback((filterId: string) => {
    setAppliedFilters((prev) => {
      const updated = { ...prev };

      if (filterId === 'courseName') {
        updated.courseName = '';
      } else if (filterId === 'city') {
        // City filter cannot be removed - it's always kept
        // User must use the city autocomplete input to change it
        return prev;
      } else if (filterId === 'courseLevel') {
        updated.courseLevel = DEFAULT_FILTERS.courseLevel;
      } else if (filterId === 'priceRange') {
        updated.priceRange = { ...DEFAULT_FILTERS.priceRange };
      } else if (filterId === 'radius') {
        updated.radius = DEFAULT_FILTERS.radius;
      } else if (filterId.startsWith('modality-')) {
        const modality = filterId.replace('modality-', '');
        updated.modalities = prev.modalities.filter((m) => m !== modality);
      } else if (filterId.startsWith('shift-')) {
        const shift = filterId.replace('shift-', '');
        updated.shifts = prev.shifts.filter((s) => s !== shift);
      } else if (filterId.startsWith('duration-')) {
        const duration = filterId.replace('duration-', '');
        updated.durations = prev.durations.filter((d) => d !== duration);
      }

      return updated;
    });
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setAppliedFilters((prev) => ({
      ...DEFAULT_FILTERS,
      // Keep the city filter when clearing all filters
      city: prev.city,
    }));
  }, []);

  const contextValues: CourseFiltersContextValues = {
    filters: appliedFilters,
    activeFilters,
    activeFiltersCount,
    applyFilters,
    resetFilters,
    handleRemoveFilter,
    handleClearAllFilters,
  };

  return (
    <CourseFiltersContext.Provider value={contextValues}>
      {children}
    </CourseFiltersContext.Provider>
  );
}

export const useCourseFiltersContext = (): CourseFiltersContextValues => {
  const context = useContext(CourseFiltersContext);

  if (context === undefined) {
    throw new Error(
      'useCourseFiltersContext must be used within a CourseFiltersProvider',
    );
  }

  return context;
};
