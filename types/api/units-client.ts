export type UnitsClientUnitDTO = {
  id: number;
  name: string;
  state: string;
  city: string;
};

export type UnitsClientResponseDTO = {
  data: UnitsClientUnitDTO[];
  meta: {
    total: number;
    institution: string;
    state: string;
    city: string;
  };
};

export type UnitsClientErrorDTO = {
  error: string;
  message?: string;
};
