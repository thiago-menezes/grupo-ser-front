/**
 * Strapi type definitions for Course-related content types
 * Maps Portuguese field names from Strapi to TypeScript interfaces
 */

/**
 * Strapi Meta type for pagination
 */
export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

/**
 * Strapi Media/Image type
 */
export interface StrapiMedia {
  id: number;
  documentId?: string;
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: Record<string, unknown>;
}

/**
 * Nested relation types
 */
export interface StrapiCategoryNested {
  id: number;
  documentId?: string;
  nome: string;
  slug?: string;
}

export interface StrapiModalityNested {
  id: number;
  documentId?: string;
  nome: string;
  slug?: string;
}

export interface StrapiPeriodNested {
  id: number;
  documentId?: string;
  nome: string;
}

export interface StrapiUnitNested {
  id: number;
  documentId?: string;
  id_unidade?: number | null;
  nome: string;
  endereco?: string | null;
  cidade?: string | null;
  estado?: string | null;
  latitude?: number;
  longitude?: number;
  instituicao?: {
    id: number;
    nome: string;
    slug: string;
  };
}

/**
 * Strapi Course Offering (Oferta)
 */
export interface StrapiOferta {
  id: number;
  documentId?: string;
  preco: number | null;
  duracao: string;
  ativo: boolean;
  inscricoes_abertas: boolean;
  unidade: StrapiUnitNested;
  modalidade: StrapiModalityNested;
  periodo: StrapiPeriodNested;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

/**
 * Strapi Related Course (simplified)
 */
export interface StrapiRelatedCourse {
  id: number;
  documentId?: string;
  nome: string;
  slug: string;
  sku?: string | null;
  tipo?: string | null;
  duracao_padrao?: string | null;
}

/**
 * Strapi Coordinator embedded in Course
 */
export interface StrapiCourseCoordinator {
  id: number;
  documentId: string;
  nome: string;
  descricao?: string | null;
  telefone?: string | null;
  foto?: StrapiMedia | null;
}

/**
 * Strapi Teacher embedded in Course
 */
export interface StrapiCourseTeacher {
  id: number;
  documentId: string;
  nome: string;
  materia?: string | null;
  foto?: StrapiMedia | null;
  modalidades?: StrapiModalityNested[];
}

/**
 * Strapi Course (main content type)
 * Content Type: api::course.course
 */
export interface StrapiCourse {
  id: number;
  documentId: string;
  nome: string;
  slug: string;
  sku?: string | null;
  id_do_curso?: number | string | null;
  // "sobre" is the description field in Strapi
  sobre?: string | null;
  descricao?: string | null; // fallback field name
  tipo?: string | null; // "Bacharelado" | "Tecnólogo" | "Licenciatura"
  carga_horaria?: number | null;
  duracao_padrao?: string | null;
  projeto_pedagogico?: string | null; // Rich text field
  metodologia?: string | null; // Rich text field
  certificado?: string | null; // Rich text field
  grade_curricular?: string | null; // Markdown field
  areas_atuacao?: string[] | null; // JSON field
  faixas_salariais?: Array<{
    level: string;
    range: string;
    description: string;
    icon?: string;
  }> | null; // JSON field
  // "capa" is the cover image in Strapi
  capa?: StrapiMedia | null;
  // Direct relations (not from ofertas)
  modalidades?: StrapiModalityNested[];
  // Embedded relations
  curso_coordenacao?: StrapiCourseCoordinator | null;
  curso_corpo_docentes?: StrapiCourseTeacher[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

/**
 * Strapi Coordinator (Coordenação)
 * Content Type: api::coordenacao.coordenacao
 */
export interface StrapiCoordenacao {
  id: number;
  documentId: string;
  nome: string;
  descricao: string;
  foto?: StrapiMedia | null;
  email?: string | null;
  telefone?: string | null;
  curso: number | StrapiCourse; // Can be ID or populated object
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

/**
 * Strapi Teaching Staff (Corpo Docente)
 * Content Type: api::corpo-docente.corpo-docente
 */
export interface StrapiCorpoDocente {
  id: number;
  documentId: string;
  nome: string;
  cargo: string; // "Professor Titular", "Professor Assistente"
  titulacao?: string | null; // "Doutor", "Mestre", "Especialista"
  foto?: StrapiMedia | null;
  ordem?: number | null; // Display order
  curso: number | StrapiCourse; // Can be ID or populated object
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

/**
 * Strapi API Response wrappers
 */
export type StrapiCourseResponse = {
  data: StrapiCourse[];
  meta: StrapiMeta;
};

export type StrapiCoordinatorResponse = {
  data: StrapiCoordenacao[];
  meta: StrapiMeta;
};

export type StrapiTeachersResponse = {
  data: StrapiCorpoDocente[];
  meta: StrapiMeta;
};
