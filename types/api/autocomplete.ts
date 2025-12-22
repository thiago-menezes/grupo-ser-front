export type AutocompleteQueryParams = {
  type: 'cities' | 'courses';
  q?: string;
  marca?: string;
  estado?: string;
  cidade?: string;
  modalidade?: string;
};

export type CityAutocompleteResult = {
  label: string;
  value: string;
  city: string;
  state: string;
};

export type CourseAutocompleteResult = {
  label: string;
  value: string;
  modalidade: string;
  periodo: string;
};

export type AutocompleteResponse = {
  type: 'cities' | 'courses';
  results: Array<CityAutocompleteResult | CourseAutocompleteResult>;
};
