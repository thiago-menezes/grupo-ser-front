import type { CourseDetailsDTO } from './course-details';

export type CoursesSlugResponseDTO = CourseDetailsDTO;

export type CoursesSlugErrorDTO = {
  error: string;
  message?: string;
};
