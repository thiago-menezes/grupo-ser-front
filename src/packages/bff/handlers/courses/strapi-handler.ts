/**
 * Strapi handler for course details
 * Fetches course with embedded coordinator and teachers from Strapi
 */

import type { CourseDetails } from '@/features/course-details/types';
import type { StrapiClient } from '../../services/strapi/client';
import { transformStrapiCourse } from '../../transformers/course-strapi';
import type { StrapiCourseResponse } from './types-strapi';

export type CourseDetailsParams = {
  courseId?: string;
  courseSku?: string;
};

/**
 * Handle course details request from Strapi
 * Course includes embedded coordinator and teaching staff
 */
export async function handleCourseDetailsFromStrapi(
  strapiClient: StrapiClient,
  params: CourseDetailsParams,
): Promise<CourseDetails> {
  try {
    const courseId = params.courseId?.trim();
    const courseSku = params.courseSku?.trim();

    if (!courseId && !courseSku) {
      throw new Error('CourseDetailsParams must include courseId or courseSku');
    }

    // Do not coerce to Number: courseId can be larger than Number.MAX_SAFE_INTEGER
    // and Strapi filter must match the exact value.

    // Fetch course with all relations populated
    // Using publicationState=preview to get both published and draft content
    // Using explicit deep populate to ensure nested relations (like media) are included
    const courseResponse = await strapiClient.fetch<StrapiCourseResponse>(
      'courses',
      {
        filters: {
          ...(courseId
            ? { id_do_curso: { $eq: courseId } }
            : { sku: { $eq: courseSku } }),
        },
        populate: '*',
        params: { publicationState: 'preview' },
      },
    );

    // Validate course exists
    if (!courseResponse.data || courseResponse.data.length === 0) {
      throw new Error(
        courseId
          ? `Course not found with courseId: ${courseId}`
          : `Course not found with SKU: ${courseSku}`,
      );
    }

    const strapiCourse = courseResponse.data[0];

    // Transform course data (includes embedded coordinator and teacher)
    const courseDetails = transformStrapiCourse(strapiCourse);

    // Add pedagogical project if exists
    if (strapiCourse.projeto_pedagogico) {
      courseDetails.pedagogicalProject = {
        content: strapiCourse.projeto_pedagogico,
      };
    }

    // Add job market areas if exist
    if (strapiCourse.areas_atuacao && strapiCourse.areas_atuacao.length > 0) {
      courseDetails.jobMarketAreas = strapiCourse.areas_atuacao;
    }

    // Add salary ranges if exist
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
