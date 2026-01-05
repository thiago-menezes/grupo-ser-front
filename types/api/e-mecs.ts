export type EMecDTO = {
  id: number;
  link?: string | null;
  qrCode: string | null;
};

export type EMecResponseDTO = {
  data: EMecDTO[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type EMecErrorDTO = {
  error: string;
  message?: string;
};
