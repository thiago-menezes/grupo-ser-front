export type SearchBannerPromoItemDTO = {
  id: number;
  link: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
};

export type SearchBannerPromosResponseDTO = {
  data: SearchBannerPromoItemDTO[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type SearchBannerPromosErrorDTO = {
  error: string;
  message?: string;
};
