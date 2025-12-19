export const HOME_HERO_QUERY_KEY = ['home-hero'] as const;

export const DEFAULT_HERO_CONTENT = {
  backgroundImage: {
    url: 'https://placehold.co/1800x720.png',
    alternativeText: 'Hero banner background',
  },
  showCarouselControls: true,
  showQuickSearch: true,
};

export const CAROUSEL_CONFIG = {
  autoAdvanceInterval: 5000,
  transitionDuration: 300,
} as const;

export type CityOption = {
  label: string;
  value: string;
  city: string;
  state: string;
};

export const MOCK_CITIES: CityOption[] = [
  {
    label: 'Recife - PE',
    value: 'recife-pe',
    city: 'Recife',
    state: 'PE',
  },
  {
    label: 'Campo Grande - MS',
    value: 'campo-grande-ms',
    city: 'Campo Grande',
    state: 'MS',
  },
  {
    label: 'São Paulo - SP',
    value: 'sao-paulo-sp',
    city: 'São Paulo',
    state: 'SP',
  },
  {
    label: 'Rio de Janeiro - RJ',
    value: 'rio-de-janeiro-rj',
    city: 'Rio de Janeiro',
    state: 'RJ',
  },
  {
    label: 'Salvador - BA',
    value: 'salvador-ba',
    city: 'Salvador',
    state: 'BA',
  },
  {
    label: 'Brasília - DF',
    value: 'brasilia-df',
    city: 'Brasília',
    state: 'DF',
  },
  {
    label: 'Fortaleza - CE',
    value: 'fortaleza-ce',
    city: 'Fortaleza',
    state: 'CE',
  },
  {
    label: 'Belo Horizonte - MG',
    value: 'belo-horizonte-mg',
    city: 'Belo Horizonte',
    state: 'MG',
  },
  {
    label: 'Manaus - AM',
    value: 'manaus-am',
    city: 'Manaus',
    state: 'AM',
  },
  {
    label: 'Região Metropolitana de Campinas - SP',
    value: 'região-metropolitana-de-campinas-sp',
    city: 'Região Metropolitana de Campinas',
    state: 'SP',
  },
];
