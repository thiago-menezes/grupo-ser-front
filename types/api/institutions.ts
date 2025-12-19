export type InstitutionDTO = {
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

export type InstitutionsResponseDTO = {
  institution: InstitutionDTO;
};

export type InstitutionsErrorDTO = {
  error: string;
  message?: string;
};
