import type { CourseData } from 'types/api/courses';

export type CourseCardProps = {
  course: CourseData;
  onClick?: (course: CourseData) => void;
  className?: string;
};
