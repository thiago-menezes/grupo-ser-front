import type { CourseEnrollmentDTO } from 'types/api/course-details';
import type { CourseData, CourseModality } from 'types/api/courses';
import type { Course, CourseDetails, Turno } from '../handlers/courses/api';
import type {
  FormasIngresso,
  TiposPagamento,
  ValoresPagamento,
  OfertaEntrada,
} from '../handlers/offers';
import type { Unit } from '../handlers/units/api';

export type ClientUnit = {
  id: number;
  name: string;
  state: string;
  city: string;
};

export function transformClientUnit(apiUnit: Unit): ClientUnit {
  return {
    id: apiUnit.ID,
    name: apiUnit.Nome_Unidade,
    state: apiUnit.Estado,
    city: apiUnit.Cidade,
  };
}

export function transformClientUnits(apiUnits: Unit[]): ClientUnit[] {
  return apiUnits.map(transformClientUnit);
}

function extractCategory(courseName: string): string {
  const upper = courseName.toUpperCase();
  if (upper.startsWith('TECNOLOGIA') || upper.startsWith('TECNÓLOGO')) {
    return 'Tecnólogo';
  }
  return 'Graduação';
}

function extractDegree(courseName: string): string {
  const upper = courseName.toUpperCase();
  if (upper.startsWith('BACHARELADO')) return 'Bacharelado';
  if (upper.startsWith('LICENCIATURA')) return 'Licenciatura';
  if (upper.startsWith('TECNOLOGIA') || upper.startsWith('TECNÓLOGO'))
    return 'Tecnólogo';
  return 'Graduação';
}

function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) return `${months} meses`;
  if (remainingMonths === 0) return `${years} anos`;
  return `${years} anos e ${remainingMonths} meses`;
}

function mapModality(apiModality: string): CourseModality {
  const normalized = apiModality.toLowerCase();
  if (normalized === 'presencial') return 'presencial';
  if (normalized === 'ead') return 'ead';
  if (normalized === 'semipresencial') return 'semipresencial';
  return 'presencial';
}

function generateSlug(id: string): string {
  return id.toLowerCase().replace(/\./g, '-');
}

export function transformClientCourse(course: Course, unit: Unit): CourseData {
  return {
    id: course.ID,
    category: extractCategory(course.Nome_Curso),
    title: course.Nome_Curso,
    degree: extractDegree(course.Nome_Curso),
    duration: formatDuration(course.Periodo),
    modalities: [mapModality(course.Modalidade)],
    priceFrom: 'A consultar',
    campusName: unit.Nome_Unidade,
    campusCity: unit.Cidade,
    campusState: unit.Estado,
    slug: generateSlug(course.ID),
    sku: course.ID,
    unitId: unit.ID,
  };
}

export function transformClientCourses(
  coursesWithUnits: Array<{ course: Course; unit: Unit }>,
): CourseData[] {
  return coursesWithUnits.map(({ course, unit }) =>
    transformClientCourse(course, unit),
  );
}

export function transformClientApiCourseEnrollment(
  details: CourseDetails,
): CourseEnrollmentDTO {
  return {
    courseId: details.ID,
    courseName: details.Nome_Curso,
    modality: details.Modalidade,
    durationMonths: details.Periodo,
    shifts: (details.Turnos || []).map((turno: Turno) => ({
      id: typeof turno.ID === 'string' ? parseInt(turno.ID, 10) || 0 : turno.ID,
      name: turno.Nome_Turno,
      period: turno.Periodo,
      courseShiftHash: turno.Hash_CursoTurno,
      admissionForms: (turno.FormasIngresso || []).map(
        (forma: FormasIngresso) => ({
          id: forma.ID,
          name: forma.Nome_FormaIngresso,
          code: forma.Codigo,
          paymentTypes: (forma.TiposPagamento || []).map(
            (tipoPagamento: TiposPagamento) => ({
              id: tipoPagamento.ID,
              name: tipoPagamento.Nome_TipoPagamento,
              code: tipoPagamento.Codigo,
              checkoutUrl: tipoPagamento.LinkCheckout,
              paymentOptions: (tipoPagamento.ValoresPagamento || []).map(
                (valor: ValoresPagamento) => {
                  const parsedMonthly = Number.parseFloat(valor.Mensalidade);
                  const parsedBase = Number.parseFloat(valor.PrecoBase);

                  return {
                    id: valor.ID,
                    value: valor.Valor,
                    campaignTemplate: valor.TemplateCampanha,
                    entryOffer: (valor.OfertaEntrada || []).map(
                      (oferta: OfertaEntrada) => ({
                        startMonth: oferta.mesInicio,
                        endMonth: oferta.mesFim,
                        type:
                          oferta.Tipo === 'Percentual' ? 'Percent' : 'Amount',
                        value: oferta.Valor,
                      }),
                    ),
                    basePrice: valor.PrecoBase,
                    monthlyPrice: valor.Mensalidade,
                    validFrom: valor.InicioVigencia,
                    validTo: valor.FimVigencia,
                    coveragePriority: valor.PrioridadeAbrangencia,
                    parsed: {
                      currency: 'BRL',
                      basePrice: Number.isFinite(parsedBase)
                        ? parsedBase
                        : null,
                      monthlyPrice: Number.isFinite(parsedMonthly)
                        ? parsedMonthly
                        : null,
                    },
                  };
                },
              ),
            }),
          ),
        }),
      ),
    })),
  };
}
