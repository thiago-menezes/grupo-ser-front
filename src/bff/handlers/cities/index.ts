import { clientApiFetch, buildClientApiUrl } from '../../services/client-api';

export type City = {
  nome: string;
  estado: string;
};

export async function fetchCities(query?: string): Promise<City[]> {
  const url = buildClientApiUrl('/cs/cidades', { c: query });
  return clientApiFetch<City[]>(url);
}

export * from './autocomplete';
