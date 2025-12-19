/**
 * Client API Courses Handler
 * Orchestrates units + courses fetching with proper error handling
 */

import type { CoursesResponse, CourseData } from 'types/api/courses';
import type {
  ClientApiClient,
  ClientApiCourseDetails,
} from '../../services/client-api';
import { transformClientCourse } from '../../transformers/client-api';

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

/**
 * Fetch all courses for a city by fetching units first, then courses for each unit
 */
export async function fetchCityCourses(
  clientApi: ClientApiClient,
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
    // Step 1: Fetch units for the city
    const unitsResponse = await clientApi.fetchUnits(
      institution,
      estado,
      cidade,
    );

    if (!unitsResponse.Unidades || unitsResponse.Unidades.length === 0) {
      return {
        total: 0,
        currentPage: page,
        totalPages: 0,
        perPage,
        courses: [],
      };
    }

    // Step 2: Fetch courses for all units in parallel
    const coursePromises = unitsResponse.Unidades.map((unit) =>
      clientApi
        .fetchCoursesByUnit(institution, estado, cidade, unit.ID)
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

    // Step 3: Flatten all courses and transform them
    const allCoursesWithUnits = coursesResults.flatMap(({ unit, courses }) =>
      courses.map((course) => ({ course, unit })),
    );

    let transformedCourses: CourseData[] = allCoursesWithUnits.map(
      ({ course, unit }) => transformClientCourse(course, unit),
    );

    // Step 4: Apply filters
    transformedCourses = applyFilters(transformedCourses, params);

    // Step 5: Apply pagination
    const total = transformedCourses.length;
    const totalPages = Math.ceil(total / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedCourses = transformedCourses.slice(startIndex, endIndex);

    // Step 6: Fetch pricing details for paginated courses in parallel
    const coursesWithPrices = await enrichCoursesWithPrices(
      clientApi,
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

/**
 * Enrich courses with pricing information from course details endpoint
 * Fetches pricing for paginated courses only (e.g., 12 courses per page)
 */
async function enrichCoursesWithPrices(
  clientApi: ClientApiClient,
  courses: CourseData[],
  institution: string,
  estado: string,
  cidade: string,
): Promise<CourseData[]> {
  // Fetch course details in parallel for all paginated courses
  const pricePromises = courses.map(async (course) => {
    try {
      // Only fetch if we have the required data
      if (!course.sku || !course.unitId) {
        console.warn(`Missing SKU or unitId for course: ${course.title}`);
        return course;
      }

      const details = await clientApi.fetchCourseDetails(
        institution,
        estado,
        cidade,
        course.unitId,
        course.sku,
      );

      // Extract the lowest price from all available options
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
      return course; // Return course without pricing on error
    }
  });

  return Promise.all(pricePromises);
}

/**
 * Extract the lowest mensalidade price from course details
 */
function extractLowestPrice(details: ClientApiCourseDetails): number | null {
  let lowestPrice: number | null = null;

  // Iterate through all turnos, formas de ingresso, tipos de pagamento, and valores
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

/**
 * Apply filters to courses
 */
function applyFilters(
  courses: CourseData[],
  params: CityCoursesParams,
): CourseData[] {
  let filtered = courses;

  // Filter by modality
  if (params.modalities && params.modalities.length > 0) {
    filtered = filtered.filter((course) =>
      course.modalities.some((modality) =>
        params.modalities!.includes(modality),
      ),
    );
  }

  // Filter by course name (case-insensitive search)
  if (params.courseName) {
    const searchTerm = params.courseName.toLowerCase();
    filtered = filtered.filter((course) =>
      course.title.toLowerCase().includes(searchTerm),
    );
  }

  // Filter by duration
  if (params.durations && params.durations.length > 0) {
    filtered = filtered.filter((course) => {
      // Extract years from duration string
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

  // Note: Shift filtering is not implemented as the Client API doesn't provide shift information
  // This would require additional API data or mapping

  return filtered;
}
