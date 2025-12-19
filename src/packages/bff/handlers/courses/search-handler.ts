import type {
  CoursesSearchParams,
  CoursesSearchResponse,
  CourseCard,
  FiltersCount,
} from 'types/api/courses-search';
import type { CoursesApiClient } from '../../services/courses-api/client';
import type { JSONServerQueryParams } from '../../services/courses-api/types';
import { transformCoursesToCards } from '../../transformers/courses-search';
import { aggregateCourses } from './aggregator';

const DEFAULT_PER_PAGE = 12;

function mapLevelToJSONServer(level?: string): string | undefined {
  if (!level) return undefined;

  if (level === 'undergraduate') return 'Ensino Superior';
  if (level === 'graduate') return 'Pós-Graduação';

  return undefined;
}

function mapModalityToJSONServer(modality: string): string {
  const lower = modality.toLowerCase();

  if (lower === 'inperson' || lower === 'presencial') return 'Presencial';
  if (lower === 'online' || lower === 'ead') return 'EAD';
  if (lower === 'hybrid' || lower === 'semipresencial') return 'Semipresencial';

  return modality;
}

function mapShiftToJSONServer(shift: string): string {
  const lower = shift.toLowerCase();

  if (lower === 'morning') return 'Matutino';
  if (lower === 'afternoon') return 'Vespertino';
  if (lower === 'evening') return 'Noturno';
  if (lower === 'fulltime') return 'Integral';
  if (lower === 'virtual') return 'Virtual';

  return shift;
}

function applyClientSideFilters(
  courses: CourseCard[],
  params: CoursesSearchParams,
): CourseCard[] {
  let filtered = courses;

  if (params.modalities && params.modalities.length > 0) {
    filtered = filtered.filter((course) =>
      course.modalities.some((courseModality) => {
        const lower = courseModality.toLowerCase();
        return params.modalities!.some((filterMod) => {
          const filterLower = filterMod.toLowerCase();
          if (
            (filterLower === 'inperson' || filterLower === 'presencial') &&
            lower.includes('presencial') &&
            !lower.includes('semi')
          )
            return true;
          if (
            (filterLower === 'hybrid' || filterLower === 'semipresencial') &&
            lower.includes('semi')
          )
            return true;
          if (
            (filterLower === 'online' || filterLower === 'ead') &&
            (lower.includes('ead') || lower.includes('distância'))
          )
            return true;
          return false;
        });
      }),
    );
  }

  if (params.shifts && params.shifts.length > 0) {
    filtered = filtered.filter((course) =>
      course.shifts.some((courseShift) => {
        const lower = courseShift.toLowerCase();
        return params.shifts!.some((filterShift) => {
          const filterLower = filterShift.toLowerCase();
          if (filterLower === 'manha' && lower.includes('manhã')) return true;
          if (filterLower === 'tarde' && lower.includes('tarde')) return true;
          if (filterLower === 'noturno' && lower.includes('noite')) return true;
          if (filterLower === 'integral' && lower.includes('integral'))
            return true;
          if (filterLower === 'virtual' && lower.includes('virtual'))
            return true;
          return false;
        });
      }),
    );
  }

  if (params.durations && params.durations.length > 0) {
    filtered = filtered.filter((course) => {
      const years = course.durationMonths / 12;
      return params.durations!.some((range) => {
        if (range === '1-2') return years >= 1 && years <= 2;
        if (range === '2-3') return years > 2 && years <= 3;
        if (range === '3-4') return years > 3 && years <= 4;
        if (range === '4+') return years > 4;
        return false;
      });
    });
  }

  if (params.minPrice !== undefined) {
    filtered = filtered.filter((course) => course.minPrice >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    filtered = filtered.filter((course) => course.minPrice <= params.maxPrice!);
  }

  return filtered;
}

function calculateFiltersCount(courses: CourseCard[]): FiltersCount {
  const filtersCount: FiltersCount = {
    modalities: {
      inPerson: 0,
      hybrid: 0,
      online: 0,
    },
    shifts: {
      morning: 0,
      afternoon: 0,
      evening: 0,
      fullTime: 0,
      virtual: 0,
    },
    durations: {
      '1-2': 0,
      '2-3': 0,
      '3-4': 0,
      '4+': 0,
    },
  };

  for (const course of courses) {
    course.modalities.forEach((m) => {
      const lower = m.toLowerCase();
      if (lower.includes('presencial') && !lower.includes('semi'))
        filtersCount.modalities.inPerson++;
      if (lower.includes('semi')) filtersCount.modalities.hybrid++;
      if (lower.includes('ead') || lower.includes('distância'))
        filtersCount.modalities.online++;
    });

    course.shifts.forEach((t) => {
      const lower = t.toLowerCase();
      if (lower.includes('mat') || lower.includes('manhã'))
        filtersCount.shifts.morning++;
      if (lower.includes('vesp') || lower.includes('tarde'))
        filtersCount.shifts.afternoon++;
      if (lower.includes('not') || lower.includes('noite'))
        filtersCount.shifts.evening++;
      if (lower.includes('int')) filtersCount.shifts.fullTime++;
      if (lower.includes('virt')) filtersCount.shifts.virtual++;
    });

    const years = course.durationMonths / 12;
    if (years >= 1 && years <= 2) filtersCount.durations['1-2']++;
    if (years > 2 && years <= 3) filtersCount.durations['2-3']++;
    if (years > 3 && years <= 4) filtersCount.durations['3-4']++;
    if (years > 4) filtersCount.durations['4+']++;
  }

  return filtersCount;
}

export async function handleCoursesSearch(
  coursesApiClient: CoursesApiClient,
  params: CoursesSearchParams,
): Promise<CoursesSearchResponse> {
  const { page = 1, perPage = DEFAULT_PER_PAGE } = params;

  const apiParams: JSONServerQueryParams = {
    Nivel_Ensino: mapLevelToJSONServer(params.level),
    Cidade: params.city,
    Estado: params.state,
    Curso_Nome_like: params.course,
  };

  if (params.modalities && params.modalities.length === 1) {
    apiParams.Modalidade = mapModalityToJSONServer(params.modalities[0]);
  }

  if (params.shifts && params.shifts.length === 1) {
    apiParams.Turno_Nome = mapShiftToJSONServer(params.shifts[0]);
  }

  if (params.minPrice !== undefined) {
    apiParams.Valor_gte = params.minPrice;
  }

  if (params.maxPrice !== undefined) {
    apiParams.Valor_lte = params.maxPrice;
  }

  const rawCourses = await coursesApiClient.fetchCourses(apiParams);

  const coursesAggregated = aggregateCourses(rawCourses);

  let courses = transformCoursesToCards(coursesAggregated);

  courses = applyClientSideFilters(courses, params);

  const filtersCount = calculateFiltersCount(courses);

  const total = courses.length;
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const coursesPaginated = courses.slice(startIndex, endIndex);

  return {
    total,
    currentPage: page,
    totalPages,
    perPage,
    courses: coursesPaginated,
    filters: filtersCount,
  };
}
