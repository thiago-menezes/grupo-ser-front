export type CityCoursesFilters = {
  city: string;
  modalities: string[];
  shifts: string[];
  durations: string[];
  courseName: string;
  precoMin?: number;
  precoMax?: number;
};

export type CourseFilters = {
  location: string;
  radius: number;
  modalities: string[];
  priceMin: number;
  priceMax: number;
  shifts: string[];
  durations: string[];
  level: string;
  courseName: string;
};
