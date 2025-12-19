export type HomePromoBannerQueryParams = {
  institutionSlug: string;
  noCache?: boolean;
};

export type StrapiHomePromoBannerItem = {
  id: number;
  documentId: string;
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

export type StrapiHomePromoBannerResponse = {
  data: StrapiHomePromoBannerItem[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};
