export type HomeCarouselItemDTO = {
  id: number;
  name: string | null;
  link?: string | null;
  imageUrl: string | null;
  imageAlt?: string | null;
};

export type HomeCarouselResponseDTO = {
  data: HomeCarouselItemDTO[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type HomeCarouselsErrorDTO = {
  error: string;
  message?: string;
};
