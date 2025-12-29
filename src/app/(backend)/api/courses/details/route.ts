import { NextRequest, NextResponse } from 'next/server';
import {
  handleCourseDetailsFromStrapi,
  handleCourseDetailsWithClientApi,
  fetchCourseById,
} from '@/bff/handlers/courses';
import type { Turno } from '@/bff/handlers/courses/api';
import type {
  FormasIngresso,
  TiposPagamento,
  ValoresPagamento,
  OfertaEntrada,
} from '@/bff/handlers/offers';
import type {
  CourseDetailsErrorDTO,
  CourseDetailsResponseDTO,
  CourseShiftDTO,
  CourseAdmissionFormDTO,
  CourseEnrollmentPaymentTypeDTO,
} from '@/types/api/course-details';
import { ensureBffInitialized } from '../../services/bff';

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

function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) return `${months} meses`;
  if (remainingMonths === 0) return `${years} anos`;
  return `${years} anos e ${remainingMonths} meses`;
}

function formatPrice(value: number | null): string {
  if (value === null || value === 0) return 'A consultar';
  return `R$ ${value.toFixed(2)}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

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

    ensureBffInitialized();

    let strapiCourseDetails: CourseDetailsResponseDTO | null = null;

    try {
      strapiCourseDetails = await handleCourseDetailsFromStrapi({
        courseId,
      });
    } catch {
      // Strapi course not found, will use only API data
    }

    const courseData = await fetchCourseById(courseId);

    if (!courseData) {
      return NextResponse.json<CourseDetailsErrorDTO>(
        {
          error: 'Course not found',
          message: `No course found for courseId: ${courseId}`,
        },
        { status: 404 },
      );
    }

    let minPrice: number | null = null;
    const shiftsData: CourseShiftDTO[] =
      courseData.Turnos?.map((turno: Turno) => {
        const forms: CourseAdmissionFormDTO[] =
          turno.FormasIngresso?.map((forma: FormasIngresso) => {
            const paymentTypes: CourseEnrollmentPaymentTypeDTO[] =
              forma.TiposPagamento?.map((tipo: TiposPagamento) => {
                const price = parseFloat(tipo.Mensalidade || '0');
                if (price > 0 && (minPrice === null || price < minPrice)) {
                  minPrice = price;
                }
                return {
                  id: hashToNumber(String(tipo.ID)),
                  name: tipo.Nome_TipoPagamento,
                  code: tipo.Codigo,
                  checkoutUrl: tipo.LinkCheckout,
                  paymentOptions:
                    tipo.ValoresPagamento?.map((valor: ValoresPagamento) => ({
                      id: hashToNumber(valor.Mensalidade + valor.PrecoBase),
                      value: valor.Valor,
                      campaignTemplate: valor.TemplateCampanha || '',
                      entryOffer:
                        valor.OfertaEntrada?.map((oferta: OfertaEntrada) => ({
                          startMonth: oferta.mesInicio,
                          endMonth: oferta.mesFim,
                          type:
                            oferta.Tipo === 'Percentual'
                              ? ('Percent' as const)
                              : ('Amount' as const),
                          value: oferta.Valor,
                        })) || [],
                      basePrice: valor.PrecoBase,
                      monthlyPrice: valor.Mensalidade,
                      validFrom: '',
                      validTo: '',
                      coveragePriority: valor.PrioridadeAbrangencia,
                      parsed: {
                        currency: 'BRL' as const,
                        basePrice: parseFloat(valor.PrecoBase) || null,
                        monthlyPrice: parseFloat(valor.Mensalidade) || null,
                      },
                    })) || [],
                };
              }) || [];

            return {
              id: hashToNumber(String(forma.ID)),
              name: forma.Nome_FormaIngresso,
              code: forma.Codigo,
              paymentTypes,
            };
          }) || [];

        return {
          id: hashToNumber(String(turno.ID)),
          name: turno.Nome_Turno,
          period: formatDuration(parseInt(turno.Periodo) || courseData.Periodo),
          courseShiftHash: turno.Hash_CursoTurno,
          admissionForms: forms,
        };
      }) || [];

    const apiCourseDetails: CourseDetailsResponseDTO = {
      id: hashToNumber(courseData.ID),
      name: courseData.Nome_Curso,
      slug: courseData.ID.toString(),
      type: 'Bacharelado',
      workload: null,
      category: {
        id: 1,
        name: 'Graduação',
      },
      duration: formatDuration(courseData.Periodo),
      description: '',
      priceFrom: formatPrice(minPrice),
      modalities: [
        {
          id: hashToNumber(courseData.Modalidade),
          name: courseData.Modalidade,
          slug: mapModalitySlug(courseData.Modalidade),
        },
      ],
      units: [],
      offerings: [],
      enrollment: {
        courseId: courseData.ID.toString(),
        courseName: courseData.Nome_Curso,
        modality: courseData.Modalidade,
        durationMonths: courseData.Periodo,
        shifts: shiftsData,
      },
      video: 'https://www.youtube.com/watch?v=-_FXDCeiL3g',
    };

    let courseDetails: CourseDetailsResponseDTO = strapiCourseDetails
      ? {
          ...apiCourseDetails,
          ...strapiCourseDetails,
          name: apiCourseDetails.name,
          modalities: apiCourseDetails.modalities,
          priceFrom: apiCourseDetails.priceFrom,
          enrollment: apiCourseDetails.enrollment,
        }
      : apiCourseDetails;

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
        console.warn(
          '[CourseDetails] Failed to enrich with Client API data:',
          error,
        );
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
