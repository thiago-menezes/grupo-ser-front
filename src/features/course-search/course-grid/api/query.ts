import { useQuery } from '@tanstack/react-query';
import { CoursesResponse } from 'types/api/courses';
import type { CoursesSearchResponse } from 'types/api/courses-search';
import { useCurrentInstitution } from '@/hooks';
import { query } from '@/libs';
import {
  mapCourseLevel,
  mapDurationRange,
  mapModality,
  mapShiftToPeriodId,
} from '../mappers';
import { CityCoursesFilters, CourseFilters } from './types';

export const useQueryCourses = (
  filters: Partial<CourseFilters>,
  page: number,
  perPage: number,
) => {
  const { institutionId } = useCurrentInstitution();

  return useQuery({
    queryKey: [
      'courses',
      institutionId,
      filters.location,
      filters.radius,
      filters.modalities?.join(','),
      filters.priceMin,
      filters.priceMax,
      filters.shifts?.join(','),
      filters.durations?.join(','),
      filters.level,
      filters.courseName,
      page,
      perPage,
    ],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        institution: institutionId,
        page,
        perPage,
      };

      // Add filters to params
      if (filters.location) params.location = filters.location;
      if (filters.radius !== undefined) params.radius = filters.radius;
      if (filters.modalities && filters.modalities.length > 0) {
        // API accepts single modality, so we'll use the first one
        // If multiple, we might need to handle differently
        const mappedModality = mapModality(filters.modalities[0]);
        if (mappedModality) {
          params.modality = mappedModality;
        }
      }
      if (filters.priceMin !== undefined) params.priceMin = filters.priceMin;
      if (filters.priceMax !== undefined) params.priceMax = filters.priceMax;
      if (filters.shifts && filters.shifts.length > 0) {
        const periodId = mapShiftToPeriodId(filters.shifts[0]);
        if (periodId !== undefined) {
          params.period = periodId;
        }
      }
      if (filters.durations && filters.durations.length > 0) {
        const mappedDuration = mapDurationRange(filters.durations[0]);
        if (mappedDuration) {
          params.durationRange = mappedDuration;
        }
      }
      if (filters.level) {
        const mappedLevel = mapCourseLevel(filters.level);
        if (mappedLevel) {
          params.level = mappedLevel;
        }
      }
      if (filters.courseName) {
        params.course = filters.courseName;
      }

      return query<CoursesResponse>('/courses', { params });
    },
  });
};

function parseCityParam(cityParam: string): { city: string; state: string } {
  const legacyMatch = cityParam.match(/^city:(.+)-state:([a-z]{2})$/i);
  const legacyCitySlug = legacyMatch?.[1];
  const legacyState = legacyMatch?.[2];

  const normalized = cityParam.trim();
  const lastDash = normalized.lastIndexOf('-');
  const newCitySlug = lastDash > 0 ? normalized.slice(0, lastDash) : '';
  const newState = lastDash > 0 ? normalized.slice(lastDash + 1) : '';

  const citySlug = legacyCitySlug ?? newCitySlug;
  const state = legacyState ?? newState;

  const cityName = citySlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    city: cityName,
    state: state.toUpperCase(),
  };
}

export const useQueryCityBasedCourses = (
  filters: Partial<CityCoursesFilters>,
  page: number,
  perPage: number,
) => {
  const { institutionId } = useCurrentInstitution();

  const { city, state } = filters.city
    ? parseCityParam(filters.city)
    : { city: '', state: '' };

  return useQuery({
    queryKey: [
      'courses',
      'city',
      institutionId,
      state,
      city,
      filters.modalities?.join(','),
      filters.shifts?.join(','),
      filters.durations?.join(','),
      filters.courseName,
      page,
      perPage,
    ],
    queryFn: async () => {
      const params: Record<string, string | number | string[]> = {
        institution: institutionId,
        state,
        city,
        page,
        perPage,
      };

      if (filters.modalities && filters.modalities.length > 0) {
        params.modalities = filters.modalities;
      }
      if (filters.shifts && filters.shifts.length > 0) {
        params.shifts = filters.shifts;
      }
      if (filters.durations && filters.durations.length > 0) {
        params.durations = filters.durations;
      }
      if (filters.courseName) {
        params.courseName = filters.courseName;
      }

      return query<CoursesResponse>('/courses/by-city', params);
    },
    enabled: !!city && !!state && !!institutionId,
  });
};

export const useQueryCoursesSearch = (
  filters: Partial<CityCoursesFilters>,
  page: number = 1,
  perPage: number = 12,
) => {
  const { city, state } = filters.city
    ? parseCityParam(filters.city)
    : { city: '', state: '' };

  return useQuery({
    queryKey: [
      'courses-search',
      state,
      city,
      filters.modalities?.join(','),
      filters.shifts?.join(','),
      filters.durations?.join(','),
      filters.courseName,
      page,
      perPage,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (city) params.set('city', city);
      if (state) params.set('state', state);
      params.set('page', page.toString());
      params.set('perPage', perPage.toString());

      if (filters.modalities && filters.modalities.length > 0) {
        filters.modalities.forEach((m) => params.append('modalities', m));
      }
      if (filters.shifts && filters.shifts.length > 0) {
        filters.shifts.forEach((s) => params.append('shifts', s));
      }
      if (filters.durations && filters.durations.length > 0) {
        filters.durations.forEach((d) => params.append('durations', d));
      }
      if (filters.courseName) {
        params.set('course', filters.courseName);
      }

      const response = await fetch(`/api/courses?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: Failed to fetch courses`,
        );
      }

      return response.json() as Promise<CoursesSearchResponse>;
    },
    enabled: !!city && !!state,
  });
};
