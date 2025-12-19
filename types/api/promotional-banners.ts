export type PromotionalBannerItemDTO = {
  id: number;
  link?: string | null;
  imageUrl: string | null;
  imageAlt?: string | null;
};

export type PromotionalBannersResponseDTO = {
  data: PromotionalBannerItemDTO[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type PromotionalBannersErrorDTO = {
  error: string;
  message?: string;
};
