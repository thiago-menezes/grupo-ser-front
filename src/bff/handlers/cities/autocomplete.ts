import { fetchCities } from './index';

export type CityAutocompleteResult = {
  label: string;
  value: string;
  city: string;
  state: string;
};

export type CitiesAutocompleteResponse = {
  results: CityAutocompleteResult[];
};

function formatCityValue(city: string, state: string): string {
  return `${city.toLowerCase()}-${state.toLowerCase()}`;
}

export async function handleCitiesAutocomplete(
  query: string = '',
): Promise<CitiesAutocompleteResponse> {
  const cities = await fetchCities(query);

  return {
    results: cities.map((city) => ({
      label: `${city.nome} - ${city.estado}`,
      value: formatCityValue(city.nome, city.estado),
      city: city.nome,
      state: city.estado,
    })),
  };
}
