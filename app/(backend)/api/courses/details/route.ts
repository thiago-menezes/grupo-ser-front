import { NextRequest, NextResponse } from 'next/server';
import {
  handleCourseDetailsFromStrapi,
  handleCourseDetailsWithClientApi,
} from '@/packages/bff/handlers/courses';
import {
  aggregateCourses,
  calculateDurationText,
  formatPrice,
} from '@/packages/bff/handlers/courses/aggregator';
import { createCoursesApiClient } from '@/packages/bff/services/courses-api';
import type { CourseAPIRaw } from '@/packages/bff/services/courses-api/types';
import type {
  CourseDetailsErrorDTO,
  CourseDetailsResponseDTO,
} from '@/types/api/course-details';
import { getStrapiClient } from '../../services/bff';

function hashToNumber(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return hash >>> 0;
}

function mapModalitySlug(modality: string): string {
  const lower = modality.toLowerCase();
  if (lower.includes('presencial') && !lower.includes('semi')) {
    return 'presencial';
  }
  if (lower.includes('semi')) return 'semipresencial';
  if (lower.includes('ead') || lower.includes('distância')) return 'ead';
  return 'presencial';
}

/**
 * Extract admission form code from checkout URL
 * Example: "checkout.unama.br/p/925761c1139867e3505bdf59e2450963/ENE/P" -> "ENE"
 */
function extractAdmissionFormCode(checkoutUrl: string): string {
  const parts = checkoutUrl.split('/');
  return parts[parts.length - 2] || '';
}

/**
 * Get admission form name from code
 */
function getAdmissionFormName(code: string): string {
  const formNames: Record<string, string> = {
    ENE: 'Enem',
    ESP: 'Especial',
    PRO: 'Programado',
    PDD: 'Portador de Diploma',
    TRF: 'Transferência',
    VES: 'Vestibular',
  };
  return formNames[code] || code;
}

function buildCourseDetailsFromCoursesApi(
  rawCourses: CourseAPIRaw[],
  courseId: string,
): CourseDetailsResponseDTO {
  const aggregated = aggregateCourses(rawCourses).find(
    (c) => c.courseId === courseId,
  );
  const base = aggregated ?? aggregateCourses(rawCourses)[0];

  const unitsMap = new Map<
    string,
    {
      id: number;
      name: string;
      city: string;
      state: string;
      originalId: string;
    }
  >();
  rawCourses.forEach((r) => {
    if (!unitsMap.has(r.Unidade_ID)) {
      unitsMap.set(r.Unidade_ID, {
        id: hashToNumber(r.Unidade_ID),
        name: r.Unidade_Nome,
        city: r.Cidade,
        state: r.Estado,
        originalId: r.Unidade_ID,
      });
    }
  });

  const offerings = rawCourses.map((r) => {
    const unitId = hashToNumber(r.Unidade_ID);
    const modalityId = hashToNumber(r.Modalidade);
    // Use unique hash for period to avoid collisions
    const uniquePeriodKey = `${r.Turno_ID}_${r.Turno_Nome}`;
    const periodId = hashToNumber(uniquePeriodKey);
    return {
      id: hashToNumber(r.Hash_CursoTurno),
      unitId,
      modalityId,
      periodId,
      price: r.Valor ?? null,
      duration: calculateDurationText(r.Periodo),
      enrollmentOpen: true,
      checkoutUrl: r.URL_Checkout,
      unit: {
        id: unitId,
        name: r.Unidade_Nome,
        city: r.Cidade,
        state: r.Estado,
      },
      modality: {
        id: modalityId,
        name: r.Modalidade,
        slug: mapModalitySlug(r.Modalidade),
      },
      period: {
        id: periodId,
        name: r.Turno_Nome,
      },
    };
  });

  const modalitiesUnique = Array.from(
    new Map(
      rawCourses.map((r) => [r.Modalidade, r.Modalidade] as const),
    ).values(),
  ).map((m) => {
    const id = hashToNumber(m);
    return { id, name: m, slug: mapModalitySlug(m) };
  });

  const minPrice = rawCourses.reduce<number | null>((acc, r) => {
    if (acc === null) return r.Valor;
    return r.Valor < acc ? r.Valor : acc;
  }, null);

  // Build enrollment structure from raw courses
  // Group by shift (turno) -> admission form -> payment type
  const shiftsMap = new Map<
    string,
    {
      id: number;
      name: string;
      period: string;
      courseShiftHash?: string;
      admissionForms: Map<
        string,
        {
          id: number;
          name: string;
          code: string;
          checkoutUrl: string;
          price: number | null;
        }
      >;
    }
  >();

  rawCourses.forEach((r) => {
    const shiftKey = r.Turno_ID;
    const formCode = extractAdmissionFormCode(r.URL_Checkout);

    if (!shiftsMap.has(shiftKey)) {
      // Use a combination of Turno_ID and Turno_Nome to ensure unique hash
      const uniqueShiftKey = `${r.Turno_ID}_${r.Turno_Nome}`;
      shiftsMap.set(shiftKey, {
        id: hashToNumber(uniqueShiftKey),
        name: r.Turno_Nome,
        period: `${r.Periodo} meses`,
        courseShiftHash: r.Hash_CursoTurno,
        admissionForms: new Map(),
      });
    }

    const shift = shiftsMap.get(shiftKey)!;
    if (!shift.admissionForms.has(formCode)) {
      // Use a combination for unique form ID
      const uniqueFormKey = `${r.FormaIngresso_ID}_${formCode}`;
      shift.admissionForms.set(formCode, {
        id: hashToNumber(uniqueFormKey),
        name: getAdmissionFormName(formCode),
        code: formCode,
        checkoutUrl: r.URL_Checkout,
        price: r.Valor,
      });
    }
  });

  const enrollment = {
    courseId,
    courseName: base?.courseName ?? 'Curso',
    modality: rawCourses[0]?.Modalidade ?? 'Presencial',
    durationMonths: rawCourses[0]?.Periodo ?? 0,
    shifts: Array.from(shiftsMap.values()).map((shift) => ({
      id: shift.id,
      name: shift.name,
      period: shift.period,
      courseShiftHash: shift.courseShiftHash,
      admissionForms: Array.from(shift.admissionForms.values()).map((form) => ({
        id: form.id,
        name: form.name,
        code: form.code,
        paymentTypes: [
          {
            id: hashToNumber(form.checkoutUrl),
            name: 'Parcela',
            code: 'P',
            checkoutUrl: form.checkoutUrl,
            paymentOptions: [
              {
                id: hashToNumber(form.checkoutUrl + form.price),
                value: form.price?.toString() ?? '0',
                campaignTemplate: '',
                entryOffer: [],
                basePrice: form.price?.toString() ?? '0',
                monthlyPrice: form.price?.toString() ?? '0',
                validFrom: new Date().toISOString(),
                validTo: new Date().toISOString(),
                coveragePriority: 1,
                parsed: {
                  currency: 'BRL' as const,
                  basePrice: form.price,
                  monthlyPrice: form.price,
                },
              },
            ],
          },
        ],
      })),
    })),
  };

  return {
    id: 0,
    name: base?.courseName ?? 'Curso',
    slug: courseId,
    description: '',
    type: base?.level ?? 'Não informado',
    workload: null,
    category: { id: 0, name: 'Graduação' },
    duration: calculateDurationText(
      base?.durationMonths ?? rawCourses[0]?.Periodo ?? 0,
    ),
    priceFrom: minPrice !== null ? formatPrice(minPrice) : null,
    modalities: modalitiesUnique,
    units: Array.from(unitsMap.values()),
    offerings,
    enrollment,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query params
    const courseId = searchParams.get('courseId');
    const institution = searchParams.get('institution');
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const unit = searchParams.get('unit');
    const admissionForm = searchParams.get('admissionForm');

    if (!courseId) {
      return NextResponse.json<CourseDetailsErrorDTO>(
        { error: 'courseId query parameter is required' },
        { status: 400 },
      );
    }

    let strapiCourseDetails: CourseDetailsResponseDTO | null = null;

    // Try to get base course data from Strapi (static content)
    try {
      const strapiClient = getStrapiClient();
      strapiCourseDetails = await handleCourseDetailsFromStrapi(strapiClient, {
        courseId,
      });
    } catch {
      // Strapi course not found, will use only API data
    }

    // Always fetch dynamic data (offerings, prices, shifts) from Courses API
    const coursesApiBaseUrl = process.env.COURSES_API_BASE_URL;
    if (!coursesApiBaseUrl) {
      throw new Error(
        'COURSES_API_BASE_URL environment variable is not configured',
      );
    }

    const coursesApiClient = createCoursesApiClient(coursesApiBaseUrl);
    const rawCourses = await coursesApiClient.fetchCourses({
      Curso_ID: courseId,
    });

    const filtered = rawCourses.filter((r) => {
      if (
        institution &&
        r.Marca_Nome.toLowerCase() !== institution.toLowerCase()
      ) {
        return false;
      }
      if (state && r.Estado.toLowerCase() !== state.toLowerCase()) {
        return false;
      }
      if (city && r.Cidade.toLowerCase() !== city.toLowerCase()) {
        return false;
      }
      return true;
    });

    const coursesToUse = filtered.length > 0 ? filtered : rawCourses;

    if (coursesToUse.length === 0) {
      return NextResponse.json<CourseDetailsErrorDTO>(
        {
          error: 'Course not found',
          message: `No course found for courseId: ${courseId}`,
        },
        { status: 404 },
      );
    }

    // Build dynamic data from API
    const apiCourseDetails = buildCourseDetailsFromCoursesApi(
      coursesToUse,
      courseId,
    );

    let courseDetails: CourseDetailsResponseDTO = strapiCourseDetails
      ? {
          ...apiCourseDetails,
          ...strapiCourseDetails,
          name: apiCourseDetails.name,
          offerings: apiCourseDetails.offerings,
          units: apiCourseDetails.units,
          modalities: apiCourseDetails.modalities,
          priceFrom: apiCourseDetails.priceFrom,
          enrollment: apiCourseDetails.enrollment,
        }
      : apiCourseDetails;

    // If we have Client API params, enrich with enrollment data (shifts, admission forms, payment types)
    if (institution && state && city && unit) {
      try {
        courseDetails = await handleCourseDetailsWithClientApi(courseDetails, {
          institution,
          state,
          city,
          unit,
          courseId,
          admissionForm: admissionForm || undefined,
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(
          '[CourseDetails] Failed to enrich with Client API data:',
          error,
        );
        // Continue without enrollment data
      }
    }

    return NextResponse.json<CourseDetailsResponseDTO>(courseDetails, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message.includes('not found') ? 404 : 500;

    return NextResponse.json<CourseDetailsErrorDTO>(
      {
        error: 'Failed to fetch course details',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: statusCode },
    );
  }
}
