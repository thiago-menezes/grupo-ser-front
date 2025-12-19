export type AreasInteresseQueryParams = {
  institutionSlug: string;
  noCache?: boolean;
};

export type StrapiRichTextChild = {
  type: string;
  text: string;
};

export type StrapiRichTextBlock = {
  type: string;
  children: StrapiRichTextChild[];
};

export type StrapiAreaInteresse = {
  id: number;
  documentId: string;
  nome: string;
  subareas: StrapiRichTextBlock[];
  capa?: {
    id: number;
    url: string;
    alternativeText?: string | null;
  } | null;
  instituicao?: {
    count: number;
  } | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string | null;
};

export type StrapiAreasInteresseResponse = {
  data: StrapiAreaInteresse[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};
