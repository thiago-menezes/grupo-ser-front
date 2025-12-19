import type { CourseAPIRaw } from '../../services/courses-api/types';

export type AggregatedCourse = {
  courseId: string;
  courseName: string;
  level: string;
  modalities: Set<string>;
  shifts: Set<string>;
  durationMonths: number;
  minPrice: number;
  campus: string;
  campusId: string;
  city: string;
  state: string;
  brand: string;
};

export function aggregateCourses(
  rawCourses: CourseAPIRaw[],
): AggregatedCourse[] {
  const coursesMap = new Map<string, AggregatedCourse>();

  for (const raw of rawCourses) {
    const courseId = raw.Curso_ID;

    if (!coursesMap.has(courseId)) {
      coursesMap.set(courseId, {
        courseId: raw.Curso_ID,
        courseName: raw.Curso_Nome,
        level: raw.Nivel_Ensino,
        modalities: new Set([raw.Modalidade]),
        shifts: new Set([raw.Turno_Nome]),
        durationMonths: raw.Periodo,
        minPrice: raw.Valor,
        campus: raw.Unidade_Nome,
        campusId: raw.Unidade_ID,
        city: raw.Cidade,
        state: raw.Estado,
        brand: raw.Marca_Nome,
      });
    } else {
      const course = coursesMap.get(courseId)!;

      course.modalities.add(raw.Modalidade);
      course.shifts.add(raw.Turno_Nome);

      if (raw.Valor < course.minPrice) {
        course.minPrice = raw.Valor;
      }
    }
  }

  return Array.from(coursesMap.values());
}

export function normalizeShift(shift: string): string {
  return shift;
}

export function normalizeModality(modality: string): string {
  return modality;
}

export function normalizeLevel(level: string): string {
  return level;
}

export function calculateDurationText(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }

  return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
}

export function formatPrice(price: number): string {
  return `R$ ${price.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
