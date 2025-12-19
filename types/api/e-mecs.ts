export type EMecItemDTO = {
  id: number;
  link?: string | null;
  qrcodeUrl: string | null;
  qrcodeAlt?: string | null;
};

export type EMecResponseDTO = {
  data: EMecItemDTO[];
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
