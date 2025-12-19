/**
 * Strapi course transformers
 * Maps Portuguese field names from Strapi to English DTOs
 */

import type {
  CourseCoordinatorDTO,
  CourseDetailsDTO,
  CourseTeacherDTO,
  RelatedCourseDTO,
} from 'types/api/course-details';
import { getMediaUrl } from '@/packages/utils';
import type {
  StrapiCoordenacao,
  StrapiCorpoDocente,
  StrapiCourse,
} from '../handlers/courses/types-strapi';

/**
 * Helper: Extract modalities from direct relation
 */
function extractModalities(
  modalidades?: Array<{
    id: number;
    nome: string;
    slug?: string;
  }>,
) {
  if (!modalidades || modalidades.length === 0) {
    return [];
  }

  return modalidades.map((modalidade) => ({
    id: modalidade.id,
    name: modalidade.nome || '',
    slug: modalidade.slug || modalidade.nome.toLowerCase().replace(/\s+/g, '-'),
  }));
}

/**
 * Transform Strapi course to CourseDetails DTO
 */
export function transformStrapiCourse(strapi: StrapiCourse): CourseDetailsDTO {
  // Extract modalities from direct relation
  const modalities =
    strapi.modalidades && strapi.modalidades.length > 0
      ? extractModalities(strapi.modalidades)
      : [];

  // Use "sobre" for description, fallback to "descricao"
  const description = strapi.sobre || strapi.descricao || '';

  // Build base course details
  // Note: offerings, units, and pricing come from Courses API, not Strapi
  const courseDetails: CourseDetailsDTO = {
    id: strapi.id,
    name: strapi.nome,
    slug: strapi.slug,
    description,
    type: strapi.tipo || 'Não informado',
    workload: strapi.carga_horaria ? String(strapi.carga_horaria) : null,
    category: { id: 0, name: 'Graduação' },
    duration: strapi.duracao_padrao || 'Não informado',
    priceFrom: null,
    modalities,
    units: [],
    offerings: [],
    featuredImage: getMediaUrl(strapi.capa?.url ?? ''),
    methodology: strapi.metodologia || undefined,
    certificate: strapi.certificado || undefined,
    curriculumMarkdown: strapi.grade_curricular || undefined,
  };

  // Add embedded coordinator if exists
  if (strapi.curso_coordenacao) {
    courseDetails.coordinator = {
      id: strapi.curso_coordenacao.id,
      name: strapi.curso_coordenacao.nome,
      description: strapi.curso_coordenacao.descricao || '',
      phone: strapi.curso_coordenacao.telefone || undefined,
      photo: getMediaUrl(strapi.curso_coordenacao.foto?.url || ''),
    };
  }

  // Add teaching staff array with modalities
  if (strapi.curso_corpo_docentes && strapi.curso_corpo_docentes.length > 0) {
    courseDetails.teachers = strapi.curso_corpo_docentes.map((teacher) => ({
      id: teacher.id,
      name: teacher.nome,
      role: teacher.materia || 'Professor',
      photo: teacher.foto?.url,
      modalities: teacher.modalidades?.map((m) => ({
        id: m.id,
        name: m.nome,
        slug: m.slug || m.nome.toLowerCase().replace(/\s+/g, '-'),
      })),
    }));
  }

  return courseDetails;
}

/**
 * Transform Strapi coordinator to CoordinatorData DTO
 */
export function transformStrapiCoordinator(
  strapi: StrapiCoordenacao,
): CourseCoordinatorDTO {
  return {
    id: strapi.id,
    name: strapi.nome,
    description: strapi.descricao,
    photo: strapi.foto?.url,
    email: strapi.email || undefined,
    phone: strapi.telefone || undefined,
  };
}

/**
 * Transform Strapi teacher to TeacherData DTO
 */
export function transformStrapiTeacher(
  strapi: StrapiCorpoDocente,
): CourseTeacherDTO {
  return {
    id: strapi.id,
    name: strapi.nome,
    role: strapi.cargo,
    title: strapi.titulacao || undefined,
    photo: strapi.foto?.url,
  };
}

/**
 * Transform Strapi related course to RelatedCourseData DTO
 */
export function transformStrapiRelatedCourse(strapi: {
  id: number;
  nome: string;
  slug: string;
  tipo?: string | null;
  duracao_padrao?: string | null;
}): RelatedCourseDTO {
  return {
    id: strapi.id,
    name: strapi.nome,
    slug: strapi.slug,
    type: strapi.tipo || 'Não informado',
    duration: strapi.duracao_padrao || 'Não informado',
    modality: 'Não informado',
    price: null,
  };
}
