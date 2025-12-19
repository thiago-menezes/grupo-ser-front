import type { AutocompleteResponse } from 'types/api/autocomplete';

export type CoursesAutocompleteResponseDTO = AutocompleteResponse;

export type CoursesAutocompleteErrorDTO = {
  error: string;
  message?: string;
};
