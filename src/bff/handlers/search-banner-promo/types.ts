export type SearchBannerPromoQueryParams = {
  institutionSlug: string;
  noCache?: boolean;
};

export type StrapiSearchBannerPromoItem = {
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

export type StrapiSearchBannerPromoResponse = {
  data: StrapiSearchBannerPromoItem[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};
