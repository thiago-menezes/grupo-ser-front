import type { CourseDetails } from '@/features/course-details/types';
import { strapiFetch } from '../../services/strapi';
import { transformStrapiCourse } from '../../transformers/course-strapi';
import type { StrapiCourseResponse } from './types-strapi';

export type CourseDetailsParams = {
  courseId?: string;
  courseSku?: string;
};

export async function handleCourseDetailsFromStrapi(
  params: CourseDetailsParams,
): Promise<CourseDetails> {
  try {
    const courseId = params.courseId?.trim();
    const courseSku = params.courseSku?.trim();

    if (!courseId && !courseSku) {
      throw new Error('CourseDetailsParams must include courseId or courseSku');
    }

    const courseResponse = await strapiFetch<StrapiCourseResponse>('courses', {
      filters: {
        ...(courseId
          ? { id_do_curso: { $eq: courseId } }
          : { sku: { $eq: courseSku } }),
      },
      populate: '*',
      params: { publicationState: 'preview' },
    });

    if (!courseResponse.data || courseResponse.data.length === 0) {
      throw new Error(
        courseId
          ? `Course not found with courseId: ${courseId}`
          : `Course not found with SKU: ${courseSku}`,
      );
    }

    const strapiCourse = courseResponse.data[0];
    const courseDetails = transformStrapiCourse(strapiCourse);

    if (strapiCourse.projeto_pedagogico) {
      courseDetails.pedagogicalProject = {
        content: strapiCourse.projeto_pedagogico,
      };
    }

    if (strapiCourse.areas_atuacao && strapiCourse.areas_atuacao.length > 0) {
      courseDetails.jobMarketAreas = strapiCourse.areas_atuacao;
    }

    if (
      strapiCourse.faixas_salariais &&
      strapiCourse.faixas_salariais.length > 0
    ) {
      courseDetails.salaryRanges = strapiCourse.faixas_salariais;
    }

    return courseDetails;
  } catch (error) {
    console.error('[CourseDetails] Error fetching from Strapi:', error);
    throw error;
  }
}
