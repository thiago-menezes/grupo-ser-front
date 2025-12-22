'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import useLocalStorage from 'use-local-storage';

type CitySource = 'default' | 'geolocation' | 'manual';

type CityStorageData = {
  city: string;
  state: string;
  timestamp: number;
  source?: CitySource;
};

type CityContextValue = {
  city: string;
  state: string;
  source: CitySource;
  setCityState: (city: string, state: string, source?: CitySource) => void;
  focusCityField: () => void;
  setFocusCityFieldCallback: (callback: () => void) => void;
};

const CityContext = createContext<CityContextValue | undefined>(undefined);

const CITY_STORAGE_KEY = 'grupo-ser:selected-city';
const DEFAULT_CITY_DATA: CityStorageData = {
  city: '',
  state: '',
  timestamp: Date.now(),
  source: 'default',
};

/**
 * Words that should remain lowercase in city names (Portuguese prepositions and articles)
 */
const LOWERCASE_WORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em']);

/**
 * Capitalize a city name properly for Brazilian cities
 * Handles prepositions and special characters
 */
function capitalizeCityName(name: string): string {
  return name
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      // First word is always capitalized
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      // Keep prepositions and articles lowercase
      if (LOWERCASE_WORDS.has(word)) {
        return word;
      }
      // Capitalize other words
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Parse city from URL format: city:name-state:code
 * Returns null if invalid format
 */
function parseCityFromUrl(
  urlValue: string,
): { city: string; state: string } | null {
  const legacyMatch = urlValue.match(/^city:(.+?)-state:([a-z]{2})$/i);
  if (legacyMatch) {
    const cityName = capitalizeCityName(legacyMatch[1].replace(/-/g, ' '));
    const stateCode = legacyMatch[2].toUpperCase();
    return { city: cityName, state: stateCode };
  }

  const normalized = urlValue.trim();
  const lastDash = normalized.lastIndexOf('-');
  if (lastDash > 0) {
    const cityPart = capitalizeCityName(
      normalized.slice(0, lastDash).replace(/-/g, ' '),
    );
    const statePart = normalized.slice(lastDash + 1).toUpperCase();
    if (statePart.length === 2) {
      return { city: cityPart, state: statePart };
    }
  }
  return null;
}

export function CityProvider({ children }: { children: ReactNode }) {
  const [cityData, setCityData] = useLocalStorage<CityStorageData>(
    CITY_STORAGE_KEY,
    DEFAULT_CITY_DATA,
  );
  const [focusCallback, setFocusCallback] = useState<(() => void) | null>(null);

  // Check URL parameters on mount (priority over localStorage)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const cityFromUrl = urlParams.get('city');
    const stateFromUrl = urlParams.get('state');

    if (cityFromUrl) {
      const parsed = parseCityFromUrl(cityFromUrl);
      if (parsed) {
        // URL takes priority - update localStorage with manual source
        setCityData({
          city: parsed.city,
          state: parsed.state,
          timestamp: Date.now(),
          source: 'manual',
        });
        return;
      }

      // Support plain query params (used by course details pages), e.g. ?city=ananindeua&state=pa
      if (stateFromUrl) {
        setCityData({
          city: capitalizeCityName(cityFromUrl),
          state: stateFromUrl.toUpperCase(),
          timestamp: Date.now(),
          source: 'manual',
        });
      }
    }
  }, [setCityData]);

  // Always ensure city name is properly capitalized (handles legacy lowercase values in localStorage)
  const city = cityData.city ? capitalizeCityName(cityData.city) : '';
  const state = cityData.state ? cityData.state.toUpperCase() : '';
  const source = cityData.source || 'default';

  const setCityState = useCallback(
    (newCity: string, newState: string, newSource: CitySource = 'manual') => {
      setCityData({
        city: newCity,
        state: newState,
        timestamp: Date.now(),
        source: newSource,
      });
    },
    [setCityData],
  );

  const focusCityField = useCallback(() => {
    focusCallback?.();
  }, [focusCallback]);

  const setFocusCityFieldCallback = useCallback((callback: () => void) => {
    setFocusCallback(() => callback);
  }, []);

  return (
    <CityContext.Provider
      value={{
        city,
        state,
        source,
        setCityState,
        focusCityField,
        setFocusCityFieldCallback,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCityContext() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCityContext must be used within a CityProvider');
  }
  return context;
}
