export type EMecQueryParams = {
  institutionSlug: string;
  noCache?: boolean;
};

export type StrapiEMecItem = {
  id: number;
  documentId: string;
  link?: string | null;
  qrcode?: {
    id: number;
    url: string;
    alternativeText?: string | null;
  } | null;
  instituicao?: {
    id: number;
    slug: string;
  } | null;
};

export type StrapiEMecResponse = {
  data: StrapiEMecItem[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};
