export type UnitDTO = {
  id: number;
  documentId: string;
  unitId: number | null;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  photos?: unknown[];
  institution?: {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    code?: string | null;
    defaultCity?: string | null;
    defaultState?: string | null;
    active?: boolean;
    description?: string | null;
    website?: string | null;
    primaryColor?: string | null;
    secondaryColor?: string | null;
  };
};

export type UnitsResponseDTO = {
  data: UnitDTO[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type UnitsErrorDTO = {
  error: string;
  message?: string;
};
