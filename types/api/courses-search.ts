export type CoursesSearchParams = {
  level?: 'undergraduate' | 'graduate';
  city?: string;
  state?: string;
  course?: string;
  modalities?: string[];
  shifts?: string[];
  durations?: string[];
  precoMin?: number;
  precoMax?: number;
  page?: number;
  perPage?: number;
};

export type CourseCard = {
  courseId: string;
  courseName: string;
  level: string;
  modalities: string[];
  shifts: string[];
  durationMonths: number;
  durationText: string;
  precoMin: number;
  priceText: string;
  campus: string;
  city: string;
  state: string;
  brand: string;
};

export type FiltersCount = {
  modalities: {
    inPerson: number;
    hybrid: number;
    online: number;
  };
  shifts: {
    morning: number;
    afternoon: number;
    evening: number;
    fullTime: number;
    virtual: number;
  };
  durations: {
    '1-2': number;
    '2-3': number;
    '3-4': number;
    '4+': number;
  };
};

export type CoursesSearchResponse = {
  total: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
  courses: CourseCard[];
  filters: FiltersCount;
};

export type CoursesSearchErrorDTO = {
  error: string;
  message?: string;
};
