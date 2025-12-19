export type CourseUnitDTO = {
  id: number;
  name: string;
  state: string;
  city: string;
};

export type CoursesUnitsResponseDTO = {
  data: CourseUnitDTO[];
  meta: {
    total: number;
    institution: string;
    state: string;
    city: string;
    courseId: string;
  };
};

export type CoursesUnitsErrorDTO = {
  error: string;
  message?: string;
};
