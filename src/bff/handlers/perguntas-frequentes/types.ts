import type { StrapiMeta } from '../courses/types-strapi';

export type PerguntasFrequentesQueryParams = {
  institutionSlug: string;
  noCache?: boolean;
};

export type StrapiPerguntaFrequente = {
  id: number;
  documentId: string;
  pergunta: string;
  resposta: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  instituicao?: {
    id: number;
    documentId: string;
    slug: string;
    nome: string;
  } | null;
};

export type FaqDTO = {
  id: number;
  documentId: string;
  question: string;
  answer: string;
};

export type PerguntasFrequentesResponseDTO = {
  data: FaqDTO[];
  meta: StrapiMeta;
};

export type StrapiPerguntasFrequentesResponse = {
  data: StrapiPerguntaFrequente[];
  meta: StrapiMeta;
};
