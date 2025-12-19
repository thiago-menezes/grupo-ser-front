export type HomeCarouselQueryParams = {
  institutionSlug: string;
  noCache?: boolean;
};

export type StrapiHomeCarouselItem = {
  id: number;
  documentId: string;
  nome: string;
  link?: string | null;
  imagem?: {
    id: number;
    url: string;
    alternativeText?: string | null;
  } | null;
  instituicao?: {
    id: number;
    slug: string;
  } | null;
};

export type StrapiHomeCarouselResponse = {
  data: StrapiHomeCarouselItem[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};
