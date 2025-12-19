import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';
import { HOME_HERO_QUERY_KEY } from '../constants';
import type {
  CourseSearchQueryDTO,
  CourseSearchResultDTO,
  HomeCarouselResponseDTO,
} from './types';

export function useCoursesSearch(
  params: CourseSearchQueryDTO,
  enabled = false,
) {
  return useQuery({
    queryKey: [...HOME_HERO_QUERY_KEY, 'search', params],
    queryFn: () =>
      query<CourseSearchResultDTO>('/courses/search', {
        city: params.city,
        course: params.course,
        modalities: params.modalities,
      }),
    enabled,
  });
}

export type CarouselItem = {
  image: string;
  alt?: string;
  link?: string | null;
};

export function useHomeCarousel(institutionSlug: string) {
  return useQuery({
    queryKey: [...HOME_HERO_QUERY_KEY, 'carousel', institutionSlug],
    queryFn: () =>
      query<HomeCarouselResponseDTO>('/home-carousels', {
        institutionSlug,
      }),
  });
}
