import {
  clientApiFetch,
  buildClientApiUrl,
  getClientApiConfig,
} from '../../services/client-api';
import { FormasIngresso } from '../offers';

export type Turno = {
  ID: number | string;
  Nome_Turno: string;
  Periodo: string;
  FormasIngresso: FormasIngresso[];
  Hash_CursoTurno?: string;
};

export type Course = {
  ID: string;
  Nome_Curso: string;
  Modalidade: string;
  Periodo: number;
};

export type CourseDetails = {
  ID: string;
  Nome_Curso: string;
  Modalidade: string;
  Periodo: number;
  Turnos: Turno[];
};

export type CoursesResponse = {
  Cursos: Course[];
};

export type CourseSearchResult = {
  ID: string;
  Nome_Curso: string;
  Modalidade: string;
  Periodo: string;
};

export type CoursesSearchResponse = {
  data: CourseSearchResult[];
};

export type CoursesSearchParams = {
  marca?: string;
  estado?: string;
  cidade?: string;
  modalidade?: string;
};

export async function fetchCoursesByUnit(
  institution: string,
  state: string,
  city: string,
  unitId: number,
): Promise<CoursesResponse> {
  const { baseUrl } = getClientApiConfig();
  const url = `${baseUrl}/p/${institution.toLowerCase()}/${state.toLowerCase()}/${encodeURIComponent(city.toLowerCase())}/unidades/${unitId}/cursos`;
  return clientApiFetch<CoursesResponse>(url);
}

export async function fetchCourseDetails(
  institution: string,
  state: string,
  city: string,
  unitId: number,
  courseId: string,
): Promise<CourseDetails> {
  const { baseUrl } = getClientApiConfig();
  const url = `${baseUrl}/p/${institution.toLowerCase()}/${state.toLowerCase()}/${encodeURIComponent(city.toLowerCase())}/unidades/${unitId}/cursos/${courseId}`;
  return clientApiFetch<CourseDetails>(url);
}

export async function fetchCourseById(
  courseId: string,
): Promise<CourseDetails> {
  const url = buildClientApiUrl(`/cursos/${courseId}`);
  return clientApiFetch<CourseDetails>(url);
}

export async function fetchCoursesSearch(
  params: CoursesSearchParams,
): Promise<CoursesSearchResponse> {
  const url = buildClientApiUrl('/cursos', params);
  return clientApiFetch<CoursesSearchResponse>(url);
}

export function extractCourseId(fullId: string): string {
  const parts = fullId.split('.');
  return parts[parts.length - 1] || fullId;
}
