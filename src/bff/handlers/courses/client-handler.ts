import type { CoursesResponse, CourseData } from 'types/api/courses';
import { transformClientCourse } from '../../transformers/client-api';
import { fetchUnits } from '../units/api';
import { fetchCoursesByUnit, fetchCourseDetails, CourseDetails } from './api';

const DEFAULT_PER_PAGE = 12;
const DURATION_RANGES = {
  ONE_TO_TWO: '1-2',
  TWO_TO_THREE: '2-3',
  THREE_TO_FOUR: '3-4',
  FOUR_PLUS: '4-plus',
  FOUR_PLUS_ALT: '4+',
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

export async function fetchCityCourses(
  params: CityCoursesParams,
): Promise<CoursesResponse> {
  const {
    institution,
    estado,
    cidade,
    page = 1,
    perPage = DEFAULT_PER_PAGE,
  } = params;

  try {
    const unitsResponse = await fetchUnits(institution, estado, cidade);

    if (!unitsResponse.Unidades || unitsResponse.Unidades.length === 0) {
      return {
        total: 0,
        currentPage: page,
        totalPages: 0,
        perPage,
        courses: [],
      };
    }

    const coursePromises = unitsResponse.Unidades.map((unit) =>
      fetchCoursesByUnit(institution, estado, cidade, unit.ID)
        .then((coursesResponse) => ({
          unit,
          courses: coursesResponse.Cursos || [],
        }))
        .catch((error) => {
          console.error(`Failed to fetch courses for unit ${unit.ID}:`, error);
          return { unit, courses: [] };
        }),
    );

    const coursesResults = await Promise.all(coursePromises);

    const allCoursesWithUnits = coursesResults.flatMap(({ unit, courses }) =>
      courses.map((course) => ({ course, unit })),
    );

    let transformedCourses: CourseData[] = allCoursesWithUnits.map(
      ({ course, unit }) => transformClientCourse(course, unit),
    );

    transformedCourses = applyFilters(transformedCourses, params);

    const total = transformedCourses.length;
    const totalPages = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedCourses = transformedCourses.slice(startIndex, endIndex);

    const coursesWithPrices = await enrichCoursesWithPrices(
      paginatedCourses,
      institution,
      estado,
      cidade,
    );

    return {
      total,
      currentPage: page,
      totalPages,
      perPage,
      courses: coursesWithPrices,
    };
  } catch (error) {
    console.error('Error fetching city courses:', error);
    throw error;
  }
}

async function enrichCoursesWithPrices(
  courses: CourseData[],
  institution: string,
  estado: string,
  cidade: string,
): Promise<CourseData[]> {
  const pricePromises = courses.map(async (course) => {
    try {
      if (!course.sku || !course.unitId) {
        console.warn(`Missing SKU or unitId for course: ${course.title}`);
        return course;
      }

      const details = await fetchCourseDetails(
        institution,
        estado,
        cidade,
        course.unitId,
        course.sku,
      );

      const price = extractLowestPrice(details);

      if (price !== null) {
        return {
          ...course,
          priceFrom: `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        };
      }

      return course;
    } catch (error) {
      console.error(`Failed to fetch pricing for course ${course.sku}:`, error);
      return course;
    }
  });

  return Promise.all(pricePromises);
}

function extractLowestPrice(details: CourseDetails): number | null {
  let lowestPrice: number | null = null;

  for (const turno of details.Turnos || []) {
    for (const forma of turno.FormasIngresso || []) {
      for (const tipoPagamento of forma.TiposPagamento || []) {
        for (const valor of tipoPagamento.ValoresPagamento || []) {
          const mensalidade = parseFloat(valor.Mensalidade);
          if (!isNaN(mensalidade)) {
            if (lowestPrice === null || mensalidade < lowestPrice) {
              lowestPrice = mensalidade;
            }
          }
        }
      }
    }
  }

  return lowestPrice;
}

function applyFilters(
  courses: CourseData[],
  params: CityCoursesParams,
): CourseData[] {
  let filtered = courses;

  if (params.modalities && params.modalities.length > 0) {
    filtered = filtered.filter((course) =>
      course.modalities.some((modality) =>
        params.modalities!.includes(modality),
      ),
    );
  }

  if (params.courseName) {
    const searchTerm = params.courseName.toLowerCase();
    filtered = filtered.filter((course) =>
      course.title.toLowerCase().includes(searchTerm),
    );
  }

  if (params.durations && params.durations.length > 0) {
    filtered = filtered.filter((course) => {
      const match = course.duration.match(/(\d+)\s+anos?/);
      if (!match) return false;

      const years = parseInt(match[1], 10);

      return params.durations!.some((range) => {
        if (range === DURATION_RANGES.ONE_TO_TWO)
          return years >= 1 && years <= 2;
        if (range === DURATION_RANGES.TWO_TO_THREE)
          return years >= 2 && years <= 3;
        if (range === DURATION_RANGES.THREE_TO_FOUR)
          return years >= 3 && years <= 4;
        if (
          range === DURATION_RANGES.FOUR_PLUS ||
          range === DURATION_RANGES.FOUR_PLUS_ALT
        )
          return years >= 4;
        return false;
      });
    });
  }

  return filtered;
}
