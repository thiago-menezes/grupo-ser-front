'use client';

import { useEffect, useState } from 'react';

type GeolocationState = {
  city: string | null;
  state: string | null;
  coordinates: { lat: number; lng: number } | null;
  isLoading: boolean;
  error: GeolocationPositionError | null;
  permissionDenied: boolean;
  requestPermission: () => void;
};

const DEFAULT_CITY = 'Recife';
const DEFAULT_STATE = 'PE';

type UseGeolocationOptions = {
  manualCity?: string | null;
  manualState?: string | null;
  institutionDefaultCity?: string | null;
  institutionDefaultState?: string | null;
  skip?: boolean; // Skip geolocation request if true
};

export function useGeolocation(
  options?: UseGeolocationOptions,
): GeolocationState {
  const {
    manualCity,
    manualState,
    institutionDefaultCity,
    institutionDefaultState,
    skip = false,
  } = options || {};
  const [city, setCity] = useState<string | null>(null);
  const [state, setState] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const reverseGeocode = async (
    latitude: number,
    longitude: number,
  ): Promise<{ city: string; state: string }> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`,
      );

      if (!response.ok) {
        throw new Error(`Geocoding API failed: ${response.status}`);
      }

      const data = await response.json();

      // Extract city name (prefer city, fallback to locality)
      const cityName = (data.city || data.locality || '').trim();

      // Extract state code from principalSubdivisionCode (format: "BR-MS" or "MS")
      let stateCode = DEFAULT_STATE;
      if (data.principalSubdivisionCode) {
        const parts = data.principalSubdivisionCode.split('-');
        // Take the last part (handles both "BR-MS" and "MS" formats)
        stateCode = parts[parts.length - 1].toUpperCase();
      } else if (data.principalSubdivision) {
        // Fallback: try to extract from principalSubdivision name
        // This is less reliable but might work in some cases
        const subdivision = data.principalSubdivision.toUpperCase();
        // Common Brazilian state abbreviations
        const stateMap: Record<string, string> = {
          'MATO GROSSO DO SUL': 'MS',
          'MATO GROSSO': 'MT',
          'SÃO PAULO': 'SP',
          'RIO DE JANEIRO': 'RJ',
          'MINAS GERAIS': 'MG',
          PERNAMBUCO: 'PE',
          BAHIA: 'BA',
          CEARÁ: 'CE',
          CEARA: 'CE',
          'DISTRITO FEDERAL': 'DF',
          AMAZONAS: 'AM',
        };

        // Try to find matching state
        for (const [key, value] of Object.entries(stateMap)) {
          if (subdivision.includes(key)) {
            stateCode = value;
            break;
          }
        }
      }

      return {
        city: cityName || DEFAULT_CITY,
        state: stateCode || DEFAULT_STATE,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in reverse geocoding:', error);
      return { city: DEFAULT_CITY, state: DEFAULT_STATE };
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError(null);
      setPermissionDenied(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { city: geocodedCity, state: geocodedState } =
            await reverseGeocode(
              position.coords.latitude,
              position.coords.longitude,
            );
          setCity(geocodedCity);
          setState(geocodedState);
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setPermissionDenied(false);
          setIsLoading(false);
        } catch {
          setCity(DEFAULT_CITY);
          setState(DEFAULT_STATE);
          setCoordinates(null);
          setIsLoading(false);
        }
      },
      (err) => {
        setError(err);
        setPermissionDenied(
          err.code === GeolocationPositionError.PERMISSION_DENIED,
        );
        setIsLoading(false);
      },
    );
  };

  useEffect(() => {
    // Skip geolocation if skip option is true (user has saved preference)
    if (skip) {
      return;
    }

    // Try to get location on mount - browser will show permission popup
    if (navigator.geolocation) {
      getLocation();
    } else {
      setPermissionDenied(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]);

  // Use manual override if provided, otherwise use geolocation result
  // Only use default if permission was explicitly denied
  const getDefaultCity = () => {
    if (permissionDenied) {
      return institutionDefaultCity || DEFAULT_CITY;
    }
    return null;
  };

  const getDefaultState = () => {
    if (permissionDenied) {
      return institutionDefaultState || DEFAULT_STATE;
    }
    return null;
  };

  const finalCity =
    manualCity !== undefined && manualCity !== null && manualCity !== ''
      ? manualCity
      : city || getDefaultCity();
  const finalState =
    manualState !== undefined && manualState !== null && manualState !== ''
      ? manualState
      : state || getDefaultState();

  return {
    city: finalCity,
    state: finalState,
    coordinates,
    isLoading,
    error,
    permissionDenied,
    requestPermission: getLocation,
  };
}
