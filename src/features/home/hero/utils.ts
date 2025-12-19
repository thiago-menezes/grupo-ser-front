import type { CityOption } from './constants';

export function buildSearchParams(data: {
  city?: string;
  course?: string;
  modalities?: string[];
  courseLevel?: string;
}): URLSearchParams {
  const params = new URLSearchParams();

  if (data.city?.trim()) {
    // Keep the full technical format in URL for proper formatting on search page
    params.append('city', data.city.trim());
  }

  if (data.course?.trim()) {
    params.append('course', data.course.trim());
  }

  if (data.courseLevel) {
    params.append('courseLevel', data.courseLevel);
  }

  if (data.modalities?.length) {
    data.modalities.forEach((m) => params.append('modalities', m));
  }

  return params;
}

export function parseCityValue(value: string): string {
  const legacyMatch = value.match(/^city:(.+?)-state:([a-z]{2})$/i);
  if (legacyMatch) {
    return legacyMatch[1].replace(/-/g, ' ');
  }

  const normalized = value.trim();
  const lastDash = normalized.lastIndexOf('-');
  if (lastDash > 0) {
    return normalized.slice(0, lastDash).replace(/-/g, ' ');
  }

  return value;
}

export function formatCityValue(city: string, state: string): string {
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');
  const stateCode = state.toLowerCase();
  return `${citySlug}-${stateCode}`;
}

/**
 * Normalize city name for matching (remove accents, lowercase, trim)
 */
function normalizeCityName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim();
}

/**
 * Find matching city from MOCK_CITIES based on geocoded city and state
 */
export function findMatchingCity(
  geocodedCity: string,
  geocodedState: string,
  availableCities: CityOption[],
): CityOption | null {
  const normalizedGeocodedCity = normalizeCityName(geocodedCity);
  const normalizedGeocodedState = geocodedState.toUpperCase().trim();

  // First try exact match (city and state)
  const exactMatch = availableCities.find(
    (c) =>
      normalizeCityName(c.city) === normalizedGeocodedCity &&
      c.state.toUpperCase() === normalizedGeocodedState,
  );

  if (exactMatch) {
    return exactMatch;
  }

  // Try partial match (city name contains or is contained by geocoded city)
  const partialMatch = availableCities.find((c) => {
    const normalizedCity = normalizeCityName(c.city);
    return (
      (normalizedCity.includes(normalizedGeocodedCity) ||
        normalizedGeocodedCity.includes(normalizedCity)) &&
      c.state.toUpperCase() === normalizedGeocodedState
    );
  });

  if (partialMatch) {
    return partialMatch;
  }

  return null;
}
