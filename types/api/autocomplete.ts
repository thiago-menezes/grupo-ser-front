export interface AutocompleteQueryParams {
  type: 'cities' | 'courses';
  q?: string;
}

export type AutocompleteResponse = {
  type: 'cities' | 'courses';
  results: Array<
    | {
        label: string;
        value: string;
        city: string;
        state: string;
      }
    | {
        id: number;
        label: string;
        value: string;
        slug: string;
        level: string;
        type: string;
      }
  >;
};
