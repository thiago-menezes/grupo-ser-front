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
