import type { CourseDetailsDTO } from 'types/api/course-details';
import { transformClientApiCourseEnrollment } from '../../transformers/client-api';
import { fetchCourseDetails, CourseDetails } from './api';

export type ClientApiParams = {
  institution: string;
  state: string;
  city: string;
  unit: string;
  courseId: string;
  admissionForm?: string;
};

export async function fetchCourseDetailsFromClientApi(
  params: ClientApiParams,
): Promise<CourseDetails> {
  const { institution, state, city, unit, courseId } = params;

  const clientApiDetails = await fetchCourseDetails(
    institution,
    state,
    city,
    parseInt(unit, 10),
    courseId,
  );

  return clientApiDetails;
}

export async function handleCourseDetailsWithClientApi(
  strapiCourse: CourseDetailsDTO,
  clientApiParams: ClientApiParams,
): Promise<CourseDetailsDTO> {
  try {
    const clientApiDetails =
      await fetchCourseDetailsFromClientApi(clientApiParams);

    return {
      ...strapiCourse,
      enrollment: transformClientApiCourseEnrollment(clientApiDetails),
    };
  } catch (error) {
    console.warn('[CourseDetails] Failed to fetch Client API details:', error);
    return strapiCourse;
  }
}
