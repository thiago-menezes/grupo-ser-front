/* eslint-disable no-console */
/**
 * Cities service for fetching Brazilian cities from BrasilAPI
 */

const BRASIL_API_BASE_URL = 'https://brasilapi.com.br/api/ibge/municipios/v1';

export interface City {
  city: string;
  state: string;
  code: string;
}

interface BrasilApiMunicipio {
  nome: string;
  codigo_ibge: string;
}

interface BrasilApiState {
  id: number;
  sigla: string;
  nome: string;
}

// Cache simples em memória com TTL de 1 hora
const cache = new Map<string, { data: City[]; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hora em milissegundos

/**
 * Normalize string for search (remove accents, lowercase)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Convert city name to slug format
 */
function cityToSlug(cityName: string): string {
  return normalizeString(cityName)
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Capitalize city name properly
 */
function capitalizeCityName(name: string): string {
  return name
    .split(' ')
    .map((word) => {
      // Handle special cases like "de", "da", "do", "dos", "das"
      const lowerWords = ['de', 'da', 'do', 'dos', 'das', 'e'];
      if (lowerWords.includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Get state code from state name or code
 */
function getStateCode(state: string): string {
  const stateMap: Record<string, string> = {
    acre: 'AC',
    alagoas: 'AL',
    amapa: 'AP',
    amazonas: 'AM',
    bahia: 'BA',
    ceara: 'CE',
    'distrito federal': 'DF',
    'espirito santo': 'ES',
    goias: 'GO',
    maranhao: 'MA',
    'mato grosso': 'MT',
    'mato grosso do sul': 'MS',
    'minas gerais': 'MG',
    para: 'PA',
    paraiba: 'PB',
    parana: 'PR',
    pernambuco: 'PE',
    piaui: 'PI',
    'rio de janeiro': 'RJ',
    'rio grande do norte': 'RN',
    'rio grande do sul': 'RS',
    rondonia: 'RO',
    roraima: 'RR',
    'santa catarina': 'SC',
    'sao paulo': 'SP',
    sergipe: 'SE',
    tocantins: 'TO',
  };

  const normalized = normalizeString(state);
  if (stateMap[normalized]) {
    return stateMap[normalized];
  }

  // If already a code (2 letters), return uppercase
  if (state.length === 2) {
    return state.toUpperCase();
  }

  return state.toUpperCase();
}

/**
 * Fetch all municipalities from BrasilAPI
 */
async function fetchAllMunicipalities(): Promise<City[]> {
  const cacheKey = 'all';
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    // First, get all states
    const statesResponse = await fetch(
      'https://brasilapi.com.br/api/ibge/uf/v1',
    );
    if (!statesResponse.ok) {
      throw new Error(`Failed to fetch states: ${statesResponse.status}`);
    }

    const states = (await statesResponse.json()) as BrasilApiState[];

    // Then fetch municipalities for each state
    const allMunicipalities: City[] = [];

    for (const state of states) {
      try {
        const response = await fetch(`${BRASIL_API_BASE_URL}/${state.sigla}`);
        if (!response.ok) {
          console.warn(
            `Failed to fetch municipalities for ${state.sigla}: ${response.status}`,
          );
          continue;
        }

        const municipalities = (await response.json()) as BrasilApiMunicipio[];

        municipalities.forEach((municipio) => {
          allMunicipalities.push({
            city: capitalizeCityName(municipio.nome),
            state: state.sigla.toUpperCase(),
            code: municipio.codigo_ibge,
          });
        });
      } catch (error) {
        console.error(
          `Error fetching municipalities for ${state.sigla}:`,
          error,
        );
      }
    }

    // Sort by city name
    allMunicipalities.sort((a, b) => a.city.localeCompare(b.city));

    // Update cache
    cache.set(cacheKey, {
      data: allMunicipalities,
      timestamp: Date.now(),
    });

    return allMunicipalities;
  } catch (error) {
    console.error('Error fetching all municipalities:', error);
    // Return cached data if available, even if expired
    if (cached) {
      return cached.data;
    }
    return [];
  }
}

/**
 * Search cities by query string
 */
export async function searchCities(
  query: string,
  state?: string,
): Promise<City[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const normalizedQuery = normalizeString(query);
  const stateCode = state ? getStateCode(state) : undefined;

  try {
    const allCities = await fetchAllMunicipalities();

    // Filter cities
    const filtered = allCities.filter((city) => {
      const matchesQuery =
        normalizeString(city.city).includes(normalizedQuery) ||
        normalizeString(city.state).includes(normalizedQuery);

      if (!matchesQuery) {
        return false;
      }

      if (stateCode) {
        return city.state.toUpperCase() === stateCode.toUpperCase();
      }

      return true;
    });

    // Limit to 50 results
    return filtered.slice(0, 50);
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

/**
 * Get city by IBGE code
 */
export async function getCityByCode(code: string): Promise<City | null> {
  try {
    const allCities = await fetchAllMunicipalities();
    return allCities.find((city) => city.code === code) || null;
  } catch (error) {
    console.error('Error getting city by code:', error);
    return null;
  }
}

/**
 * Format city value for technical use (city:slug-state:uf)
 */
export function formatCityValue(city: string, state: string): string {
  const slug = cityToSlug(city);
  const stateCode = getStateCode(state).toLowerCase();
  return `${slug}-${stateCode}`;
}

/**
 * Parse city value from technical format
 */
export function parseCityValue(
  value: string,
): { city: string; state: string } | null {
  const legacyMatch = value.match(/^city:(.+?)-state:([a-z]{2})$/i);
  if (legacyMatch) {
    return {
      city: legacyMatch[1].replace(/-/g, ' '),
      state: legacyMatch[2].toUpperCase(),
    };
  }

  const normalized = value.trim();
  const lastDash = normalized.lastIndexOf('-');
  if (lastDash <= 0) return null;

  const citySlug = normalized.slice(0, lastDash);
  const stateCode = normalized.slice(lastDash + 1).toUpperCase();
  if (stateCode.length !== 2) return null;

  return {
    city: citySlug.replace(/-/g, ' '),
    state: stateCode,
  };
}
