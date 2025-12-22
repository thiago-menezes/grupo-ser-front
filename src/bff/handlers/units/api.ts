import { clientApiFetch, getClientApiConfig } from '../../services/client-api';

export type Unit = {
  ID: number;
  Nome_Unidade: string;
  Estado: string;
  Cidade: string;
};

export type UnitsResponse = {
  Unidades: Unit[];
};

export type UnitsNewResponse = {
  data: Unit[];
};

export type UnitsQueryParams = {
  marca?: string;
  estado?: string;
  cidade?: string;
};

export async function fetchUnits(
  institution: string,
  state: string,
  city: string,
): Promise<UnitsResponse> {
  const { baseUrl } = getClientApiConfig();
  const url = `${baseUrl}/p/${institution.toLowerCase()}/${state.toLowerCase()}/${encodeURIComponent(city.toLowerCase())}/unidades`;
  return clientApiFetch<UnitsResponse>(url);
}

export async function fetchUnitsByCourse(
  institution: string,
  state: string,
  city: string,
  courseId: string,
): Promise<UnitsResponse> {
  const { baseUrl } = getClientApiConfig();
  const url = `${baseUrl}/p/${institution.toLowerCase()}/${state.toLowerCase()}/${encodeURIComponent(city.toLowerCase())}/cursos/${courseId}/unidades`;
  return clientApiFetch<UnitsResponse>(url);
}

export async function fetchUnitsNew(
  params: UnitsQueryParams,
): Promise<UnitsNewResponse> {
  const { baseUrl } = getClientApiConfig();
  const searchParams = new URLSearchParams();
  if (params.marca) searchParams.append('marca', params.marca);
  if (params.estado) searchParams.append('estado', params.estado);
  if (params.cidade) searchParams.append('cidade', params.cidade);
  const url = `${baseUrl}/cursos/unidades?${searchParams.toString()}`;
  return clientApiFetch<UnitsNewResponse>(url);
}
