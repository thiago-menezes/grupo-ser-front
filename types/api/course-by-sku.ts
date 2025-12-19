import type { CourseDetailsDTO } from './course-details';

export type CourseBySkuResponseDTO = CourseDetailsDTO;

export type CourseBySkuErrorDTO = {
  error: string;
  message?: string;
  sku?: string;
};
