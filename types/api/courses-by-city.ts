import type { CoursesResponse } from 'types/api/courses';

export type CoursesByCityResponseDTO = CoursesResponse;

export type CoursesByCityErrorDTO = {
  error: string;
  message?: string;
};
