/**
 * Strapi course transformers
 * Maps Portuguese field names from Strapi to English DTOs
 */

import type { CourseDetailsDTO } from 'types/api/course-details';
import { getMediaUrl } from '@/utils';
import type {
  StrapiCourse,
  StrapiModality,
  StrapiFAQ,
  StrapiTeacher,
} from '../handlers/courses/types-strapi';

/**
 * Transform Strapi course to CourseDetails DTO
 */
export function transformStrapiCourse(strapi: StrapiCourse): CourseDetailsDTO {
  return {
    id: strapi.id,
    courseId: strapi.id_do_curso,
    name: strapi.nome,
    description: strapi.sobre,
    methodology: strapi.metodologia,
    curriculumGrid: strapi.grade_curricular,
    certificate: strapi.certificado,
    featuredImage: getMediaUrl(strapi.capa?.url ?? ''),
    institution: strapi.instituicao
      ? {
          id: strapi.instituicao.id,
          documentId: strapi.instituicao.documentId,
          name: strapi.instituicao.nome,
          slug: strapi.instituicao.slug,
        }
      : undefined,
    pedagogicalProject: strapi.projeto_pedagogico,
    featured: strapi.destaque ?? false,
    modalities: strapi.modalidades?.map((m: StrapiModality) => ({
      id: m.id,
      name: m.nome,
      slug: m.slug,
    })),
    faqs: strapi.faqs?.map((f: StrapiFAQ) => ({
      question: f.pergunta,
      answer: f.resposta,
    })),
    teachers: strapi.corpo_de_docentes?.map((t: StrapiTeacher) => ({
      id: t.id,
      name: t.nome,
      role: t.cargo,
      bio: t.biografia,
      image: t.foto?.url ? getMediaUrl(t.foto.url) : undefined,
    })),
    coordinators: strapi.coordenadores?.map((t: StrapiTeacher) => ({
      id: t.id,
      name: t.nome,
      role: t.cargo,
      bio: t.biografia,
      image: t.foto?.url ? getMediaUrl(t.foto.url) : undefined,
    })),
  };
}
