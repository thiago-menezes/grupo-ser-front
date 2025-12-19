import type { CourseEnrollmentDTO } from 'types/api/course-details';
import type { CourseData, CourseModality } from 'types/api/courses';
import type {
  ClientApiCourse,
  ClientApiCourseDetails,
  ClientApiUnit,
} from '../services/client-api';

/**
 * Transformed Unit DTO (English field names)
 */
export interface ClientUnit {
  id: number;
  name: string;
  state: string;
  city: string;
}

/**
 * Transform client API unit from Portuguese to English
 */
export function transformClientUnit(apiUnit: ClientApiUnit): ClientUnit {
  return {
    id: apiUnit.ID,
    name: apiUnit.Nome_Unidade,
    state: apiUnit.Estado,
    city: apiUnit.Cidade,
  };
}

/**
 * Transform array of units
 */
export function transformClientUnits(apiUnits: ClientApiUnit[]): ClientUnit[] {
  return apiUnits.map(transformClientUnit);
}

/**
 * Extract category from course name
 * Returns "Graduação" or "Tecnólogo"
 */
function extractCategory(courseName: string): string {
  const upper = courseName.toUpperCase();
  if (upper.startsWith('TECNOLOGIA') || upper.startsWith('TECNÓLOGO')) {
    return 'Tecnólogo';
  }
  return 'Graduação';
}

/**
 * Extract degree from course name
 * Parses prefix like "BACHARELADO" → "Bacharelado"
 */
function extractDegree(courseName: string): string {
  const upper = courseName.toUpperCase();
  if (upper.startsWith('BACHARELADO')) return 'Bacharelado';
  if (upper.startsWith('LICENCIATURA')) return 'Licenciatura';
  if (upper.startsWith('TECNOLOGIA') || upper.startsWith('TECNÓLOGO'))
    return 'Tecnólogo';
  return 'Graduação';
}

/**
 * Format duration from months to Portuguese text
 * Examples: 48 → "4 anos", 30 → "2 anos e 6 meses"
 */
function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) return `${months} meses`;
  if (remainingMonths === 0) return `${years} anos`;
  return `${years} anos e ${remainingMonths} meses`;
}

/**
 * Map API modality to CourseModality type
 * "Presencial" → "presencial", "EAD" → "ead", "Semipresencial" → "semipresencial"
 */
function mapModality(apiModality: string): CourseModality {
  const normalized = apiModality.toLowerCase();
  if (normalized === 'presencial') return 'presencial';
  if (normalized === 'ead') return 'ead';
  if (normalized === 'semipresencial') return 'semipresencial';
  return 'presencial'; // default
}

/**
 * Generate slug from course ID
 * Example: "4.EAD017.01" → "4-ead017-01"
 */
function generateSlug(id: string): string {
  return id.toLowerCase().replace(/\./g, '-');
}

/**
 * Transform client API course to CourseData format
 */
export function transformClientCourse(
  course: ClientApiCourse,
  unit: ClientApiUnit,
): CourseData {
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

/**
 * Transform array of courses with their unit info
 */
export function transformClientCourses(
  coursesWithUnits: Array<{ course: ClientApiCourse; unit: ClientApiUnit }>,
): CourseData[] {
  return coursesWithUnits.map(({ course, unit }) =>
    transformClientCourse(course, unit),
  );
}

export function transformClientApiCourseEnrollment(
  details: ClientApiCourseDetails,
): CourseEnrollmentDTO {
  return {
    courseId: details.ID,
    courseName: details.Nome_Curso,
    modality: details.Modalidade,
    durationMonths: details.Periodo,
    shifts: (details.Turnos || []).map((turno) => ({
      id: turno.ID,
      name: turno.Nome_Turno,
      period: turno.Periodo,
      courseShiftHash: turno.Hash_CursoTurno,
      admissionForms: (turno.FormasIngresso || []).map((forma) => ({
        id: forma.ID,
        name: forma.Nome_FormaIngresso,
        code: forma.Codigo,
        paymentTypes: (forma.TiposPagamento || []).map((tipoPagamento) => ({
          id: tipoPagamento.ID,
          name: tipoPagamento.Nome_TipoPagamento,
          code: tipoPagamento.Codigo,
          checkoutUrl: tipoPagamento.LinkCheckout,
          paymentOptions: (tipoPagamento.ValoresPagamento || []).map(
            (valor) => {
              const parsedMonthly = Number.parseFloat(valor.Mensalidade);
              const parsedBase = Number.parseFloat(valor.PrecoBase);

              return {
                id: valor.ID,
                value: valor.Valor,
                campaignTemplate: valor.TemplateCampanha,
                entryOffer: (valor.OfertaEntrada || []).map((oferta) => ({
                  startMonth: oferta.mesInicio,
                  endMonth: oferta.mesFim,
                  type: oferta.Tipo === 'Percentual' ? 'Percent' : 'Amount',
                  value: oferta.Valor,
                })),
                basePrice: valor.PrecoBase,
                monthlyPrice: valor.Mensalidade,
                validFrom: valor.InicioVigencia,
                validTo: valor.FimVigencia,
                coveragePriority: valor.PrioridadeAbrangencia,
                parsed: {
                  currency: 'BRL',
                  basePrice: Number.isFinite(parsedBase) ? parsedBase : null,
                  monthlyPrice: Number.isFinite(parsedMonthly)
                    ? parsedMonthly
                    : null,
                },
              };
            },
          ),
        })),
      })),
    })),
  };
}
