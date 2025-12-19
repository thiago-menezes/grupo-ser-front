export type CourseModality = 'presencial' | 'semipresencial' | 'ead';

export type CoursesQueryParams = {
  institution?: string; // slug or id
  location?: string; // city as free text
  page?: number;
  perPage?: number;
  modality?: number;
  category?: number;
  enrollmentOpen?: boolean;
  period?: number; // Turno
  priceMin?: number;
  priceMax?: number;
  durationRange?: '1-2' | '2-3' | '3-4' | '4+';
  level?: 'graduacao' | 'pos-graduacao';
  course?: string; // course slug or id
};

export type CityCoursesParams = {
  institution: string;
  estado: string;
  cidade: string;
  modalities?: string[];
  shifts?: string[];
  durations?: string[];
  courseName?: string;
  page?: number;
  perPage?: number;
};

export type CourseData = {
  id: string;
  category: string;
  title: string;
  degree: string;
  duration: string;
  modalities: CourseModality[];
  priceFrom: string;
  campusName: string;
  campusCity: string;
  campusState: string;
  slug: string;
  sku?: string;
  unitId?: number;
  admissionForm?: string;
};

export type CoursesResponse = {
  total: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
  courses: CourseData[];
};
