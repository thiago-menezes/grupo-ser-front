export type CourseLevel = 'graduation' | 'postgraduate';

export type CourseModality = 'presencial' | 'semipresencial' | 'ead';

export type CourseShift =
  | 'morning'
  | 'afternoon'
  | 'night'
  | 'fulltime'
  | 'virtual';

export type CourseDuration = '1-2' | '2-3' | '3-4' | '4-plus';

export type ActiveFilter = {
  id: string;
  label: string;
};

export type CourseFiltersFormValues = {
  courseLevel: CourseLevel;
  city: string;
  radius: number;
  courseName: string;
  modalities: CourseModality[];
  priceRange: {
    min: number;
    max: number;
  };
  shifts: CourseShift[];
  durations: CourseDuration[];
};

export type CourseFiltersContextValues = {
  filters: CourseFiltersFormValues;
  activeFilters: ActiveFilter[];
  activeFiltersCount: number;
  applyFilters: (filters: CourseFiltersFormValues) => void;
  resetFilters: () => void;
  handleRemoveFilter: (filterId: string) => void;
  handleClearAllFilters: () => void;
};
