/* eslint-disable no-console */
/**
 * Geolocation service for server-side geocoding
 */

const DEFAULT_CITY = 'São José dos Campos';
const DEFAULT_STATE = 'SP';

export interface GeolocationResult {
  city: string;
  state: string;
  coordinates: { lat: number; lng: number } | null;
}

/**
 * Reverse geocode coordinates to city and state
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<{ city: string; state: string }> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`,
    );

    if (!response.ok) {
      throw new Error(`Geocoding API failed: ${response.status}`);
    }

    const data = (await response.json()) as {
      city: string;
      locality: string;
      principalSubdivisionCode: string;
    };
    return {
      city: data.city || data.locality || DEFAULT_CITY,
      state: data.principalSubdivisionCode?.split('-')[1] || DEFAULT_STATE,
    };
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return { city: DEFAULT_CITY, state: DEFAULT_STATE };
  }
}

/**
 * Get location from coordinates
 */
export async function getLocationFromCoordinates(
  lat: number,
  lng: number,
): Promise<GeolocationResult> {
  const { city, state } = await reverseGeocode(lat, lng);
  return {
    city,
    state,
    coordinates: { lat, lng },
  };
}

/**
 * Get default location
 */
export function getDefaultLocation(): GeolocationResult {
  return {
    city: DEFAULT_CITY,
    state: DEFAULT_STATE,
    coordinates: null,
  };
}
