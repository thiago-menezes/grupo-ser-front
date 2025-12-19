import { useQuery } from '@tanstack/react-query';
import { query } from '@/libs';
import { CourseDetailsResponseDTO } from '@/types/api/course-details';
import type { CourseDetails } from '../types';

export type CourseDetailsQueryParams = {
  courseId: string;
  institution?: string;
  state?: string;
  city?: string;
  unit?: string;
  admissionForm?: string;
};

async function fetchCourseDetails(
  params: CourseDetailsQueryParams,
): Promise<CourseDetails> {
  const { courseId, institution, state, city, unit, admissionForm } = params;

  const queryParams = new URLSearchParams();
  if (courseId) queryParams.append('courseId', courseId);
  if (institution) queryParams.append('institution', institution);
  if (state) queryParams.append('state', state);
  if (city) queryParams.append('city', city);
  if (unit) queryParams.append('unit', unit);
  if (admissionForm) queryParams.append('admissionForm', admissionForm);

  const response = await query<CourseDetailsResponseDTO>('/courses/details', {
    courseId,
    institution,
    state,
    city,
    unit,
    admissionForm,
  });

  return response;
}

export function useQueryCourseDetails(params: CourseDetailsQueryParams) {
  const { courseId, institution, state, city, unit, admissionForm } = params;

  return useQuery({
    queryKey: [
      'course-details',
      courseId,
      institution,
      state,
      city,
      unit,
      admissionForm,
    ],
    queryFn: () => fetchCourseDetails(params),
    enabled: !!courseId,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
  });
}
