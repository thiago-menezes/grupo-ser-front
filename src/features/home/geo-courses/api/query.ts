import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';
import { CoursesResponse } from '@/types/api/courses';

export type GeoCoursesQueryParams = {
  city?: string;
  state?: string;
  page?: number;
  perPage?: number;
  enabled?: boolean;
};

export const GEO_COURSES_QUERY_KEYS = {
  all: ['geo-courses'] as const,
  lists: () => [...GEO_COURSES_QUERY_KEYS.all, 'list'] as const,
  list: (params: GeoCoursesQueryParams) =>
    [...GEO_COURSES_QUERY_KEYS.lists(), params] as const,
};

export function useQueryGeoCourses(params: GeoCoursesQueryParams) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: GEO_COURSES_QUERY_KEYS.list(queryParams),
    queryFn: () => query<CoursesResponse>('/courses'),
    enabled,
    refetchOnWindowFocus: false,
  });
}
