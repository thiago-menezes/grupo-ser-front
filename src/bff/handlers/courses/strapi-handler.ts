import type { CourseDetailsDTO } from 'types/api/course-details';
import { strapiFetch } from '../../services/strapi';
import { transformStrapiCourse } from '../../transformers/course-strapi';
import type { StrapiCourseResponse } from './types-strapi';

export type CourseDetailsParams = {
  courseId?: string;
};

export async function handleCourseDetailsFromStrapi(
  params: CourseDetailsParams,
): Promise<CourseDetailsDTO | null> {
  const courseId = params.courseId?.trim();

  if (!courseId) {
    return null;
  }

  const courseResponse = await strapiFetch<StrapiCourseResponse>('courses', {
    filters: {
      id_do_curso: { $eq: courseId },
    },
    populate: [
      'capa',
      'instituicao',
      'coordenadores',
      'corpo_de_docentes',
      'faqs',
      'modalidades',
    ],
  });

  if (!courseResponse?.data || courseResponse.data.length === 0) {
    return null;
  }

  const strapiCourse = courseResponse.data[0];
  return transformStrapiCourse(strapiCourse);
}
