import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';
import { CourseDetailsResponseDTO } from '@/types/api/course-details';
import type { CourseDetails } from '../types';

export type CourseDetailsQueryParams = {
  courseId: string;
};

async function fetchCourseDetails(
  params: CourseDetailsQueryParams,
): Promise<CourseDetails> {
  const { courseId } = params;

  const response = await query<CourseDetailsResponseDTO>('/courses/details', {
    courseId,
  });

  return response;
}

export function useQueryCourseDetails(params: CourseDetailsQueryParams) {
  const { courseId } = params;

  return useQuery({
    queryKey: ['course-details', courseId],
    queryFn: () => fetchCourseDetails(params),
    enabled: !!courseId,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });
}
