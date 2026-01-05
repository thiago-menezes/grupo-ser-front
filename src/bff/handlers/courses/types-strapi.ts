/**
 * Strapi type definitions for Course-related content types
 * Maps Portuguese field names from Strapi to TypeScript types
 */

/**
 * Strapi Meta type for pagination
 */
export type StrapiMeta = {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

/**
 * Strapi Media/Image type
 */
export type StrapiMedia = {
  id: number;
  documentId?: string;
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: Record<string, unknown>;
};

/**
 * Strapi Child type for rich text blocks
 */
export type StrapiChild = {
  type: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  children?: StrapiBlock[];
};

/**
 * Strapi Block type for rich text fields
 */
export type StrapiBlock = {
  type: string;
  children?: StrapiChild[];
  level?: number;
  format?: 'unordered' | 'ordered';
};

/**
 * Strapi FAQ type
 */
export type StrapiFAQ = {
  id: number;
  pergunta: string;
  resposta: string;
};

/**
 * Strapi Teacher/Coordinator type
 */
export type StrapiTeacher = {
  id: number;
  nome: string;
  cargo: string;
  biografia: string;
  foto?: StrapiMedia | null;
};

/**
 * Strapi Modality type
 */
export type StrapiModality = {
  id: number;
  documentId: string;
  nome: string;
  slug: string;
};

/**
 * Strapi Course (main content type)
 * Content Type: api::course.course
 */
export type StrapiCourse = {
  id: number;
  documentId: string;
  nome: string;
  id_do_curso: string;
  sobre?: StrapiBlock[]; // Rich text field (Blocks)
  metodologia?: StrapiBlock[]; // Rich text field (Blocks)
  grade_curricular?: StrapiBlock[]; // Rich text field (Blocks)
  certificado?: StrapiBlock[]; // Rich text field (Blocks)
  capa?: StrapiMedia | null;
  instituicao?: {
    id: number;
    documentId: string;
    nome: string;
    slug: string;
  } | null;
  projeto_pedagogico?: StrapiBlock[]; // Rich text field (Blocks)
  destaque?: boolean;
  coordenadores?: StrapiTeacher[];
  corpo_de_docentes?: StrapiTeacher[];
  faqs?: StrapiFAQ[];
  modalidades?: StrapiModality[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
};

/**
 * Strapi API Response wrappers
 */
export type StrapiCourseResponse = {
  data: StrapiCourse[];
  meta: StrapiMeta;
};
