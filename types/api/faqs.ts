export type FaqItemDTO = {
  id: number;
  question: string | null;
  answer: string | null;
};

export type FaqsResponseDTO = {
  data: FaqItemDTO[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type FaqsErrorDTO = {
  error: string;
  message?: string;
};
