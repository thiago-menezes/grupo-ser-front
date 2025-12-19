import type { CourseCard } from 'types/api/courses-search';
import type { AggregatedCourse } from '../handlers/courses/aggregator';
import {
  normalizeModality,
  normalizeShift,
  normalizeLevel,
  calculateDurationText,
  formatPrice,
} from '../handlers/courses/aggregator';

export function transformCourseToCard(course: AggregatedCourse): CourseCard {
  const modalities = Array.from(course.modalities).map(normalizeModality);
  const shifts = Array.from(course.shifts).map(normalizeShift);

  return {
    courseId: course.courseId,
    courseName: course.courseName,
    level: normalizeLevel(course.level),
    modalities,
    shifts,
    durationMonths: course.durationMonths,
    durationText: calculateDurationText(course.durationMonths),
    minPrice: course.minPrice,
    priceText: formatPrice(course.minPrice),
    campus: course.campus,
    city: course.city,
    state: course.state,
    brand: course.brand,
  };
}

export function transformCoursesToCards(
  courses: AggregatedCourse[],
): CourseCard[] {
  return courses.map(transformCourseToCard);
}
