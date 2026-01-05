export type HomeCarouselItemDTO = {
  id: number;
  name: string;
  link?: string | null;
  image: string | null;
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
